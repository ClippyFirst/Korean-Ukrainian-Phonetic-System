"""Regression tests for low-confidence morphology-consensus rule licensing."""
from korean_ukrainian.morphology_rule_licenses import (
    analyzer_consensus_rule_licenses,
    phoneticize_korean_with_analyzer_consensus,
)


def _analysis(name, text, morphemes):
    return {
        "text": text,
        "analyzer": name,
        "morphemes": [
            {
                "form": form, "tag": tag, "start": start, "end": end,
                "surface": text[start:end], "span_status": "surface_aligned",
            }
            for form, tag, start, end in morphemes
        ],
    }


def test_analyzer_consensus_licenses_formal_ending_not_just_adjacent_vowels():
    analyses = [
        _analysis("mecab-ko", "같아서", [("같", "VA", 0, 1), ("아서", "EC", 1, 3)]),
        _analysis("kiwi", "같아서", [("같", "VA", 0, 1), ("어서", "EC", 1, 3)]),
    ]
    report = analyzer_consensus_rule_licenses("같아서", analyses)
    assert "R002:formal:같아서:같>아" in report["candidate_licenses"]
    assert report["analyzers"] == ["kiwi", "mecab-ko"]
    assert report["status"] == "analyzed_not_adjudicated"


def test_analyzer_consensus_does_not_license_lexicalized_many_i():
    analyses = [
        _analysis("mecab-ko", "많이", [("많이", "MAG", 0, 2)]),
        _analysis("kiwi", "많이", [("많이", "MAG", 0, 2)]),
    ]
    report = analyzer_consensus_rule_licenses("많이", analyses)
    assert report["candidate_licenses"] == []
    assert report["consensus_boundaries"] == []


def test_analyzer_consensus_rejects_one_analyzer_boundary_disagreement():
    analyses = [
        _analysis("mecab-ko", "같이", [("같", "VA", 0, 1), ("이", "JKS", 1, 2)]),
        _analysis("kiwi", "같이", [("같이", "MAG", 0, 2)]),
    ]
    report = analyzer_consensus_rule_licenses("같이", analyses)
    assert report["candidate_licenses"] == []


def test_analyzer_consensus_candidate_is_never_promoted_to_accepted_ipa():
    analyses = [
        _analysis("mecab-ko", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)]),
        _analysis("kiwi", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)]),
    ]
    result = phoneticize_korean_with_analyzer_consensus("좋아", analyses)
    assert result["morphology_mode"] == "analyzer-consensus"
    assert result["ipa_is_diagnostic_only"] is True
    assert result["ipa_status"] == "diagnostic_only_analyzer_morphology"
    assert "R003:ending_or_suffix_h_deletion:좋아:좋>아" in result["morphology_analysis"]["applied_licenses"]
    assert any(trace.get("status") == "analyzer-supported-low-confidence" for trace in result["rules"])


def test_analyzer_consensus_rejects_zero_width_boundary_evidence():
    analyses = [
        _analysis("mecab-ko", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)]),
        {
            "text": "좋아", "analyzer": "kiwi",
            "morphemes": [
                {"form": "좋", "tag": "VA", "start": 0, "end": 1, "surface": "좋"},
                {"form": "zero", "tag": "EF", "start": 1, "end": 1, "surface": "", "span_status": "zero_width_morph"},
                {"form": "아", "tag": "EC", "start": 1, "end": 2, "surface": "아"},
            ],
        },
    ]
    report = analyzer_consensus_rule_licenses("좋아", analyses)
    assert report["candidate_licenses"] == []


def test_analyzer_consensus_withholds_candidate_when_unspaced_phrase_boundary_is_likely():
    analyses = [
        _analysis("mecab-ko", "못잃어", [
            ("못", "MAG", 0, 1), ("잃", "VV", 1, 2), ("어", "EC", 2, 3),
        ]),
        _analysis("kiwi", "못잃어", [
            ("못", "MAG", 0, 1), ("잃", "VV", 1, 2), ("어", "EC", 2, 3),
        ]),
    ]
    report = analyzer_consensus_rule_licenses("못잃어", analyses)
    assert report["blocked_unspaced_multiword_boundaries"] == [1]
    assert report["candidate_licenses"] == []


def test_analyzer_license_does_not_mask_independent_ipa_adjudication_blocker():
    analyses = [
        _analysis("mecab-ko", "삶의", [("삶", "NNG", 0, 1), ("의", "JX", 1, 2)]),
        _analysis("kiwi", "삶의", [("삶", "NNG", 0, 1), ("의", "JX", 1, 2)]),
    ]
    result = phoneticize_korean_with_analyzer_consensus("삶의", analyses)
    assert result["pronunciation_status"] == "unresolved"
    assert result["ipa_status"] == "diagnostic_only_unresolved_pronunciation"
    assert result["ipa_is_diagnostic_only"] is True
    assert any(context.get("rule_id") == "IPA_ADJUDICATION" for context in result["unresolved_contexts"])



def test_analyzer_consensus_productively_licenses_verbal_stem_rieul_giyeok_exception():
    analyses = [
        _analysis("mecab-ko", "읽고", [("읽", "VV", 0, 1), ("고", "EC", 1, 2)]),
        _analysis("kiwi", "읽고", [("읽", "VV", 0, 1), ("고", "EC", 1, 2)]),
    ]
    report = analyzer_consensus_rule_licenses("읽고", analyses)
    license = "R016:verb_stem_rieul_giyeok_suffix:읽고:읽>고"
    assert license in report["candidate_licenses"]
    result = phoneticize_korean_with_analyzer_consensus("읽고", analyses)
    assert result["surface_hangul"] == "일꼬"
    assert license in result["morphology_analysis"]["applied_licenses"]
    assert result["ipa_is_diagnostic_only"] is True


def test_analyzer_consensus_productively_licenses_stem_fortition_but_not_nouns():
    cases = [
        ("넓고", [("넓", "VA", 0, 1), ("고", "EC", 1, 2)],
         "R011:stem_lb_lt+suffix:넓고:넓>고", "널꼬"),
        # ㅎ-bearing ㄶ does not license §24 fortition; the surface is aspirated 만타.
        ("많다", [("많", "VA", 0, 1), ("다", "EF", 1, 2)],
         None, "만타"),
    ]
    for word, morphemes, expected_license, expected_surface in cases:
        analyses = [
            _analysis("mecab-ko", word, morphemes),
            _analysis("kiwi", word, morphemes),
        ]
        report = analyzer_consensus_rule_licenses(word, analyses)
        if expected_license is None:
            assert not any(item.startswith("R010:") for item in report["candidate_licenses"])
        else:
            assert expected_license in report["candidate_licenses"]
        if word == "물가로":
            detail = next(item for item in report["licensed_boundaries"] if item.get("lexical_root_extensions"))
            extension = detail["lexical_root_extensions"][0]
            assert extension["registered_root"] == "물가"
            assert extension["internal_pair"] == "물>가"
            assert extension["license"] == expected_license
        result = phoneticize_korean_with_analyzer_consensus(word, analyses)
        assert result["surface_hangul"] == expected_surface
        if expected_license is None:
            assert not any(item.startswith("R010:") for item in result["morphology_analysis"]["applied_licenses"])
        else:
            assert expected_license in result["morphology_analysis"]["applied_licenses"]
        assert result["ipa_is_diagnostic_only"] is True

    noun = "닭고기"
    noun_analyses = [
        _analysis("mecab-ko", noun, [("닭", "NNG", 0, 1), ("고기", "NNG", 1, 3)]),
        _analysis("kiwi", noun, [("닭", "NNG", 0, 1), ("고기", "NNG", 1, 3)]),
    ]
    noun_report = analyzer_consensus_rule_licenses(noun, noun_analyses)
    assert not any(item.startswith("R016:") for item in noun_report["candidate_licenses"])



def test_analyzer_consensus_extends_only_registered_lexical_roots_before_grammatical_suffixes():
    cases = [
        ("물가로", [("물가", "NNG", 0, 2), ("로", "JKB", 2, 3)],
         "R014:compound:물가로:물>가", "물까로"),
        ("봄비가", [("봄비", "NNG", 0, 2), ("가", "JKS", 2, 3)],
         "R014:compound:봄비가:봄>비", "봄삐가"),
        ("냇가에", [("냇가", "NNG", 0, 2), ("에", "JKB", 2, 3)],
         "R015:saisiot:냇가에:냇>가", "내까에"),
        ("갈등이", [("갈등", "NNG", 0, 2), ("이", "JKS", 2, 3)],
         "R012:sino_ryeon:갈등이:갈>등", "갈뜽이"),
    ]
    for word, morphemes, expected_license, expected_surface in cases:
        analyses = [
            _analysis("mecab-ko", word, morphemes),
            _analysis("kiwi", word, morphemes),
        ]
        report = analyzer_consensus_rule_licenses(word, analyses)
        assert expected_license in report["candidate_licenses"]
        result = phoneticize_korean_with_analyzer_consensus(word, analyses)
        assert result["surface_hangul"] == expected_surface
        assert expected_license in result["morphology_analysis"]["applied_licenses"]
        assert result["ipa_is_diagnostic_only"] is True


def test_analyzer_consensus_does_not_extend_lexical_root_into_another_noun():
    word = "물가공"
    analyses = [
        _analysis("mecab-ko", word, [("물가", "NNG", 0, 2), ("공", "NNG", 2, 3)]),
        _analysis("kiwi", word, [("물가", "NNG", 0, 2), ("공", "NNG", 2, 3)]),
    ]
    report = analyzer_consensus_rule_licenses(word, analyses)
    assert not any(item.startswith(("R012:", "R014:", "R015:")) for item in report["candidate_licenses"])



def test_analyzer_consensus_rejects_missing_or_nonliteral_surface_alignment():
    good = _analysis("mecab-ko", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)])
    bad = _analysis("kiwi", "좋아", [("좋", "VA", 0, 1), ("아", "EC", 1, 2)])
    del bad["morphemes"][0]["surface"]
    report = analyzer_consensus_rule_licenses("좋아", [good, bad])
    assert report["candidate_licenses"] == []



def test_lexical_root_extension_requires_particle_versus_ending_class_agreement():
    word = "물가로"
    analyses = [
        _analysis("mecab-ko", word, [("물가", "NNG", 0, 2), ("로", "JKB", 2, 3)]),
        _analysis("kiwi", word, [("물가", "NNG", 0, 2), ("로", "EC", 2, 3)]),
    ]
    report = analyzer_consensus_rule_licenses(word, analyses)
    assert not any(item.startswith(("R012:", "R014:", "R015:")) for item in report["candidate_licenses"])
