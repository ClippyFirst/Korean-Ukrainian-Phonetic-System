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
