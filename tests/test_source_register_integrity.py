"""Integrity checks for the research source registry."""
from __future__ import annotations

import csv
import json
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE_REGISTER = ROOT / "research" / "SOURCE-REGISTER.csv"
IPA_QUEUE = ROOT / "research" / "ipa-adjudication-queue.json"
SURFACE_FIXTURE = ROOT / "tests" / "fixtures" / "g2pk-surface-regression.json"
LEXICAL_DATA = ROOT / "data" / "korean" / "lexical_pronunciations.csv"
EXPECTED_COLUMNS = [
    "source_id",
    "source_type",
    "title_or_project",
    "url",
    "version_or_date",
    "authority_or_role",
    "license_status",
    "coverage",
    "contribution_expected",
    "review_status",
    "integration_status",
    "limitations_or_next_action",
]


def load_source_register() -> list[dict[str, str]]:
    with SOURCE_REGISTER.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        assert reader.fieldnames == EXPECTED_COLUMNS
        rows = list(reader)
    assert rows, "source register must not be empty"
    assert all(None not in row and all(value is not None for value in row.values()) for row in rows), (
        "every CSV row must contain exactly the declared columns"
    )
    return rows


def source_identity(url: str) -> tuple[str, ...]:
    parsed = urlsplit(url)
    query = parse_qs(parsed.query, keep_blank_values=True)
    if query.get("qna_seq"):
        return ("NIKL-QNA", query["qna_seq"][0])
    if query.get("mcfaq_seq"):
        return ("NIKL-MCFAQ", query["mcfaq_seq"][0])
    if query.get("ParaWordNo"):
        parts = [part for part in parsed.path.split("/") if part]
        language = parts[0] if parts and parts[0] in {"kor", "eng"} else "other"
        return ("KRDICT", language, query["ParaWordNo"][0])
    if query.get("c_file_name"):
        return ("NIKL-FILE", query.get("file_path", ["unknown"])[0], query["c_file_name"][0])
    if query.get("regltn_code") == ["0002"]:
        return ("NIKL-RULES", "0002")
    return ("URL", url)


def test_source_register_has_unique_nonblank_ids_and_stable_shape():
    rows = load_source_register()
    source_ids = [row["source_id"].strip() for row in rows]
    assert all(source_ids), "every source record needs a nonblank source_id"
    assert len(source_ids) == len(set(source_ids)), "source_id values must be unique"


def test_nikl_pronunciation_source_keeps_live_access_and_item_license_uncertainty_explicit():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-NIKL-PRON"]
    assert source["url"] == "https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002"
    assert source["integration_status"] == "blocked-live-source-access"
    assert "page-level marking not yet verified" in source["license_status"]
    assert "official full-text page opened" in source["review_status"]
    assert "HTTP 403" in source["limitations_or_next_action"]
    assert "manifest" in source["limitations_or_next_action"]


def test_nikl_copyright_policy_is_registered_without_claiming_item_level_clearance():
    rows = {row["source_id"]: row for row in load_source_register()}
    policy = rows["SRC-NIKL-COPYRIGHT-POLICY"]
    assert policy["source_type"] == "license_policy"
    assert policy["url"] == "https://www.korean.go.kr/front/nuri/pageView.do?mkn=3&page_id=P000189"
    assert "front/page/pageView.do?mn_id=105" not in policy["url"]
    assert "Article 24-2" in policy["license_status"]
    assert "KOGL" in policy["license_status"]
    assert "item-level" in policy["limitations_or_next_action"]
    assert "not established" in policy["limitations_or_next_action"]



def test_every_ipa_queue_surface_source_is_registered_with_an_exact_url():
    rows = load_source_register()
    registered_urls = {row["url"] for row in rows}
    queue = json.loads(IPA_QUEUE.read_text(encoding="utf-8"))
    surface = json.loads(SURFACE_FIXTURE.read_text(encoding="utf-8"))
    queue_urls = {item["surfaceEvidenceUrl"] for item in queue["cases"]}
    fixture_urls = {item["normativeSourceUrl"] for item in surface["cases"] if item.get("normativeSourceUrl")}
    missing = sorted((queue_urls | fixture_urls) - registered_urls)
    assert not missing, "IPA queue/surface-fixture source URL(s) missing from SOURCE-REGISTER.csv: " + ", ".join(missing)
    rows_by_id = {row["source_id"]: row for row in rows}
    assert rows_by_id["SRC-NIKL-QNA"]["integration_status"] == "exact_URL_coverage_tested_for_ipa_queue"


def test_ipa_queue_sources_keep_evidence_scope_and_item_license_uncertainty_explicit():
    rows = {row["source_id"]: row for row in load_source_register()}
    reading_example = rows["SRC-NIKL-QNA-306000"]
    assert "spelling" in reading_example["limitations_or_next_action"].lower()
    assert "not a direct pronunciation question" in reading_example["limitations_or_next_action"]
    assert "not verified" in reading_example["license_status"]

    value_of_money = rows["SRC-NIKL-MCFAQ-5949"]
    assert value_of_money["url"] == "https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5949&mn_id=217"
    assert "값어치[가버치]" in value_of_money["coverage"]
    assert "not verified" in value_of_money["license_status"]



def test_every_lexical_dataset_citation_has_a_source_register_identity():
    with LEXICAL_DATA.open("r", encoding="utf-8-sig", newline="") as stream:
        lexical_rows = list(csv.DictReader(stream))
    registered_rows = load_source_register()
    registered_identities = {source_identity(row["url"]) for row in registered_rows}
    cited_identities = {
        source_identity(row["source_url"])
        for row in lexical_rows
        if row.get("source_url", "").strip()
    }
    missing = sorted(cited_identities - registered_identities)
    assert not missing, "lexical source identities missing from SOURCE-REGISTER.csv: " + ", ".join(map(str, missing))


def test_unreviewed_lexical_citations_are_not_promoted_to_verified_evidence():
    rows = load_source_register()
    unreviewed = [
        row for row in rows
        if row["review_status"] == "unverified_lexical_citation_inventory_2026-10-22"
    ]
    assert len(unreviewed) == 16, "expected 16 citation-only records after the batch 29 review of Q&A 326978"
    for row in unreviewed:
        assert row["integration_status"] == "lexical_csv_citation_only"
        assert "not independently rechecked" in row["limitations_or_next_action"]
        assert "not verified" in row["license_status"].lower() or "not assessed" in row["license_status"].lower()



def test_orthography_qna_examples_are_not_described_as_direct_pronunciation_answers():
    with LEXICAL_DATA.open("r", encoding="utf-8-sig", newline="") as stream:
        lexical_rows = {row["input"]: row for row in csv.DictReader(stream)}
    for word in ("읽는", "읽지"):
        notes = lexical_rows[word]["rule_notes"]
        assert "orthography Q&A qna_seq=306000" in notes
        assert "not a direct pronunciation question" in notes
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-NIKL-QNA-306000"]
    assert "읽지 → 익찌" in source["coverage"]
    assert "not a direct pronunciation question" in source["limitations_or_next_action"]



def test_priority_nikl_lexical_sources_distinguish_direct_and_partial_attestation():
    rows = {row["source_id"]: row for row in load_source_register()}

    palatalization = rows["SRC-NIKL-QNA-313851"]
    assert palatalization["review_status"] == "direct_attestation_checked_2026-10-22"
    for example in ("곧이듣다[고지듣따]", "미닫이[미ː다지]", "굳히다[구치다]"):
        assert example in palatalization["coverage"]
    assert "item-level KOGL marking not verified" in palatalization["license_status"]

    wide_word = rows["SRC-NIKL-QNA-323289"]
    assert wide_word["review_status"] == "partial_attestation_checked_2026-10-22"
    assert "넓어[널버]" in wide_word["coverage"]
    assert "넓으니[널브니]" in wide_word["coverage"]
    assert "other lexical CSV forms are not directly enumerated" in wide_word["coverage"]
    assert "other forms require separate evidence" in wide_word["limitations_or_next_action"]

    pumsak = rows["SRC-NIKL-QNA-309950"]
    assert pumsak["review_status"] == "direct_attestation_checked_2026-10-22"
    for example in ("품삯을[품싹쓸]", "품삯으로[품싹쓰로]", "품삯이[품싹씨]"):
        assert example in pumsak["coverage"]



def test_dictionary_source_review_preserves_partial_attestation_scope():
    rows = {row["source_id"]: row for row in load_source_register()}

    good = rows["SRC-KRDICT-ENG-79033"]
    assert good["source_type"] == "dictionary_lexical_reviewed"
    assert good["review_status"] == "partial_lemma_application_support_2026-10-22"
    assert "좋다[조ː타]" in good["coverage"]
    assert "좋아[조ː아]" in good["coverage"]
    assert "좋아도 is not listed" in good["coverage"]
    assert "좋아도 remains rule-derived" in good["integration_status"]
    assert "not direct dictionary pronunciation attestation" in good["limitations_or_next_action"]
    assert "item-level KOGL rights remain unverified" in good["limitations_or_next_action"]

    pronunciation = rows["SRC-KRDICT-KOR-57199"]
    assert pronunciation["source_type"] == "dictionary_lexical_reviewed"
    assert pronunciation["review_status"] == "partial_lemma_support_2026-10-22"
    assert "발음[바름]" in pronunciation["coverage"]
    assert "발음과 is not listed" in pronunciation["coverage"]
    assert "particle-attached target remains derived" in pronunciation["integration_status"]
    assert "not the full form 발음과" in pronunciation["limitations_or_next_action"]
    assert "item-level KOGL rights remain unverified" in pronunciation["limitations_or_next_action"]

def test_2026_11_01_g2p_sources_keep_scope_and_license_provenance_explicit():
    rows = {row["source_id"]: row for row in load_source_register()}

    incident = rows["SRC-NIKL-QNA-313244"]
    assert "사건[사ː껀]" in incident["coverage"]
    assert "IPA is derived" in incident["contribution_expected"]
    assert "item-level" in incident["limitations_or_next_action"]

    popularity = rows["SRC-NIKL-QNA-331569"]
    assert "인기[인끼]" in popularity["coverage"]
    assert "optional" in popularity["coverage"].casefold()
    assert "provisional" in popularity["integration_status"]

    caution = rows["SRC-NIKL-QNA-337054"]
    assert "not clearly established" in caution["authority_or_role"]
    assert "Does not independently attest" in caution["limitations_or_next_action"]

    hanja = rows["SRC-KRDICT-ENG-72461"]
    assert "한자[한ː짜]" in hanja["coverage"]
    assert "item-level KOGL" in hanja["license_status"]
    assert "preserve long vowel" in hanja["limitations_or_next_action"]

    silsoo = rows["SRC-NIKL-QNA-330843"]
    assert "실수[실쑤]" in silsoo["coverage"]
    assert "§26" in silsoo["integration_status"]
    assert "item-level KOGL" in silsoo["license_status"]

    diphthong = rows["SRC-NIKL-QNA-326554"]
    assert "ㅟ" in diphthong["coverage"]
    assert "[wi]" in diphthong["coverage"]

    allophones = rows["SRC-OSU-KO-IPA-2022"]
    assert "broad_candidate" in allophones["integration_status"]
    assert "CC BY-NC" in allophones["license_status"]
    assert "not a normative" in allophones["limitations_or_next_action"]

    ipa_dict = rows["SRC-IPA-DICT-KO"]
    assert "CC BY-SA" in ipa_dict["license_status"]
    assert "broadly phonemic" in ipa_dict["authority_or_role"]

    ugtphon = rows["SRC-UGTPHON-EMNLP-2026"]
    assert "Apache-2.0" in ugtphon["license_status"]
    assert "CC BY-SA" in ugtphon["license_status"]
    assert "UGT" in ugtphon["limitations_or_next_action"]



def test_c08_context_fixture_restores_all_eight_source_rows_without_importing_ipa_gold():
    fixture_path = ROOT / "tests" / "fixtures" / "kozak-kim-c08-source-contexts.json"
    fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
    assert fixture["source_revision"] == "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
    assert fixture["source_license"].startswith("Apache-2.0")
    cases = fixture["cases"]
    assert {case["source_row_id"] for case in cases} == {
        "multilexnorm2026_1953", "multilexnorm2026_1979", "dc_inside_2024",
        "multilexnorm2026_1916", "multilexnorm2026_2011", "dc_inside_2186",
        "dc_inside_2266", "dc_inside_2557",
    }
    assert all(case["input"] in case["source_sentence"] for case in cases)
    assert all("ipa" not in case and "expected_ipa" not in case for case in cases)
    mapping = fixture["cluster_occurrence_mapping"]
    assert mapping["status"] == "ALL_EIGHT_SOURCE_ROWS_MAPPED_WITH_FIVE_HIGH_CONFIDENCE_RECONSTRUCTIONS"
    assert len(mapping["reconstructed_ids"]) == 5
    assert "original one-off C08 cluster extraction table" in " ".join(mapping["limitations"])
    unresolved = next(case for case in cases if case["source_row_id"] == "dc_inside_2024")
    assert unresolved["status"] == "UNRESOLVED_EXACT_LEXICAL_PRONUNCIATION"
    supported = next(case for case in cases if case["source_row_id"] == "multilexnorm2026_1953")
    assert supported["pronunciation_evidence"]["source_ids"] == ["SRC-NIKL-QNA-307960"]
    assert "exact corpus token" in supported["pronunciation_evidence"]["scope"]


def test_c08_morphology_sources_are_registered_with_limited_claim_scope():
    rows = {row["source_id"]: row for row in load_source_register()}
    for source_id, qna_id in [
        ("SRC-NIKL-QNA-313481", "313481"),
        ("SRC-NIKL-QNA-333044", "333044"),
    ]:
        source = rows[source_id]
        assert f"qna_seq={qna_id}" in source["url"]
        assert "dependent noun" in source["coverage"].lower()
        assert "pronunciation" in source["limitations_or_next_action"].lower()
        assert "ipa" in source["limitations_or_next_action"].lower()
        assert "item-level" in source["license_status"].lower()
    dependent_su = rows["SRC-NIKL-QNA-307960"]
    assert "qna_seq=307960" in dependent_su["url"]
    assert "[쑤]" in dependent_su["coverage"]
    assert "appears to contain a typo" in dependent_su["limitations_or_next_action"].lower()
    assert "item-level" in dependent_su["license_status"].lower()

    geo_source = rows["SRC-NIKL-QNA-310899"]
    assert "qna_seq=310899" in geo_source["url"]
    assert "dependent noun" in geo_source["coverage"]
    assert "colloquial" in geo_source["coverage"]
    assert "does not independently attest pronunciation" in geo_source["contribution_expected"]

    rule27 = rows["SRC-NIKL-QNA-317798"]
    assert "qna_seq=317798" in rule27["url"]
    assert "할 것을[할꺼슬]" in rule27["coverage"]
    assert "할 수는[할쑤는]" in rule27["coverage"]
    assert "pause" in rule27["coverage"]
    assert "not exact-token IPA" in rule27["contribution_expected"]

    su = rows["SRC-NIKL-QNA-331601"]
    assert "qna_seq=331601" in su["url"]
    assert "알 수 없는[알쑤엄는]" in su["coverage"]
    assert "Does not attest the exact corpus token" in su["limitations_or_next_action"]

    pdf = rows["SRC-NIKL-EDU-2021-DEPENDENT-SI"]
    assert "not used as production evidence" in pdf["limitations_or_next_action"].lower()


def test_c08_analyzer_cross_check_is_recorded_as_diagnostic_not_gold():
    fixture_path = ROOT / "tests" / "fixtures" / "kozak-kim-c08-source-contexts.json"
    fixture = json.loads(fixture_path.read_text(encoding="utf-8"))
    cross_check = fixture["morphology_analyzer_cross_check"]
    assert cross_check["run_id"] == "41353171166"
    assert cross_check["status"] == "DIAGNOSTIC_ONLY_NOT_GOLD"
    cases = cross_check["target_cases"]
    assert cases["multilexnorm2026_1953"]["status"] == "PARTIAL_AGREEMENT_ON_TARGET_BOUNDARY"
    assert cases["multilexnorm2026_1979"]["status"] == "ANALYZER_DISAGREEMENT_ON_SI_BOUNDARY"
    assert cases["dc_inside_2024"]["status"] == "ANALYZER_DISAGREEMENT_ON_LEXICAL_VS_SUFFIX_SEGMENTATION"
    assert any("majority vote" in item for item in cross_check["limitations"])
