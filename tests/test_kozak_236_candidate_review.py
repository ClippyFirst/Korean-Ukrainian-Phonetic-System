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
        "NOT_INDIVIDUALLY_ADJUDICATED": 57,
        "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW": 20,
        "RULE_CONFIRMED_STANDARD_VARIANT": 9,
        "PROFILE_CONVENTION_MISMATCH_CONFIRMED": 150,
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


# Hangul-to-IPA environment crosswalk for Kang (2010)'s lenis /s/ acoustic contexts.
_HANGUL_ONSETS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]
_HANGUL_NUCLEI = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"]
_HANGUL_CODAS = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]
_KANG_2010_NUCLEI = {"ㅣ", "ㅑ", "ㅖ"}

def _kang2010_hangul_sibilant_contexts(token: str) -> list[tuple[str, str]]:
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
        if onset == "ㅅ" and nucleus in _KANG_2010_NUCLEI:
            contexts.append(("onset", char))
        if coda == "ㅅ" and index + 1 < len(syllables):
            following = syllables[index + 1]
            if following is not None and following[1] == "ㅇ" and following[2] in _KANG_2010_NUCLEI:
                contexts.append(("liaison", char + following[0]))
    return contexts


def _kang2010_round_sibilant_contexts(token: str) -> list[str]:
    contexts = []
    for char in token:
        codepoint = ord(char)
        if not 0xAC00 <= codepoint <= 0xD7A3:
            continue
        offset = codepoint - 0xAC00
        onset = _HANGUL_ONSETS[offset // (21 * 28)]
        nucleus = _HANGUL_NUCLEI[(offset % (21 * 28)) // 28]
        if onset == "ㅅ" and nucleus in {"ㅛ", "ㅠ"}:
            contexts.append(char)
    return contexts

def test_236_lenis_sibilant_operations_are_separated_by_kang_2010_environment_scope():
    rows = MODULE.build_rows(ROOT)
    supported_rows = []
    unsupported_rows = []
    for row in rows:
        fragments = json.loads(row["broad_mismatch_fragments"])
        lenis_count = sum(item["reference_fragment"] == "ɕ" and item["kozak_fragment"] == "s" for item in fragments)
        fortis_count = sum(item["reference_fragment"] == "ɕ͈" and item["kozak_fragment"] == "s͈" for item in fragments)
        if lenis_count:
            contexts = _kang2010_hangul_sibilant_contexts(row["token"])
            if contexts:
                # The one mixed row has one lenis and one fortis environment.
                assert len(contexts) == lenis_count + fortis_count, (row["occurrence_id"], row["token"], contexts, lenis_count, fortis_count)
                supported_rows.append((row, lenis_count, fortis_count, contexts))
            else:
                unsupported_rows.append((row, lenis_count, fortis_count))

    # 184 lenis edits exist in the reconstructed cohort, but only 157 occur
    # in the /i, ye, ya/ environments covered by Kang's abstract. One extra
    # context in row 551 is fortis and must not be counted as lenis support.
    assert len(supported_rows) == 156
    assert sum(item[1] for item in supported_rows) == 157
    assert sum(item[2] for item in supported_rows) == 1
    assert sum(len(item[3]) for item in supported_rows) == 158
    assert len(unsupported_rows) == 27
    assert sum(item[1] for item in unsupported_rows) == 27
    assert sum(item[2] for item in unsupported_rows) == 0
    assert {row["occurrence_id"] for row, _, _ in unsupported_rows} == {
        "606", "843", "1155", "1157", "1414", "1417", "1420", "1423",
        "1426", "1429", "1432", "1435", "1438", "1441", "1444", "1447",
        "1450", "1453", "1456", "1459", "1462", "1465", "1468", "1471",
        "1474", "1477", "2489",
    }
    assert len({row["token"] for row, _, _ in unsupported_rows}) == 6
    assert len({row["source_row_id"] for row, _, _ in unsupported_rows}) == 5
    # ID 606 (쇼 /yo/) is outside S019's /i, ye, ya/ set but is a
    # separate high-front + round candidate under Kang's second 2010 abstract.
    round_candidates = [
        (row, _kang2010_round_sibilant_contexts(row["token"]))
        for row, _, _ in unsupported_rows
        if _kang2010_round_sibilant_contexts(row["token"])
    ]
    assert [(row["occurrence_id"], row["token"], contexts) for row, contexts in round_candidates] == [
        ("606", "쇼", ["쇼"])
    ]
    assert len(unsupported_rows) - len(round_candidates) == 26
    assert {row["occurrence_id"] for row, _, fortis, _ in supported_rows if fortis} == {"551"}
    assert {row["occurrence_id"] for row, count, _, _ in supported_rows if count == 2} == {"103"}
    assert len({row["token"] for row, _, _, _ in supported_rows}) == 104
    assert len({row["source_row_id"] for row, _, _, _ in supported_rows}) == 88


def test_fortis_sibilant_cases_are_not_promoted_by_lenis_coarticulation_scope():
    rows = MODULE.build_rows(ROOT)
    fortis_context_ids = set()
    for row in rows:
        fragments = json.loads(row["broad_mismatch_fragments"])
        fortis_count = sum(item["reference_fragment"] == "ɕ͈" and item["kozak_fragment"] == "s͈" for item in fragments)
        if fortis_count and _kang2010_hangul_sibilant_contexts(row["token"]):
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


def test_nikl_rule_5_adjudicates_genitive_ui_variant_without_claiming_acoustic_gold():
    rows = MODULE.build_rows(ROOT)
    row = next(item for item in rows if item["occurrence_id"] == "341")
    assert row["token"] == "그놈의"
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "Standard Pronunciation Rule 5" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-QNA-334585" in row["candidate_disposition_basis"]
    assert row["prior_individual_reason_code"] == "UNMAPPED_FRAGMENT_AND_NO_INDEPENDENT_IPA_GOLD"
    assert row["prior_independent_ipa_review_status"] == "NOT_PERFORMED"


def test_n_insertion_candidates_remain_abstained_without_word_specific_evidence():
    rows = MODULE.build_rows(ROOT)
    selected = [row for row in rows if row["occurrence_id"] in {"1816", "1843", "1870"}]
    assert len(selected) == 3
    assert {row["token"] for row in selected} == {"연전연패"}
    assert all(row["candidate_disposition"] == "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW" for row in selected)


def test_nikl_exact_lexical_fortition_adjudicates_water_price_compound_only():
    rows = MODULE.build_rows(ROOT)
    row = next(item for item in rows if item["occurrence_id"] == "2001")
    assert row["token"] == "물가로"
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "물가[물까]" in row["candidate_disposition_basis"]
    assert "결과[결과]" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-EDU-MOSKVA" in row["candidate_disposition_basis"]
    assert "not a productive ㄹ+ㄱ rule" in row["candidate_disposition_basis"]
    assert row["prior_independent_ipa_review_status"] == "NOT_PERFORMED"


def test_nikl_surface_sources_do_not_override_broad_profile_sibilant_convention():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    expected = {
        "293": ("실수", "SRC-NIKL-QNA-330843", "[실쑤]"),
        "538": ("멋있어", "SRC-NIKL-QNA-306166", "[머시써]"),
        "1206": ("싫어서", "SRC-NIKL-QNA-313981", "[시러서]"),
    }
    for occurrence_id, (token, source_id, pronunciation) in expected.items():
        row = rows[occurrence_id]
        assert row["token"] == token
        expected_disposition = "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW" if occurrence_id == "538" else "PROFILE_CONVENTION_MISMATCH_CONFIRMED"
        assert row["candidate_disposition"] == expected_disposition
        assert source_id in row["candidate_disposition_basis"]
        assert pronunciation in row["candidate_disposition_basis"]
        assert "SRC-IPA-DICT-KO" in row["candidate_disposition_basis"]
        assert row["prior_individual_reason_code"] == "HANGUL_SURFACE_EVIDENCE_NOT_IPA"
        assert row["prior_independent_ipa_review_status"].startswith("NIKL_Hangul_surface_attestation_only")


def test_nikl_dictionary_fortis_affricate_confirms_hyeomojeung_only():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["2010"]
    assert row["token"] == "혐오증"
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "혐오증(嫌惡症)[혀모쯩]" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-KRDICT-HYEMO" in row["candidate_disposition_basis"]
    assert row["prior_independent_ipa_review_status"] == "NOT_PERFORMED"


def test_nikl_dictionary_attestation_upgrades_provisional_chulsan_retain():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["1140"]
    assert row["token"] == "출산"
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "출산[출싼]" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-DIC-CHULSAN" in row["candidate_disposition_basis"]
    assert row["prior_individual_reason_code"] == "SOURCE_BACKED_R012_RETAIN_PENDING_INDEPENDENT_REVIEW"
    assert row["prior_individual_rationale"].startswith("The current Kozak Kim rule inventory")
    assert row["prior_independent_ipa_review_status"] == "independent_Korean_review_pending"


def test_nikl_rule_5_does_not_apply_to_heom_in_cheheom():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    expected = {
        "257": "문화체험공간",
        "813": "사전체험",
        "853": "만듬사전체험때",
    }
    for occurrence_id, token in expected.items():
        row = rows[occurrence_id]
        assert row["token"] == token
        assert row["candidate_disposition"] == "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW"
        assert "체험 is 체 + 험" in row["candidate_disposition_basis"]
        assert "ㅓ, not ㅕ" in row["candidate_disposition_basis"]
        assert row["prior_individual_reason_code"] == "UNMAPPED_FRAGMENT_AND_NO_INDEPENDENT_IPA_GOLD"
        assert row["prior_independent_ipa_review_status"] == "NOT_PERFORMED"


def test_nikl_sino_korean_rule_26_confirms_paljageoreum():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["1406"]
    assert row["token"] == "팔자걸음"
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "팔자[팔짜]" in row["candidate_disposition_basis"]
    assert "Rule 26" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-KRDICT-82835" in row["candidate_disposition_basis"]


def test_nikl_rule_27_confirms_connected_anhaldeut():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["2533"]
    assert row["token"] == "안할듯"
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "Rule 27" in row["candidate_disposition_basis"]
    assert "할 듯하다[할뜨타다]" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-QNA-317798" in row["candidate_disposition_basis"]
    assert "pause can license the plain consonant" in row["candidate_disposition_basis"]


def test_nikl_rule_27_adjudicates_boileul_geora_exact_morphosyntactic_context():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["1527"]
    assert row["token"] == "보일거라"
    assert "보일거라 생각하는건가" in row["source_context_text"]
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "NIKL Standard Pronunciation Rule 27" in row["candidate_disposition_basis"]
    assert "보일 거라" in row["candidate_disposition_basis"]
    assert "할 것을 [할꺼슬]" in row["candidate_disposition_basis"]
    assert "no general ㄹ+ㄱ rewrite" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-QNA-310899" in row["candidate_disposition_basis"]
    assert row["prior_independent_ipa_review_status"] == "NOT_PERFORMED"


def test_nikl_rule_4_alone_does_not_adjudicate_oeok_hiatus_glide():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["78"]
    assert row["token"] == "오조오억배"
    assert "오억" in row["source_context_text"]
    assert row["candidate_disposition"] == "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW"
    assert "Rule 4 classifies ㅓ as a monophthong" in row["candidate_disposition_basis"]
    assert "possible /w/ insertion after a syllable ending in /o/ or /u/" in row["candidate_disposition_basis"]
    assert "None of the located abstracts directly tests 오조오억배" in row["candidate_disposition_basis"]
    assert "token audio or independent Korean IPA review" in row["candidate_disposition_basis"]
    assert row["prior_individual_reason_code"] == "UNMAPPED_FRAGMENT_AND_NO_INDEPENDENT_IPA_GOLD"
    assert row["prior_independent_ipa_review_status"] == "NOT_PERFORMED"


def test_expert_attested_meoritsok_confirms_exact_saisiot_lexeme():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["2490"]
    assert row["token"] == "머리속에"
    assert "포지션을 머리속에 집어넣고서" in row["source_context_text"]
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "머릿속[머리쏙]" in row["candidate_disposition_basis"]
    assert "figurative lexical meaning" in row["candidate_disposition_basis"]
    assert "SRC-KIMNAMMI-2017-DONGA-MEORISSOK" in row["candidate_disposition_basis"]
    assert "not a controlled acoustic study" in row["candidate_disposition_basis"]


def test_nikl_dictionary_confirms_exact_yusaseong_fortis_sibilant():
    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["826"]
    assert row["token"] == "유사성"
    assert "장르의 유사성" in row["source_context_text"]
    assert row["candidate_disposition"] == "RULE_CONFIRMED_STANDARD_VARIANT"
    assert "gives the pronunciation [유ː사썽]" in row["candidate_disposition_basis"]
    assert "SRC-NIKL-KRDICT-YUSASEONG" in row["candidate_disposition_basis"]
    assert "It does not establish a productive fortition rule for the suffix -성" in row["candidate_disposition_basis"]


def test_mental_patient_occurrence_is_closed_by_exact_r014_and_broad_profile_evidence():
    from korean_ukrainian.pipeline import phoneticize_korean

    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    row = rows["2562"]
    assert row["token"] == "정신병자네"
    assert row["candidate_disposition"] == "PROFILE_CONVENTION_MISMATCH_CONFIRMED"
    assert "정신병자[정신뼝자]" in row["candidate_disposition_basis"]
    assert "R014:compound:정신병자네:신>병" in row["candidate_disposition_basis"]
    assert "broad profile /s/ canonical" in row["candidate_disposition_basis"]
    assert "not a demonstrated phonemic error" in row["candidate_disposition_basis"]

    current = phoneticize_korean("정신병자네")
    assert current["surface_hangul"] == "정신뼝자네"
    assert any(
        rule.get("rule_id") == "R014"
        and rule.get("changed") is True
        and rule.get("license_context") == "R014:compound:정신병자네:신>병"
        for rule in current["rules"]
    )
    assert "p͈" in current["ipa"]["ipa"]
    assert "b" not in current["ipa"]["ipa"]
    assert any("ɕ" in variant["ipa"] for variant in current["ipa"]["variants"])


def test_two_eopda_occurrences_are_profile_mismatches_not_acoustic_gold():
    from korean_ukrainian.pipeline import phoneticize_korean

    rows = {row["occurrence_id"]: row for row in MODULE.build_rows(ROOT)}
    for occurrence_id in ("520", "2307"):
        row = rows[occurrence_id]
        assert row["token"] == "없다"
        assert row["candidate_disposition"] == "PROFILE_CONVENTION_MISMATCH_CONFIRMED"
        assert "없다[업ː따]" in row["candidate_disposition_basis"]
        assert "Lee (1993)" in row["candidate_disposition_basis"]
        assert "/ʌː/" in row["candidate_disposition_basis"]
        assert "/ɘː/" in row["candidate_disposition_basis"]
        assert "not as a token-specific acoustic adjudication" in row["candidate_disposition_basis"]

    current = phoneticize_korean("없다")
    assert current["ipa"]["ipa"] == "ʌːp̚.t͈a"


def test_lenis_sibilant_profile_mismatches_are_limited_to_supported_high_front_contexts():
    import json

    rows = MODULE.build_rows(ROOT)
    scoped = [
        row for row in rows
        if row["candidate_disposition"] == "PROFILE_CONVENTION_MISMATCH_CONFIRMED"
        and row["prior_individual_reason_code"] == "LENIS_SIBILANT_BROAD_PROFILE_CONVENTION"
    ]
    assert len(scoped) == 147
    for row in scoped:
        fragments = json.loads(row["broad_mismatch_fragments"])
        assert fragments
        assert all(
            fragment["op"] == "S"
            and fragment["reference_fragment"] == "ɕ"
            and fragment["kozak_fragment"] == "s"
            for fragment in fragments
        ), row["occurrence_id"]
        supported = 0
        for char in row["token"]:
            if not ("가" <= char <= "힣"):
                continue
            syllable = ord(char) - 0xAC00
            onset = syllable // 588
            nucleus = (syllable % 588) // 28
            if onset == 9 and nucleus in {2, 19, 20}:  # ㅅ + ㅑ/ㅖ/ㅣ
                supported += 1
        assert supported == len(fragments), row["occurrence_id"]
        assert row["prior_independent_ipa_review_status"] == "profile_convention_adjudicated; token_specific_acoustic_IPA_review_not_performed"

    by_id = {row["occurrence_id"]: row for row in rows}
    assert by_id["293"]["candidate_disposition"] == "PROFILE_CONVENTION_MISMATCH_CONFIRMED"
    assert by_id["1206"]["candidate_disposition"] == "PROFILE_CONVENTION_MISMATCH_CONFIRMED"
    assert by_id["538"]["candidate_disposition"] == "ABSTAIN_PENDING_INDEPENDENT_IPA_REVIEW"
