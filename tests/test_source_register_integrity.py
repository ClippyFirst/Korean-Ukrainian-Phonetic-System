"""Integrity checks for the research source registry."""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE_REGISTER = ROOT / "research" / "SOURCE-REGISTER.csv"
IPA_QUEUE = ROOT / "research" / "ipa-adjudication-queue.json"
SURFACE_FIXTURE = ROOT / "tests" / "fixtures" / "g2pk-surface-regression.json"
LEXICAL_DATA = ROOT / "data" / "korean" / "lexical_pronunciations.csv"
C08_CLUSTER_REGISTER = ROOT / "research" / "KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv"
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


DATA_SOURCE_CATALOG = ROOT / "data" / "korean" / "sources.csv"
DATA_SOURCE_COLUMNS = [
    "source_id", "source_type", "title", "author_or_organization",
    "year", "locator", "url", "evidence_level",
]


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


def test_data_source_catalog_has_exact_columns_and_unique_source_ids():
    with DATA_SOURCE_CATALOG.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        assert reader.fieldnames == DATA_SOURCE_COLUMNS
        rows = list(reader)

    assert rows, "data source catalog must not be empty"
    malformed_rows = [
        row.get("source_id", "<unknown>")
        for row in rows
        if None in row or any(value is None for value in row.values())
    ]
    assert not malformed_rows, (
        "data/korean/sources.csv rows must contain exactly the declared columns: "
        + ", ".join(malformed_rows)
    )
    source_ids = [row["source_id"].strip() for row in rows]
    assert all(source_ids), "every data source needs a nonblank source_id"
    assert len(source_ids) == len(set(source_ids)), "data source IDs must be unique"


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




def test_nikl_moscow_material_supports_only_the_exact_water_price_exception():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-NIKL-EDU-MOSKVA"]
    assert "물가[물까]" in source["coverage"]
    assert "irregular" in source["coverage"].lower()
    assert "item-level KOGL" in source["license_status"]
    assert "not a general" in source["limitations_or_next_action"].lower()

def test_nikl_dictionary_discrepancy_sources_keep_exact_evidence_scope():
    rows = {row["source_id"]: row for row in load_source_register()}
    expected = {
        "SRC-NIKL-EDU-MOSKVA": "물가[물까]",
        "SRC-NIKL-KRDICT-82835": "팔자[팔짜]",
        "SRC-NIKL-KRDICT-75022": "정신병자[정신뼝자]",
        "SRC-NIKL-KRDICT-HYEMO": "혐오증(嫌惡症)[혀모쯩]",
    }
    for source_id, example in expected.items():
        source = rows[source_id]
        assert example in source["coverage"]
        assert "item-level KOGL" in source["license_status"]
        assert "not checked" in source["license_status"].lower() or "not verified" in source["license_status"].lower()


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
    lexical_paths = [LEXICAL_DATA, *sorted(LEXICAL_DATA.parent.glob("lexical_additions_*.csv"))]
    lexical_rows = []
    for path in lexical_paths:
        with path.open("r", encoding="utf-8-sig", newline="") as stream:
            lexical_rows.extend(csv.DictReader(stream))
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




def test_kozak_kkeulda_dictionary_evidence_is_exact_and_not_ipa_gold():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-NIKL-KRDICT-62281"]
    assert "ParaWordNo=62281" in source["url"]
    assert "끌다[끌ː다]" in source["coverage"]
    assert "Hangul notation is not IPA" in source["contribution_expected"]
    assert "item-level KOGL" in source["license_status"]
    assert "unverified" in source["license_status"].lower() or "not checked" in source["license_status"].lower()

def test_nikl_rule24_scope_supports_exact_gulmda_license_and_preserves_gulm_gida_exception():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-NIKL-TRAINING-2009"]
    assert "ㅁ(ㄻ)" in source["coverage"]
    assert "굶기다" in source["coverage"]
    assert "굶-" in source["contribution_expected"]
    assert "-다" in source["contribution_expected"]
    assert "not a directly quoted example" in source["limitations_or_next_action"]
    dictionary = rows["SRC-NIKL-KRDICT-62281"]
    assert "kozak-research-only lexical entry updated" in dictionary["integration_status"]


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
    registered = {row["source_id"] for row in load_source_register()}
    for case in cases:
        evidence_ids = set(case.get("morphology_evidence", [])) | set(case.get("rule_evidence", []))
        evidence_ids |= set(case.get("pronunciation_evidence", {}).get("source_ids", []))
        assert evidence_ids <= registered, case["source_row_id"]
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
    assert "broken off" in rule27["coverage"]
    assert "not exact-token IPA" in rule27["contribution_expected"]

    su = rows["SRC-NIKL-QNA-331601"]
    assert "qna_seq=331601" in su["url"]
    assert "알 수 없는[알쑤엄는]" in su["coverage"]
    assert "Does not attest the exact corpus token" in su["limitations_or_next_action"]

    pdf = rows["SRC-NIKL-EDU-2021-DEPENDENT-SI"]
    assert "not used as production evidence" in pdf["limitations_or_next_action"].lower()


def test_c08_cluster_cites_only_active_registered_nikl_qna_sources():
    with C08_CLUSTER_REGISTER.open("r", encoding="utf-8-sig", newline="") as stream:
        cluster_rows = list(csv.DictReader(stream))
    c08 = next(row for row in cluster_rows if row["cluster_id"] == "C08")
    c08_text = " ".join(c08.values())
    cited_ids = set(re.findall(r"SRC-NIKL-QNA-\d+", c08_text))
    registered_ids = {row["source_id"] for row in load_source_register()}

    assert cited_ids, "C08 must use explicit, traceable NIKL source-register IDs"
    assert cited_ids <= registered_ids, "C08 cites a source absent from the active register"
    assert {
        "SRC-NIKL-QNA-317798",
        "SRC-NIKL-QNA-310899",
        "SRC-NIKL-QNA-331601",
    } <= cited_ids
    assert not re.search(r"\b(?:335204|336313)\b", c08_text), (
        "unretrieved provisional Q&A references must not remain in the active C08 evidence row"
    )


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




def test_c05_front_rounded_vowel_diphthongization_has_independent_corroboration_without_globalizing_it():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-SNU-LEE-2017-KOREAN-VOWEL-CONTRAST"]
    assert "diphthongization" in source["coverage"]
    assert "/y, ø/" in source["coverage"]
    assert "does not establish a universal" in source["limitations_or_next_action"]
    assert "CC BY-NC 4.0" in source["license_status"]


def test_c09_length_discrepancies_have_exact_dictionary_surface_evidence():
    rows = {row["source_id"]: row for row in load_source_register()}
    expected = {
        "SRC-KRDICT-ENG-58161": ("사람[사ː람]", "ParaWordNo=58161"),
        "SRC-KRDICT-ENG-29712": ("모르다[모ː르다]", "ParaWordNo=29712"),
        "SRC-KRDICT-ENG-89445": ("알다[알ː다]", "ParaWordNo=89445"),
        "SRC-KRDICT-AR-GWESUNG": ("괴성[괴ː성 듣기/궤ː성 듣기]", "krdict.korean.go.kr"),
    }
    for source_id, (attestation, locator) in expected.items():
        source = rows[source_id]
        assert attestation in source["coverage"]
        assert locator in source["url"]
        assert any(term in source["limitations_or_next_action"] for term in ("Hangul", "Korean bracket notation"))
        assert "IPA" in source["limitations_or_next_action"]
        assert "item-level" in source["license_status"].lower()
    rule14 = rows["SRC-NIKL-PRON"]
    assert "§14" in rule14["coverage"]
    assert "없어[업ː써]" in rule14["coverage"]
    no_length = rows["SRC-KRDICT-ENG-89445"]
    assert "알다[알ː다]" in no_length["coverage"]




def test_c09_dictionary_length_is_not_a_guarantee_of_contemporary_surface_duration():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-KCI-KIM-PARK-2019-VOWEL-LENGTH"]
    assert "only a limited number of subjects" in source["coverage"]
    assert "1%" in source["coverage"]
    assert "not a guarantee" in source["contribution_expected"]
    assert "does not overturn official dictionary entries" in source["limitations_or_next_action"]


def test_c01_c07_allophone_profile_research_is_registered_with_bounded_scope():
    rows = {row["source_id"]: row for row in load_source_register()}
    expected = {
        "SRC-PLSA-KOREAN-LIQUID-2021": ("retroflex", "pauses"),
        "SRC-CAMBRIDGE-KOREAN-IPA": ("[ç]", "[x]", "[p̚]", "[ɕ]", "diphthong beginning [j]"),
        "SRC-KCI-KANG-LEE-2019-H": ("Seoul", "Gwangju"),
        "SRC-KCI-CHOI-OH-2014-N-PALATALIZATION": ("늬", "[ɲi]"),
        "SRC-KCI-YUN-2005-KOREAN-GLIDES": ("[ɥ]", "front vowel"),
    }
    for source_id, terms in expected.items():
        source = rows[source_id]
        assert all(term in source["coverage"] for term in terms), source_id
        assert "not" in source["limitations_or_next_action"].lower(), source_id
        if source_id == "SRC-PLSA-KOREAN-LIQUID-2021":
            assert "CC-BY-4.0 verified" in source["license_status"]
        else:
            assert "item-level" in source["license_status"].lower(), source_id


def test_c10_seoul_korean_prosody_sources_do_not_license_word_level_stress():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-SAGE-BAEK-2022-KOREAN-PROSODY"]
    assert "not having lexical prominence/stress" in source["coverage"]
    assert "Accentual Phrase" in source["coverage"]
    assert "not every Korean dialect" in source["limitations_or_next_action"]



def test_c01_c07_and_c10_cluster_decisions_follow_the_reviewed_profile_evidence():
    with C08_CLUSTER_REGISTER.with_name("KOZAK-KIM-MASS-MISMATCH-CLUSTERS-2026-11-01.csv").open(
        "r", encoding="utf-8-sig", newline=""
    ) as stream:
        clusters = {row["cluster_id"]: row for row in csv.DictReader(stream)}
    expected_sources = {
        "C01": "SRC-PLSA-KOREAN-LIQUID-2021",
        "C02": "SRC-CAMBRIDGE-KOREAN-IPA",
        "C03": "SRC-KCI-CHOI-OH-2014-N-PALATALIZATION",
        "C05": "SRC-KCI-YUN-2005-KOREAN-GLIDES",
        "C06": "SRC-CAMBRIDGE-KOREAN-IPA",
        "C07": "SRC-PLSA-KOREAN-LIQUID-2021",
        "C10": "SRC-SAGE-BAEK-2022-KOREAN-PROSODY",
        "C09": "SRC-KCI-KIM-PARK-2019-VOWEL-LENGTH",
    }
    for cluster_id, source_id in expected_sources.items():
        row = clusters[cluster_id]
        assert source_id in row["production_decision"] + row["next_action"]
        assert row["status"] not in {"DONE_VERIFIED", "PASS"}
    assert "SRC-SNU-LEE-2017-KOREAN-VOWEL-CONTRAST" in clusters["C05"]["production_decision"] + clusters["C05"]["next_action"]
    assert "IPA_CONVENTION_REVIEW_REQUIRED" == clusters["C04"]["status"]
    assert "do not mark English-style primary lexical stress" in clusters["C10"]["production_decision"]
    assert clusters["C09"]["status"] == "SOURCE_LENGTH_IMPLEMENTED_7_FORMS_IPA_REVIEW_PENDING"
    assert "all seven named forms" in clusters["C09"]["production_decision"].lower()


def test_c12_velar_coarticulation_source_is_cautionary_not_a_rewrite_license():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-KCI-ITO-2007-MORPHEME-STRUCTURE"]
    acoustic = rows["SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS"]
    assert acoustic["license_status"].startswith("CC-BY-4.0 verified")
    assert "burst duration" in acoustic["coverage"].lower()
    assert "does not report [kx]/[kç]" in acoustic["limitations_or_next_action"].lower()
    assert "no /ɯ/ or /j/" in acoustic["limitations_or_next_action"].lower()
    assert "study 1 uses /a/" in acoustic["limitations_or_next_action"].lower()
    assert "study 2 uses /i,u,a,ʌ/" in acoustic["limitations_or_next_action"].lower()
    assert source["url"] == "https://doi.org/10.17959/sppm.2007.13.3.373"
    assert "abstract" in source["review_status"].lower()
    assert "underrepresented" in source["coverage"].lower()
    assert "velar/uvular fricative" in source["coverage"].lower()
    assert "does not establish" in source["limitations_or_next_action"].lower()
    assert "exact-token" in source["limitations_or_next_action"].lower()

    triage = (ROOT / "research" / "KOZAK-KIM-MISMATCH-FRAGMENT-TRIAGE-2026-11-02.md").read_text(encoding="utf-8")
    c12 = next(line for line in triage.splitlines() if "`kx/kç → kʰ`" in line and "45 operations / 37 occurrences" in line and "No phonological rewrite" in line)
    assert "SRC-KCI-ITO-2007-MORPHEME-STRUCTURE" in c12
    assert "No phonological rewrite" in c12
    assert "PARTIAL" in c12
    assert "SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS" in c12

    with C08_CLUSTER_REGISTER.open("r", encoding="utf-8-sig", newline="") as stream:
        clusters = {row["cluster_id"]: row for row in csv.DictReader(stream)}
    c12_cluster = clusters["C12"]
    assert c12_cluster["unique_occurrences"] == "37"
    assert c12_cluster["edit_operations"] == "45"
    assert c12_cluster["status"] == "PARTIAL_GENERAL_ACOUSTIC_EVIDENCE_EXACT_C12_REVIEW_BLOCKED"
    assert "SRC-KCI-ITO-2007-MORPHEME-STRUCTURE" in c12_cluster["production_decision"] + c12_cluster["next_action"]
    assert "SRC-JIPA-SCHWEIZER-AHN-KWON-2026-SEOUL-STOPS" in c12_cluster["production_decision"] + c12_cluster["next_action"]

    fragment_path = ROOT / "research" / "kozak-kim-mismatch-fragments-2026-11-02.csv"
    with fragment_path.open("r", encoding="utf-8-sig", newline="") as stream:
        fragment_reader = csv.DictReader(stream)
        fragment_fields = fragment_reader.fieldnames or []
        fragments = list(fragment_reader)
    c12_rows = [
        row for row in fragments
        if "kʰ" in row["strict_kozak_ipa"]
        and any(pattern in row["strict_reference_ipa"] for pattern in ("kxɯ", "kçi", "kçj"))
    ]
    assert len(c12_rows) == 37
    assert len({row["token"] for row in c12_rows}) == 29
    assert not any("audio" in field.lower() or "speaker" in field.lower() for field in fragment_fields)

    pattern_counts = {"kxɯ_only": 0, "kçi_only": 0, "kçj_only": 0, "kxɯ_and_kçi": 0}
    source_counts = {"multilexnorm2026": 0, "dc_inside": 0}
    for row in c12_rows:
        ipa = row["strict_reference_ipa"]
        has_kxɯ = "kxɯ" in ipa
        has_kçi = "kçi" in ipa
        has_kçj = "kçj" in ipa
        if has_kxɯ and has_kçi:
            pattern_counts["kxɯ_and_kçi"] += 1
        elif has_kxɯ:
            pattern_counts["kxɯ_only"] += 1
        elif has_kçi:
            pattern_counts["kçi_only"] += 1
        elif has_kçj:
            pattern_counts["kçj_only"] += 1
        else:
            raise AssertionError(f"unclassified C12 occurrence: {row['occurrence_id']}")
        source_id = row["source_row_id"]
        if source_id.startswith("multilexnorm2026_"):
            source_counts["multilexnorm2026"] += 1
        elif source_id.startswith("dc_inside_"):
            source_counts["dc_inside"] += 1
        else:
            raise AssertionError(f"unexpected C12 source namespace: {source_id}")
    assert pattern_counts == {"kxɯ_only": 16, "kçi_only": 12, "kçj_only": 8, "kxɯ_and_kçi": 1}
    assert source_counts == {"multilexnorm2026": 12, "dc_inside": 25}
    assert clusters["C04"]["unique_occurrences"] == "0"
    assert clusters["C04"]["edit_operations"] == "0"

def test_sigmorphon_native_only_exact_cases_have_bounded_nikl_sources():
    rows = {row["source_id"]: row for row in load_source_register()}
    value_source = rows["SRC-NIKL-MCFAQ-5949"]
    assert "값어치[가버치]" in value_source["coverage"]
    assert "§15" in value_source["coverage"]
    assert "not IPA" in value_source["limitations_or_next_action"]

    taste_source = rows["SRC-NIKL-QNA-319525"]
    assert "맛없다[마덥따]" in taste_source["coverage"]
    assert "§15" in taste_source["coverage"]
    assert "not IPA" in taste_source["limitations_or_next_action"]


def test_c08_fixture_maps_all_eight_occurrences_without_promoting_hypotheses_to_gold():
    fixture = json.loads((ROOT / "tests" / "fixtures" / "kozak-kim-c08-source-contexts.json").read_text(encoding="utf-8"))
    mapping = fixture["cluster_occurrence_mapping"]
    cases = fixture["cases"]
    case_ids = {case["source_row_id"] for case in cases}

    assert len(cases) == 8
    assert set(mapping["occurrence_ids"]) == case_ids
    assert len(mapping["independently_recovered_ids"]) == 3
    assert len(mapping["reconstructed_ids"]) == 5
    assert set(mapping["independently_recovered_ids"]).isdisjoint(mapping["reconstructed_ids"])
    assert set(mapping["independently_recovered_ids"]) | set(mapping["reconstructed_ids"]) == case_ids
    assert mapping["status"] == "ALL_EIGHT_SOURCE_ROWS_MAPPED_WITH_FIVE_HIGH_CONFIDENCE_RECONSTRUCTIONS"

    unresolved = [case for case in cases if case["status"] == "UNRESOLVED_EXACT_LEXICAL_PRONUNCIATION"]
    assert len(unresolved) == 1
    assert unresolved[0]["source_row_id"] == "dc_inside_2024"
    assert unresolved[0]["input"] == "유사성"
    assert all(case.get("morphology_evidence") for case in cases if case["source_row_id"] != "dc_inside_2024")
    assert any("not independently adjudicated normative IPA gold" in item for item in mapping["limitations"])
    assert any("No production phonology rule" in item for item in mapping["limitations"])

def test_nikl_dictionary_noeun_length_attestation_is_not_lost_to_corpus_reference():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-NIKL-KRDICT-89917"]
    assert "없는[엄ː는]" in source["coverage"]
    assert "Hangul" in source["limitations_or_next_action"]
    assert "not checked" in source["license_status"].lower()

    from korean_ukrainian.pipeline import phoneticize_korean

    result = phoneticize_korean("없는")
    assert result["surface_hangul"] == "엄는"
    # The official dictionary gives Hangul pronunciation, not IPA. This is
    # the project's broad-IPA rendering of that attested vowel length.
    assert result["ipa"]["ipa"] == "ʌːm.nɯn"


def test_wiktionary_central_similarity_is_secondary_and_cannot_license_production_ipa():
    rows = {row["source_id"]: row for row in load_source_register()}
    source = rows["SRC-WIKTIONARY-JUNGSIMDALMEUM"]
    assert source["source_type"] == "secondary_lexical"
    assert source["url"] == "https://en.wiktionary.org/wiki/중심닮음"
    assert source["license_status"].startswith("CC BY-SA 4.0")
    assert "중심 + 닮- + -음" in source["coverage"]
    assert "North Korean" in source["coverage"]
    assert "SK Standard/Seoul" in source["coverage"]
    assert source["integration_status"] == "research_only_not_integrated"
    assert "not independent confirmation" in source["limitations_or_next_action"]
    assert "Do not copy" in source["limitations_or_next_action"]


def test_s018_korean_ipa_source_matches_cambridge_primary_bibliographic_metadata():
    with DATA_SOURCE_CATALOG.open("r", encoding="utf-8-sig", newline="") as stream:
        catalog = {row["source_id"]: row for row in csv.DictReader(stream)}
    s018 = catalog["S018"]
    assert s018["author_or_organization"] == "Hyun Bok Lee"
    assert s018["year"] == "1993"
    assert s018["locator"] == "Journal of the International Phonetic Association 23(1) pp. 28–31"
    assert s018["url"] == "https://doi.org/10.1017/S0025100300004758"

    register = {row["source_id"]: row for row in load_source_register()}
    cambridge = register["SRC-CAMBRIDGE-KOREAN-IPA"]
    assert "Hyun Bok Lee" in cambridge["title_or_project"]
    assert "June 1993" in cambridge["version_or_date"]
    assert "Sohn (2008)" not in cambridge["title_or_project"]


def test_s018_page_31_does_not_license_modern_lenis_sibilant_rule():
    source = {row["source_id"]: row for row in load_source_register()}["SRC-CAMBRIDGE-KOREAN-IPA"]
    assert "page 31" in source["review_status"]
    assert "diphthong beginning [j]" in source["coverage"]
    assert "classifies /s/ among fortis sounds" in source["coverage"]
    assert "does not license a lenis /s/ rule" in source["limitations_or_next_action"]
