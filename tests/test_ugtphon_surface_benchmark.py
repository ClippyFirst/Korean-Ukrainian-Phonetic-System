from __future__ import annotations

from scripts.benchmark_ugtphon_ko_surface import (
    build_normalization_datastore,
    evaluate_surface,
)


def _row(*tokens):
    return {
        "id": "fixture",
        "lang": "ko",
        "split": "train",
        "text": " ".join(token["text"] for token in tokens),
        "tokens": list(tokens),
    }


def test_datastore_keeps_only_unique_noncanonical_exact_matches():
    train = [
        _row(
            {"text": "ㅋㅋ", "canonical": "크크", "is_nc": True, "nc_type": "B2"},
            {"text": "ㅇㄱㄹㅇ", "canonical": "이거레알", "is_nc": True, "nc_type": "A1"},
            {"text": "서울", "canonical": "서울", "is_nc": False, "nc_type": None},
        )
    ]

    store = build_normalization_datastore(train)

    assert store.mapping == {"ㅋㅋ": "크크", "ㅇㄱㄹㅇ": "이거레알"}
    assert store.ambiguous_keys == ()
    assert store.blocked_canonical_collisions == ()


def test_datastore_abstains_on_ambiguous_forms_and_canonical_collisions():
    train = [
        _row(
            {"text": "ㅋㅋ", "canonical": "크크", "is_nc": True, "nc_type": "B2"},
            {"text": "ㅋㅋ", "canonical": "키키", "is_nc": True, "nc_type": "B2"},
            {"text": "짱", "canonical": "짱", "is_nc": False, "nc_type": None},
            {"text": "짱", "canonical": "짱짱", "is_nc": True, "nc_type": "B1"},
        )
    ]

    store = build_normalization_datastore(train)

    assert store.mapping == {}
    assert store.ambiguous_keys == ("ㅋㅋ",)
    assert store.blocked_canonical_collisions == ("짱",)


def test_datastore_abstains_on_multiple_canonical_variants():
    train = [
        _row(
            {"text": "ㅋㅋ", "canonical": "크크,키키", "is_nc": True, "nc_type": "B2"},
        )
    ]

    store = build_normalization_datastore(train)

    assert store.mapping == {}
    assert store.ambiguous_keys == ("ㅋㅋ",)


def test_surface_evaluation_uses_train_lookup_not_test_gold_normalization(monkeypatch):
    calls = []

    def fake_phoneticize(text, *, ipa_level="broad"):
        calls.append((text, ipa_level))
        return {
            "pronunciation_status": "resolved",
            "ipa": {"ipa": "kɯ.kʰɯ"},
        }

    monkeypatch.setattr(
        "korean_ukrainian.pipeline.phoneticize_korean",
        fake_phoneticize,
    )
    train = [
        _row(
            {"text": "ㅋㅋ", "canonical": "크크", "is_nc": True, "nc_type": "B2"},
        )
    ]
    store = build_normalization_datastore(train)
    test_rows = [{
        "id": "test_1",
        "lang": "ko",
        "split": "test",
        "text": "ㅋㅋ",
        "tokens": [{
            "text": "ㅋㅋ",
            "canonical": "MUST_NOT_BE_USED",
            "phoneme": "kɯ.kʰɯ",
            "is_nc": True,
            "nc_type": "B2",
        }],
    }]

    report = evaluate_surface(test_rows, store, ipa_level="broad")

    assert calls == [("크크", "broad")]
    assert report["scored_tokens"] == 1
    assert report["exact_match_rate"] == 1.0
    assert report["normalization"]["hits"] == 1
    assert report["normalization"]["hits_noncanonical"] == 1
    assert report["normalization"]["hits_canonical"] == 0
    assert report["by_category"]["B2"]["exact_match_rate"] == 1.0


def test_surface_evaluation_reports_canonical_false_rewrite_risk(monkeypatch):
    calls = []

    def fake_phoneticize(text, *, ipa_level="broad"):
        calls.append(text)
        return {
            "pronunciation_status": "resolved",
            "ipa": {"ipa": "tɕ͈aŋ"},
        }

    monkeypatch.setattr(
        "korean_ukrainian.pipeline.phoneticize_korean",
        fake_phoneticize,
    )
    store = build_normalization_datastore([
        _row(
            {"text": "짱", "canonical": "짱짱", "is_nc": True, "nc_type": "B1"},
        )
    ])
    test_rows = [{
        "id": "test_2",
        "lang": "ko",
        "split": "test",
        "text": "짱",
        "tokens": [{
            "text": "짱",
            "canonical": "짱",
            "phoneme": "tɕ͈aŋ",
            "is_nc": False,
            "nc_type": None,
        }],
    }]

    report = evaluate_surface(test_rows, store)

    assert calls == ["짱짱"]
    assert report["normalization"]["hits_canonical"] == 1
    assert report["normalization"]["potential_canonical_false_rewrites"] == 1


def test_surface_evaluation_keeps_unresolved_and_engine_errors_separate(monkeypatch):
    def fake_phoneticize(text, *, ipa_level="broad"):
        if text == "unsupported":
            raise ValueError("unsupported input")
        return {"pronunciation_status": "unresolved", "ipa": {"ipa": ""}}

    monkeypatch.setattr(
        "korean_ukrainian.pipeline.phoneticize_korean",
        fake_phoneticize,
    )
    store = build_normalization_datastore([])
    rows = [{
        "id": "test_3",
        "lang": "ko",
        "split": "test",
        "text": "가 unsupported",
        "tokens": [
            {"text": "가", "phoneme": "ka", "is_nc": False, "nc_type": None},
            {"text": "unsupported", "phoneme": "sʌpʰɔɾtʰɯ", "is_nc": True, "nc_type": "C3"},
        ],
    }]

    report = evaluate_surface(rows, store)

    assert report["unresolved_tokens"] == 1
    assert report["engine_errors"] == 1
    assert report["scored_tokens"] == 0
