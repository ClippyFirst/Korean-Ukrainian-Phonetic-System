"""Integrity checks for the research source registry."""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_REGISTER = ROOT / "research" / "SOURCE-REGISTER.csv"
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
