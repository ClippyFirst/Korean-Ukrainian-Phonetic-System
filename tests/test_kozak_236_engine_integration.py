import csv
import json
import shutil
import subprocess
from pathlib import Path

import pytest
from korean_ukrainian import phoneticize_korean

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "research"

def read_rows(path):
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))

def test_236_rule_confirmed_occurrences_have_explicit_runtime_dispositions():
    candidates = read_rows(RESEARCH / "kozak-kim-236-candidate-review-2026-11-05.csv")
    integrated = read_rows(RESEARCH / "kozak-kim-236-engine-integration-2026-11-06.csv")
    confirmed = {
        row["occurrence_id"]
        for row in candidates
        if row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    }
    mapped = {row["occurrence_id"] for row in integrated}
    assert len(confirmed) == 15
    assert mapped == confirmed
    assert len(integrated) == 15
    assert sum(row["engine_integration_status"] == "IMPLEMENTED_2026-11-06" for row in integrated) == 10
    assert sum(row["engine_integration_status"] == "ALREADY_IMPLEMENTED_ON_BASELINE" for row in integrated) == 5
    assert sum(row["engine_integration_status"].startswith("BLOCKED") for row in integrated) == 0

def test_repeated_yeonjeonyeonpa_occurrences_share_one_exact_runtime_license():
    rows = read_rows(RESEARCH / "kozak-kim-236-engine-integration-2026-11-06.csv")
    repeated = [row for row in rows if row["token"] == "연전연패"]
    assert {row["occurrence_id"] for row in repeated} == {"1816", "1843", "1870"}
    assert {row["runtime_rule"] for row in repeated} == {"R009"}
    assert len({row["scope"] for row in repeated}) == 1

def test_2490_uses_exact_pronunciation_alias_without_rewriting_source_orthography():
    rows = read_rows(RESEARCH / "kozak-kim-236-engine-integration-2026-11-06.csv")
    row = next(item for item in rows if item["occurrence_id"] == "2490")
    assert row["engine_integration_status"] == "IMPLEMENTED_2026-11-06"
    assert row["runtime_rule"] == "R008"
    assert "input spelling preserved" in row["scope"]
    result = phoneticize_korean("머리속에")
    assert result["surface_hangul"] == "머리쏘게"
    assert "s͈" in result["ipa"]["ipa"]

 
def test_236_lenis_sibilant_variants_match_across_native_and_browser_after_resyllabification():
    node = shutil.which("node")
    if not node:
        pytest.skip("Node.js is required for the cross-runtime parity check")

    positive = ["멋있어", "멋있노", "무슨뜻임", "것이냐", "저딴짓이면서", "법알못이구만"]
    negative = ["쇼", "슈", "셔", "섀", "씨"]
    words = positive + negative
    native = {word: phoneticize_korean(word)["ipa"] for word in words}

    node_source = (
        "import { createBrowserKozakKimEngine } from './scripts/benchmark_kozak_kim_browser.mjs';\n"
        f"const words = {json.dumps(words, ensure_ascii=False)};\n"
        "const engine = createBrowserKozakKimEngine();\n"
        "const rows = words.map(word => {\n"
        "  const result = engine.convert(word, { ipaProfile: 'clippyfirst-korean-broad-v1' });\n"
        "  return { word, ipa: result.ipa, variants: result.variants || [] };\n"
        "});\n"
        "process.stdout.write(JSON.stringify(rows));\n"
    )
    completed = subprocess.run(
        [node, "--input-type=module", "-e", node_source],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    browser = {row["word"]: row for row in json.loads(completed.stdout)}

    for word in positive:
        assert "ɕ" not in native[word]["ipa"], word + ": canonical broad IPA remains /s/"
        assert any("ɕi" in item["ipa"] for item in native[word]["variants"]), word + ": Native surface variant"
        assert "ɕ" not in browser[word]["ipa"], word + ": Browser canonical broad IPA remains /s/"
        assert any("ɕi" in item["ipa"] for item in browser[word]["variants"]), word + ": Browser surface variant"

    for word in negative:
        assert not any("ɕ" in item["ipa"] for item in native[word]["variants"]), word + ": Native out-of-scope negative control"
        assert not any("ɕ" in item["ipa"] for item in browser[word]["variants"]), word + ": Browser out-of-scope negative control"


def test_browser_python_surface_and_ipa_parity_for_236_exact_forms():
    node = shutil.which("node")
    if not node:
        pytest.skip("Node.js is required for the cross-runtime parity check")

    words = [
        "그놈의",
        "정권",
        "유사성",
        "자신의",
        "연전연패",
        "혐오증",
        "출시미정에",
        "머리속에",
    ]
    node_source = (
        "import { createBrowserKozakKimEngine } from './scripts/benchmark_kozak_kim_browser.mjs';\n"
        f"const words = {json.dumps(words, ensure_ascii=False)};\n"
        "const engine = createBrowserKozakKimEngine();\n"
        "const rows = words.map(word => {\n"
        "  const result = engine.convert(word, { morphologyMode: 'strict', ipaProfile: 'clippyfirst-korean-broad-v1' });\n"
        "  return { word, surface: result.surfaceHangul || word, ipa: result.ipa };\n"
        "});\n"
        "process.stdout.write(JSON.stringify(rows));\n"
    )
    completed = subprocess.run(
        [node, "--input-type=module", "-e", node_source],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    browser = {row["word"]: row for row in json.loads(completed.stdout)}

    for word in words:
        python = phoneticize_korean(word)
        assert browser[word]["surface"] == (python["surface_hangul"] or word), word
        assert browser[word]["ipa"] == python["ipa"]["ipa"], word
