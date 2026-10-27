from korean_ukrainian.pipeline import phoneticize_korean, transliterate_korean


def _ipa(word: str, level: str) -> dict:
    return phoneticize_korean(word, ipa_level=level)["ipa"]


def test_broad_ipa_contract_is_unchanged():
    assert _ipa("사", "broad")["ipa"] == "sa"
    assert _ipa("시", "broad")["ipa"] == "si"


def test_narrow_profile_aspirates_lenis_sibilant_without_changing_broad():
    narrow = _ipa("사", "narrow")
    assert narrow["ipa"] == "sʰa"
    assert narrow["level"] == "narrow"
    assert narrow["transcription_profile"]["name"] == "korean-narrow-partial-sibilant-nasal-v2"
    assert narrow["ipa_profile_version"] == 2
    assert narrow["transcription_profile"]["target_compatible"] is False
    assert narrow["transcription_profile"]["limitations"]


def test_narrow_profile_palatalizes_sibilants_only_in_reviewed_contexts():
    assert _ipa("시", "narrow")["ipa"] == "ɕʰi"
    assert _ipa("샤", "narrow")["ipa"] == "ɕʰja"
    assert _ipa("셰", "narrow")["ipa"] == "ɕʰje"
    # The source study reports a different spectral pattern for /yu, yo/,
    # so this partial profile intentionally does not extend [ɕʰ] to these.
    assert _ipa("쇼", "narrow")["ipa"] == "sʰjo"


def test_narrow_profile_palatalizes_n_before_glide_nuclei_but_not_before_i():
    assert _ipa("녀", "narrow")["ipa"] == "ɲjʌ"
    assert _ipa("냐", "narrow")["ipa"] == "ɲja"
    assert _ipa("뉴", "narrow")["ipa"] == "ɲju"
    # The rule is scoped to glide-initial nuclei, not generalized to /i/.
    assert _ipa("니", "narrow")["ipa"] == "ni"
    assert _ipa("난", "narrow")["ipa"] == "nan"
    # Broad IPA and the production-default profile remain unchanged.
    assert _ipa("녀", "broad")["ipa"] == "njʌ"


def test_tense_sibilant_is_not_aspirated_and_palatalization_is_not_assumed():
    assert _ipa("싸", "narrow")["ipa"] == "s͈a"
    # Evidence for tense /s͈/ palatalization is mixed; do not infer it from
    # the teacher's outputs or generalize the lenis /s/ rule.
    assert _ipa("쌰", "narrow")["ipa"] == "s͈ja"


def test_narrow_profile_is_explicitly_partial_and_does_not_change_target_default():
    narrow = _ipa("사", "narrow")
    broad = _ipa("사", "broad")
    assert narrow["realization_status"] == "partial-narrow-sibilant-profile"
    assert broad["ipa"] == "sa"
    assert broad.get("transcription_profile") is None



def test_partial_narrow_profile_is_not_accepted_as_ukrainian_target_input():
    result = transliterate_korean("사", ipa_level="narrow")
    assert result["target_status"] == "unavailable"
    assert result["target_unavailable_reason"] == "narrow_ipa_profile_not_target_compatible"
    assert result["ukrainian_orthography"] is None


def test_python_broad_fortis_sibilant_baseline_is_not_browser_profile_gold():
    # Python's broad profile currently emits s͈ before ㅣ; the browser's legacy
    # contextual profile emits ɕ͈. This records the Python side only and does
    # not adjudicate which profile is correct or enable target adaptation.
    assert _ipa("씨", "broad")["ipa"] == "s͈i"
    assert _ipa("싸", "broad")["ipa"] == "s͈a"
