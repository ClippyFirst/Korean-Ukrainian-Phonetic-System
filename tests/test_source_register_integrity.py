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
    assert len(unreviewed) >= 50, "expected an explicit inventory of previously unregistered lexical citations"
    for row in unreviewed:
        assert row["integration_status"] == "lexical_csv_citation_only"
        assert "not independently rechecked" in row["limitations_or_next_action"]
        assert "not verified" in row["license_status"].lower() or "not assessed" in row["license_status"].lower()
