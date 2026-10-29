from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path
from contextlib import nullcontext
from types import SimpleNamespace

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "benchmark_charsiu_g2p.py"
sys.path.insert(0, str(SCRIPT.parent))
SPEC = importlib.util.spec_from_file_location("benchmark_charsiu_g2p", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def test_neural_score_uses_existing_broad_ipa_normalization_and_phonetic_metrics():
    score = MODULE.score_prediction("kʰa", "kʰa")
    assert score["exact"] is True
    assert score["distance"] == 0
    assert score["phoneme_error_rate"] == 0
    assert score["feature_error_rate_proxy"] == 0
    assert "unsupported_feature_segments" in score


def test_neural_metric_aggregation_includes_per_and_feature_proxy():
    score = MODULE.score_prediction("kʰa", "kʰa")
    metrics = MODULE._metrics([score])
    assert metrics["phoneme_error_rate"] == 0
    assert metrics["phonological_feature_error_rate_proxy"] == 0
    assert metrics["reference_phoneme_segments"] > 0


def test_evaluate_keeps_occurrences_and_reports_coverage_separately():
    rows = [{
        "id": "row-1",
        "lang": "ko",
        "split": "test",
        "text": "가 나",
        "canonical": "가 나",
        "phonemes": "ka na",
        "tokens": [
            {"canonical": "가", "phoneme": "ka"},
            {"canonical": "나", "phoneme": "na"},
            {"canonical": "가", "phoneme": "ka"},
        ],
    }]
    report = MODULE.evaluate(rows, {"가": "ka"})
    assert report["eligible_occurrences"] == 3
    assert report["unique_words"] == 2
    assert report["scored_occurrences"] == 2
    assert report["coverage"] == 0.666667
    assert report["exact_matches"] == 2
    assert report["missing_predictions"] == 1
    assert report["phoneme_error_rate"] == 0
    assert report["phonological_feature_error_rate_proxy"] == 0
    assert report["reference_phoneme_segments"] > 0
    assert [x["occurrence_id"] for x in report["predictions"]] == [0, 2]


def test_empty_or_unusable_gold_is_rejected():
    try:
        MODULE.score_prediction("ka", " , ")
    except ValueError as exc:
        assert "no non-empty variants" in str(exc)
    else:
        raise AssertionError("empty gold must not score as a success")


def test_word_only_contract_filters_non_hangul_and_multitoken():
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가 ABC 가 나",
        "canonical": "가 ABC 가 나", "phonemes": "", "tokens": [
            {"canonical": "가", "phoneme": "ka"},
            {"canonical": "ABC", "phoneme": "eɪ bi si"},
            {"canonical": "가 나", "phoneme": "ka na"},
        ],
    }]
    occurrences, words = MODULE.eligible_occurrences(rows)
    assert len(occurrences) == 1
    assert words == ["가"]


def test_paired_comparison_uses_same_occurrence_denominator_and_reports_abstentions():
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가 나 가",
        "canonical": "가 나 가", "phonemes": "ka na ka", "tokens": [
            {"canonical": "가", "phoneme": "ka"},
            {"canonical": "나", "phoneme": "na"},
            {"canonical": "가", "phoneme": "ka"},
        ],
    }]
    neural = {"가": "ka", "나": "na"}
    baselines = {
        "clippyfirst_native": {
            "가": {"status": "scored", "ipa": "ka"},
            "나": {"status": "abstained", "reason": "unresolved context"},
        },
        "g2pk_0_9_4": {
            "가": {"status": "scored", "ipa": "ka"},
            "나": {"status": "scored", "ipa": "na"},
        },
    }
    report = MODULE.compare_baselines(rows, neural, baselines)
    assert report["charsiu_byt5"]["eligible_occurrences"] == 3
    assert report["charsiu_byt5"]["scored_occurrences"] == 3
    assert report["clippyfirst_native"]["scored_occurrences"] == 2
    assert report["clippyfirst_native"]["coverage"] == 0.666667
    assert report["paired_comparisons"]["clippyfirst_native"]["common_scored_occurrences"] == 2
    assert report["paired_comparisons"]["g2pk_0_9_4"]["common_scored_occurrences"] == 3
    assert len(report["per_occurrence"]) == 3
    assert report["per_occurrence"][1]["clippyfirst_native"]["status"] == "abstained"


def test_report_discloses_weights_license_uncertainty(monkeypatch):
    monkeypatch.setenv("CHARSIU_MODEL_REVISION_REQUESTED", "ed5cf99")
    monkeypatch.setenv("CHARSIU_RESOLVED_MODEL_REVISION", "a" * 40)
    monkeypatch.setenv("CHARSIU_TOKENIZER_REVISION_REQUESTED", "68377bd")
    monkeypatch.setenv("CHARSIU_RESOLVED_TOKENIZER_REVISION", "b" * 40)
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가",
        "canonical": "가", "phonemes": "ka", "tokens": [{"canonical": "가", "phoneme": "ka"}],
    }]
    report = MODULE.evaluate(rows, {"가": "ka"})
    assert report["model_revision"] == "a" * 40
    assert report["tokenizer_revision"] == "b" * 40
    assert report["model_weights_license_status"].startswith("UNRESOLVED")



def test_predict_preserves_empty_invalid_and_valid_outputs(monkeypatch):
    class FakeTorch:
        no_grad = staticmethod(nullcontext)

    class FakeTokenizer:
        def __init__(self):
            self.texts = []

        def __call__(self, texts, **kwargs):
            self.texts.extend(texts)
            return {}

        def batch_decode(self, output, skip_special_tokens=True):
            return ["", "가", "ka"]

    class FakeModel:
        def generate(self, **kwargs):
            return SimpleNamespace(tolist=lambda: [0, 1, 2])

    tokenizer = FakeTokenizer()
    monkeypatch.setattr(MODULE, "load_model", lambda *args: (FakeTorch(), tokenizer, FakeModel()))
    predictions, failures = MODULE.predict(
        ["가", "나", "다"], model_id="model", revision="a" * 40,
        tokenizer_id="tokenizer", tokenizer_revision="b" * 40, batch_size=3,
    )
    assert tokenizer.texts == ["<kor>: 가", "<kor>: 나", "<kor>: 다"]
    assert predictions == {"다": "ka"}
    assert failures["가"]["status"] == "empty_output"
    assert failures["나"]["status"] == "invalid_output"
    assert failures["나"]["reason"].startswith("unexpected Hangul")


def test_predict_records_batch_runtime_errors_without_losing_other_batches(monkeypatch):
    class FakeTorch:
        no_grad = staticmethod(nullcontext)

    class FakeTokenizer:
        def __call__(self, texts, **kwargs):
            return {}

        def batch_decode(self, output, skip_special_tokens=True):
            return ["ka"]

    class FakeModel:
        def __init__(self):
            self.calls = 0

        def generate(self, **kwargs):
            self.calls += 1
            if self.calls == 1:
                raise RuntimeError("synthetic inference failure")
            return SimpleNamespace(tolist=lambda: [0])

    model = FakeModel()
    monkeypatch.setattr(MODULE, "load_model", lambda *args: (FakeTorch(), FakeTokenizer(), model))
    predictions, failures = MODULE.predict(
        ["가", "나", "다"], model_id="model", revision="a" * 40,
        tokenizer_id="tokenizer", tokenizer_revision="b" * 40, batch_size=2,
    )
    assert predictions == {"다": "ka"}
    assert failures["가"]["status"] == "model_error"
    assert failures["나"]["status"] == "model_error"
    assert "synthetic inference failure" in failures["가"]["reason"]



def test_existing_g2pk_baseline_uses_project_phonology_and_ipa_modules(monkeypatch):
    import korean_ukrainian.ipa as ipa_module
    import korean_ukrainian.phonology as phonology_module
    import korean_ukrainian.pipeline as pipeline_module

    fake_g2pk = types.ModuleType("g2pk")

    class FakeG2p:
        def __call__(self, word):
            return word

    fake_g2pk.G2p = FakeG2p
    monkeypatch.setitem(sys.modules, "g2pk", fake_g2pk)
    monkeypatch.setattr(pipeline_module, "phoneticize_korean", lambda word: {
        "pronunciation_status": "resolved", "ipa": {"ipa": "ha.kjo"}
    })
    monkeypatch.setattr(phonology_module, "parse_syllables", lambda surface: surface)
    monkeypatch.setattr(ipa_module, "realize_syllables", lambda parsed, level: {"ipa": "ha.kjo"})

    outputs = MODULE.collect_existing_baselines(["학교"])
    assert outputs["g2pk_0_9_4"]["학교"]["status"] == "scored"
    assert outputs["g2pk_0_9_4"]["학교"]["ipa"] == "ha.kjo"


def test_generic_licensed_model_metadata_and_engine_key():
    rows = [{
        "id": "row-1", "lang": "ko", "split": "test", "text": "가",
        "canonical": "가", "phonemes": "ka",
        "tokens": [{"canonical": "가", "phoneme": "ka"}],
    }]
    metadata = {
        "engine_key": "willwade_byt5_g2p_tiny",
        "model_label": "ByT5 multilingual G2P tiny (willwade)",
        "model_code_license": "Training code license not independently verified",
        "model_weights_license_status": "CC BY-SA 4.0 (model card)",
        "tokenizer_license": "CC BY-SA 4.0 checkpoint repo; Apache-2.0 base",
        "output_convention": "gruut-anchored, space-separated IPA",
    }
    report = MODULE.evaluate(rows, {"가": "k a"}, **metadata)
    assert report["engine_key"] == "willwade_byt5_g2p_tiny"
    assert report["engine"] == "ByT5 multilingual G2P tiny (willwade)"
    assert report["model_weights_license_status"].startswith("CC BY-SA 4.0")
    assert report["output_convention"].startswith("gruut-anchored")

    paired = MODULE.compare_baselines(rows, {"가": "ka"}, {
        "g2pk_0_9_4": {"가": {"status": "scored", "ipa": "ka"}},
    }, engine_key="willwade_byt5_g2p_tiny")
    assert "willwade_byt5_g2p_tiny" in paired
    assert paired["paired_comparisons"]["g2pk_0_9_4"]["common_scored_occurrences"] == 1
    assert paired["per_occurrence"][0]["willwade_byt5_g2p_tiny"]["status"] == "scored"


def test_predict_accepts_checkpoint_specific_language_prefix(monkeypatch):
    class FakeTorch:
        no_grad = staticmethod(nullcontext)

    class FakeTokenizer:
        def __init__(self):
            self.texts = []

        def __call__(self, texts, **kwargs):
            self.texts.extend(texts)
            return {}

        def batch_decode(self, output, skip_special_tokens=True):
            return ["k a"]

    class FakeModel:
        def generate(self, **kwargs):
            return SimpleNamespace(tolist=lambda: [0])

    tokenizer = FakeTokenizer()
    monkeypatch.setattr(MODULE, "load_model", lambda *args: (FakeTorch(), tokenizer, FakeModel()))
    predictions, failures = MODULE.predict(
        ["학교"], model_id="model", revision="a" * 40,
        tokenizer_id="tokenizer", tokenizer_revision="b" * 40,
        batch_size=1, language_prefix="kor:",
    )
    assert tokenizer.texts == ["kor: 학교"]
    assert predictions == {"학교": "k a"}
    assert failures == {}
