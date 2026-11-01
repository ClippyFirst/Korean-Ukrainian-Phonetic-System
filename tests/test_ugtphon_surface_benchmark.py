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



def test_context_retrieval_disambiguates_ambiguous_surface_from_train_context(monkeypatch):
    train = [
        _row(
            {"text": "가", "canonical": "가", "is_nc": False, "nc_type": None},
            {"text": "ㅋㅋ", "canonical": "크크", "is_nc": True, "nc_type": "B2"},
            {"text": "다", "canonical": "다", "is_nc": False, "nc_type": None},
        ),
        _row(
            {"text": "가", "canonical": "가", "is_nc": False, "nc_type": None},
            {"text": "ㅋㅋ", "canonical": "키키", "is_nc": True, "nc_type": "B2"},
            {"text": "라", "canonical": "라", "is_nc": False, "nc_type": None},
        ),
    ]
    train[0]["id"] = "train_context_1"
    train[1]["id"] = "train_context_2"
    store = build_normalization_datastore(train)

    assert "ㅋㅋ" not in store.mapping
    assert store.context_mapping[("가", "ㅋㅋ", "라")] == "키키"

    def fake_phoneticize(text, *, ipa_level="broad"):
        ipa = {"가": "ka", "키키": "kiki", "라": "ɾa"}[text]
        return {"pronunciation_status": "resolved", "ipa": {"ipa": ipa}}

    monkeypatch.setattr(
        "korean_ukrainian.pipeline.phoneticize_korean",
        fake_phoneticize,
    )
    test_rows = [{
        "id": "context_test",
        "lang": "ko",
        "split": "test",
        "text": "가 ㅋㅋ 라",
        "tokens": [
            {"text": "가", "canonical": "가", "phoneme": "ka", "is_nc": False, "nc_type": None},
            {"text": "ㅋㅋ", "canonical": "not-a-prediction-source", "phoneme": "kiki", "is_nc": True, "nc_type": "B2"},
            {"text": "라", "canonical": "라", "phoneme": "ɾa", "is_nc": False, "nc_type": None},
        ],
    }]

    report = evaluate_surface(test_rows, store)

    assert report["normalization"]["context_hits"] == 1
    assert report["normalization"]["surface_hits"] == 0
    assert report["normalization"]["hits_noncanonical"] == 1
    assert report["exact_matches"] == 3
    hit = next(item for item in report["normalization_hit_examples"] if item["surface"] == "ㅋㅋ")
    assert hit["g2p_input"] == "키키"
    assert hit["retrieval_method"] == "exact_context"


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
    assert report["coverage_rate"] == 1.0
    assert report["exact_match_rate"] == 1.0
    assert report["coverage_adjusted_exact_match_rate"] == 1.0
    assert report["normalization"]["hits"] == 1
    assert report["normalization"]["noncanonical_tokens"] == 1
    assert report["normalization"]["retrieval_hit_rate_noncanonical"] == 1.0
    assert report["normalization"]["hits_noncanonical"] == 1
    assert report["normalization"]["hits_canonical"] == 0
    assert report["by_category"]["B2"]["exact_match_rate"] == 1.0
    assert report["by_category"]["B2"]["normalization_hits"] == 1
    assert report["normalization_hit_examples"][0]["surface"] == "ㅋㅋ"
    assert report["normalization_hit_examples"][0]["g2p_input"] == "크크"
    assert report["ipa_profile_status"] == "unavailable"


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


def test_surface_evaluation_separates_unresolved_engine_errors_and_unsupported_input(monkeypatch):
    def fake_phoneticize(text, *, ipa_level="broad"):
        if text == "가":
            raise RuntimeError("simulated engine failure")
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
        "text": "가 나 API",
        "tokens": [
            {"text": "가", "phoneme": "ka", "is_nc": False, "nc_type": None},
            {"text": "나", "phoneme": "na", "is_nc": False, "nc_type": None},
            {"text": "API", "phoneme": "eɪ.pi.aɪ", "is_nc": True, "nc_type": "C3"},
        ],
    }]

    report = evaluate_surface(rows, store)

    assert report["unresolved_tokens"] == 1
    assert report["engine_errors"] == 1
    assert report["unsupported_input_tokens"] == 1
    assert report["unsupported_input_examples"][0]["surface"] == "API"
    assert report["scored_tokens"] == 0
    assert report["coverage_rate"] == 0.0
    assert report["coverage_adjusted_exact_match_rate"] == 0.0
    assert report["unresolved_examples"][0]["surface"] == "나"
    assert report["engine_error_examples"][0]["surface"] == "가"


def test_surface_report_exposes_case_level_mismatches(monkeypatch):
    def fake_phoneticize(text, *, ipa_level="broad"):
        return {
            "pronunciation_status": "resolved",
            "ipa": {"ipa": "kɯ"},
        }

    monkeypatch.setattr(
        "korean_ukrainian.pipeline.phoneticize_korean",
        fake_phoneticize,
    )
    report = evaluate_surface([{
        "id": "test_4",
        "lang": "ko",
        "split": "test",
        "text": "가",
        "tokens": [{
            "text": "가",
            "phoneme": "ka",
            "is_nc": False,
            "nc_type": None,
        }],
    }], build_normalization_datastore([]))

    assert report["exact_matches"] == 0
    assert report["worst_mismatches"][0]["surface"] == "가"
    assert report["worst_mismatches"][0]["predicted"] == "kɯ"
    assert report["worst_mismatches"][0]["normalization_hit"] is False


def test_direct_cli_runs_from_repository_root(tmp_path):
    import json
    import subprocess
    import sys
    from pathlib import Path

    root = Path(__file__).resolve().parents[1]
    train_path = tmp_path / "train.json"
    test_path = tmp_path / "test.json"
    output_path = tmp_path / "report.json"
    train_path.write_text(json.dumps([{
        "id": "train_cli",
        "lang": "ko",
        "split": "train",
        "text": "ㅋㅋ",
        "tokens": [{
            "text": "ㅋㅋ",
            "canonical": "크크",
            "is_nc": True,
            "nc_type": "B2",
        }],
    }], ensure_ascii=False), encoding="utf-8")
    test_path.write_text(json.dumps([{
        "id": "test_cli",
        "lang": "ko",
        "split": "test",
        "text": "ㅋㅋ",
        "tokens": [{
            "text": "ㅋㅋ",
            "phoneme": "kɯ.kʰɯ",
            "is_nc": True,
            "nc_type": "B2",
        }],
    }], ensure_ascii=False), encoding="utf-8")

    result = subprocess.run(
        [
            sys.executable,
            "scripts/benchmark_ugtphon_ko_surface.py",
            "--train-corpus", str(train_path),
            "--test-corpus", str(test_path),
            "--output", str(output_path),
        ],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 0, result.stderr
    report = json.loads(output_path.read_text(encoding="utf-8"))
    assert report["normalization"]["hits"] == 1
    assert report["attempted_tokens"] == 1
