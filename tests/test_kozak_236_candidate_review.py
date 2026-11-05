import csv
import importlib.util
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("candidate_review", ROOT / "scripts/build_kozak_236_candidate_review.py")
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)
OUTPUT = ROOT / "research/kozak-kim-236-candidate-review-2026-11-05.csv"

def test_reconstructed_236_review_ledger_has_exact_membership_and_statuses():
    rows = MODULE.build_rows(ROOT)
    assert len(rows) == 236
    assert len({row["occurrence_id"] for row in rows}) == 236
    assert Counter(row["candidate_disposition"] for row in rows) == {
        "NOT_INDIVIDUALLY_ADJUDICATED": 213,
        "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW": 22,
        "RETAIN_PENDING_INDEPENDENT_IPA_REVIEW": 1,
    }
    assert all(row["historical_membership_confidence"] ==
        "RECONSTRUCTED_CANDIDATE_NOT_ORIGINAL_MEMBERSHIP_PROOF" for row in rows)
    assert all(row["source_context_text"] and row["source_context_canonical"] and
        row["source_context_phonemes"] for row in rows)
    assert all("historical_export_cluster_labels_descriptive_only" in row for row in rows)
    assert all(row["candidate_selection_method"] ==
        "PRE_C11_C12_BROAD_ONLY_AGGREGATE_C01_C10_REPLAY" for row in rows)

def test_checked_in_ledger_matches_reproducible_generator():
    expected = MODULE.build_rows(ROOT)
    with OUTPUT.open(encoding="utf-8", newline="") as handle:
        actual = list(csv.DictReader(handle))
    assert actual == expected

def test_236_broad_edit_signature_inventory_and_historical_tags_are_stable():
    rows = MODULE.build_rows(ROOT)
    operations = Counter()
    for row in rows:
        for item in json.loads(row["broad_mismatch_fragments"]):
            signature = f'{item["op"]}|{item.get("reference_fragment") or "∅"}→{item.get("kozak_fragment") or "∅"}'
            operations[signature] += 1
    assert sum(operations.values()) == 254
    assert len(operations) == 24
    assert operations["S|ɕ→s"] == 184
    assert operations["S|ɕ͈→s͈"] == 24

    historical = [row["historical_export_cluster_labels_descriptive_only"].split(";") for row in rows]
    assert sum(any(label.startswith("C11") for label in labels) for labels in historical) == 207
    assert sum(any(label.startswith("C04") for label in labels) for labels in historical) == 206


# Hangul-to-IPA environment crosswalk for the S018 lenis sibilant scope.
_HANGUL_ONSETS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]
_HANGUL_NUCLEI = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"]
_HANGUL_CODAS = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]
_S018_NUCLEI = {"ㅣ", "ㅑ", "ㅒ", "ㅕ", "ㅖ", "ㅛ", "ㅠ"}

def _s018_hangul_sibilant_contexts(token: str) -> list[tuple[str, str]]:
    syllables = []
    for char in token:
        codepoint = ord(char)
        if not 0xAC00 <= codepoint <= 0xD7A3:
            syllables.append(None)
            continue
        offset = codepoint - 0xAC00
        onset_index = offset // (21 * 28)
        nucleus_index = (offset % (21 * 28)) // 28
        coda_index = offset % 28
        syllables.append((char, _HANGUL_ONSETS[onset_index], _HANGUL_NUCLEI[nucleus_index], _HANGUL_CODAS[coda_index]))
    contexts = []
    for index, syllable in enumerate(syllables):
        if syllable is None:
            continue
        char, onset, nucleus, coda = syllable
        if onset == "ㅅ" and nucleus in _S018_NUCLEI:
            contexts.append(("onset", char))
        if coda == "ㅅ" and index + 1 < len(syllables):
            following = syllables[index + 1]
            if following is not None and following[1] == "ㅇ" and following[2] in _S018_NUCLEI:
                contexts.append(("liaison", char + following[0]))
    return contexts

def test_236_lenis_sibilant_operations_map_to_lee_1993_page_31_environment():
    rows = MODULE.build_rows(ROOT)
    lenis_rows = []
    for row in rows:
        fragments = json.loads(row["broad_mismatch_fragments"])
        lenis_count = sum(item["reference_fragment"] == "ɕ" and item["kozak_fragment"] == "s" for item in fragments)
        fortis_count = sum(item["reference_fragment"] == "ɕ͈" and item["kozak_fragment"] == "s͈" for item in fragments)
        if lenis_count:
            contexts = _s018_hangul_sibilant_contexts(row["token"])
            # A mixed lenis/fortis token has one additional fortis environment;
            # S018 p.31 does not license fortis /s͈/.
            assert len(contexts) == lenis_count + fortis_count, (row["occurrence_id"], row["token"], contexts, lenis_count, fortis_count)
            lenis_rows.append((row, lenis_count, fortis_count, contexts))
    assert len(lenis_rows) == 183
    assert sum(item[1] for item in lenis_rows) == 184
    assert sum(item[2] for item in lenis_rows) == 1
    assert sum(len(item[3]) for item in lenis_rows) == 185
    assert {row["occurrence_id"] for row, _, fortis, _ in lenis_rows if fortis} == {"551"}
    assert {row["occurrence_id"] for row, count, _, _ in lenis_rows if count == 2} == {"103"}
    assert len({row["token"] for row, _, _, _ in lenis_rows}) == 110
    assert len({row["source_row_id"] for row, _, _, _ in lenis_rows}) == 91


def test_fortis_sibilant_cases_are_not_promoted_by_s018_lenis_scope():
    rows = MODULE.build_rows(ROOT)
    fortis_context_ids = set()
    for row in rows:
        fragments = json.loads(row["broad_mismatch_fragments"])
        fortis_count = sum(item["reference_fragment"] == "ɕ͈" and item["kozak_fragment"] == "s͈" for item in fragments)
        if fortis_count and _s018_hangul_sibilant_contexts(row["token"]):
            fortis_context_ids.add(row["occurrence_id"])
    assert fortis_context_ids == {"481", "551"}


def _has_orthographic_fortis_onset(token: str) -> bool:
    for char in token:
        codepoint = ord(char)
        if 0xAC00 <= codepoint <= 0xD7A3:
            onset_index = (codepoint - 0xAC00) // (21 * 28)
            if _HANGUL_ONSETS[onset_index] == "ㅆ":
                return True
    return False

def _has_lateral_triggered_sibilant_fortition(token: str) -> bool:
    syllables = []
    for char in token:
        codepoint = ord(char)
        if not 0xAC00 <= codepoint <= 0xD7A3:
            syllables.append(None)
            continue
        offset = codepoint - 0xAC00
        onset_index = offset // (21 * 28)
        coda_index = offset % 28
        syllables.append((_HANGUL_ONSETS[onset_index], _HANGUL_CODAS[coda_index]))
    return any(
        current is not None and previous is not None
        and current[0] == "ㅅ" and previous[1] == "ㄹ"
        for previous, current in zip(syllables, syllables[1:])
    )

def test_24_fortis_sibilant_operations_are_separate_orthographic_or_coda_triggered_cases():
    rows = MODULE.build_rows(ROOT)
    fortis_rows = []
    orthographic_fortis_ops = 0
    coda_triggered_ops = 0
    coda_triggered_ids = set()
    for row in rows:
        fragments = json.loads(row["broad_mismatch_fragments"])
        count = sum(item["reference_fragment"] == "ɕ͈" and item["kozak_fragment"] == "s͈" for item in fragments)
        if not count:
            continue
        fortis_rows.append(row)
        if _has_orthographic_fortis_onset(row["token"]):
            orthographic_fortis_ops += count
        elif _has_lateral_triggered_sibilant_fortition(row["token"]):
            coda_triggered_ops += count
            coda_triggered_ids.add(row["occurrence_id"])
        else:
            raise AssertionError((row["occurrence_id"], row["token"], "unclassified fortis source form"))
    assert len(fortis_rows) == 24
    assert sum(sum(item["reference_fragment"] == "ɕ͈" and item["kozak_fragment"] == "s͈" for item in json.loads(row["broad_mismatch_fragments"])) for row in fortis_rows) == 24
    assert orthographic_fortis_ops == 22
    assert coda_triggered_ops == 2
    assert coda_triggered_ids == {"481", "551"}
    assert len({row["token"] for row in fortis_rows}) == 17
    assert len({row["source_row_id"] for row in fortis_rows}) == 19
