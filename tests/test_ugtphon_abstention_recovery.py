"""Regression coverage for the current UGTPHON abstention-recovery batch.

These tests assert only that narrowly scoped Korean rule contexts are no longer
withheld. They do not claim that noisy UGTPHON IPA annotations are normative
gold or that the Ukrainian target layer has independent gold validation.
"""
from korean_ukrainian.pipeline import phoneticize_korean


R002_CASES = {
    "같아서": "같>아",
    "없음": "없>음",
    "되었어": "었>어",
    "찢었으면": "찢>었",
    "했었음": "했>었",
    "붙어야": "붙>어",
    "군대보냈어야": "냈>어",
    "이런삶은": "삶>은",
    "끝내고싶어유유유유": "싶>어",
    "이빨닦아야지": "닦>아",
    "안늙었는데": "늙>었",
    "있었": "있>었",
    "벗어날": "벗>어",
    "찾아": "찾>아",
    "좃같아서": "같>아",
    "없을듯": "없>을",
    "웃어넘기겟지만": "웃>어",
    "싶어서": "싶>어",
    "없으니깐": "없>으",
    "없으니까": "없>으",
    "멋있어": "있>어",
}

R003_CASES = {
    "쌓아서": "쌓>아",
    "쳐넣어야": "넣>어",
    "애새끼낳으면": "낳>으",
    "잃었노": "잃>었",
    "않았지만": "않>았",
    "개많음": "많>음",
    "좋은데": "좋>은",
    "괜찮아보이는디": "찮>아",
    "많을거같이": "많>을",
    "많이본": "많>이",
    "알잖아아침에": "잖>아",
    "좋아보인다고": "좋>아",
    "좋아해주는": "좋>아",
    "죽었잖아": "잖>아",
    "개좆망했잖아": "잖>아",
}


def _matching_contexts(result, rule_id, pair):
    return [
        context for context in result.get("unresolved_contexts", [])
        if context.get("rule_id") == rule_id and context.get("pair") == pair
    ]


def test_transparent_r002_abstentions_have_narrow_exact_form_licenses():
    for form, pair in R002_CASES.items():
        result = phoneticize_korean(form)
        assert not _matching_contexts(result, "R002", pair), (form, result.get("unresolved_contexts"))
        assert result.get("pronunciation_status") != "unresolved", (form, result.get("unresolved_contexts"))


def test_transparent_r003_abstentions_have_narrow_exact_form_licenses():
    for form, pair in R003_CASES.items():
        result = phoneticize_korean(form)
        assert not _matching_contexts(result, "R003", pair), (form, result.get("unresolved_contexts"))
        assert result.get("pronunciation_status") != "unresolved", (form, result.get("unresolved_contexts"))


def test_r007_exact_licensed_forms_resolve_only_the_named_pair():
    for form, palatalized_index in (("많을거같이", 4), ("개같이못하고", 2)):
        result = phoneticize_korean(form)
        assert not _matching_contexts(result, "R007", "같>이"), (form, result.get("unresolved_contexts"))
        assert result.get("pronunciation_status") != "unresolved", (form, result.get("unresolved_contexts"))
        # NIKL Q&A 327454 directly attests 같이[가치]. Assert the actual
        # Korean surface structure at 이, not only that the abstention vanished.
        assert result["surface_syllables"][palatalized_index]["onset"] == "ㅊ", form
        assert result["surface_syllables"][palatalized_index - 1]["coda"] == "", form
    result = phoneticize_korean("좋을거같이")
    assert _matching_contexts(result, "R007", "같>이")


def test_official_surface_attestations_match_the_korean_surface_layer():
    # NIKL surface notation only; these are not IPA or Ukrainian-output gold.
    # Length marks in [수ː마는] and [마ː나서] remain separate phonetic metadata.
    expected = {
        "없음": "업씀",
        "싫어서": "시러서",
        "수많은": "수마는",
        "많아서": "마나서",
    }
    for form, expected_surface in expected.items():
        result = phoneticize_korean(form)
        assert result["surface_hangul"] == expected_surface, form
        assert result["pronunciation_status"] != "unresolved", form


def test_official_dictionary_complex_h_suffix_license_changes_surface_structure():
    # The dictionary supports 긁히다[글키다]/긁혀[글켜]; the complete noisy
    # phrase is a rule-derived application, not a directly attested quote.
    result = phoneticize_korean("긁혔다는거지")
    assert result["surface_syllables"][0]["coda"] == "ㄹ"
    assert result["surface_syllables"][1]["onset"] == "ㅋ"
    assert not any(context.get("rule_id") == "R004" for context in result.get("unresolved_contexts", []))


def test_misspelled_and_unreviewed_lookalikes_remain_fail_closed():
    # Do not silently normalize noisy spellings into source-backed forms.
    for form, rule_id in (
        ("쫒아내면", "R002"),
        ("무서웟어", "R002"),
        ("많앗구나유유유", "R003"),
        ("많아보임", "R003"),
        ("많이봄", "R003"),
        ("좋아보임", "R003"),
        ("괜찮아보임", "R003"),
        ("좋아해줌", "R003"),
    ):
        result = phoneticize_korean(form)
        assert result.get("pronunciation_status") == "unresolved", (form, result)
        assert any(
            context.get("rule_id") == rule_id
            for context in result.get("unresolved_contexts", [])
        ), (form, result.get("unresolved_contexts"))


def test_official_dictionary_supported_r004_cluster_h_suffix_is_resolved():
    result = phoneticize_korean("긁혔다는거지")
    assert not any(context.get("rule_id") == "R004" for context in result.get("unresolved_contexts", []))
    assert result.get("pronunciation_status") != "unresolved", result.get("unresolved_contexts")
