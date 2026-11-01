from scripts.benchmark_ugtphon_ko import edit_distance, load_corpus, normalize_ipa
import json


def test_ipa_normalization_removes_boundaries_and_known_narrow_vowel_marks():
    assert normalize_ipa("t͡ɕʰɛ̝.k̚") == normalize_ipa("tɕʰɛk̚")
    assert normalize_ipa("a̠") == normalize_ipa("a")


def test_ipa_normalization_preserves_phonologically_relevant_markers():
    assert normalize_ipa("k͈a") != normalize_ipa("ka")
    assert normalize_ipa("kʰa") != normalize_ipa("ka")
    assert normalize_ipa("aː") != normalize_ipa("a")


def test_edit_distance_known_values():
    assert edit_distance("", "ipa") == 3
    assert edit_distance("kɯn", "kɯn") == 0
    assert edit_distance("kɯn", "kɯm") == 1


def test_corpus_loader_validates_korean_test_split_and_unique_ids(tmp_path):
    row = {
        "id": "sample_1", "lang": "ko", "split": "test", "text": "가",
        "canonical": "가", "phonemes": "ka",
        "tokens": [{"text": "가", "canonical": "가", "phoneme": "ka"}],
    }
    path = tmp_path / "corpus.json"
    path.write_text(json.dumps([row]), encoding="utf-8")
    assert load_corpus(path) == [row]
    path.write_text(json.dumps([row, row]), encoding="utf-8")
    try:
        load_corpus(path)
    except ValueError as exc:
        assert "duplicate id" in str(exc)
    else:
        raise AssertionError("duplicate IDs must be rejected")


def test_corpus_loader_rejects_wrong_language(tmp_path):
    row = {
        "id": "sample_1", "lang": "en", "split": "test", "text": "ga",
        "canonical": "ga", "phonemes": "gɑ",
        "tokens": [{"text": "ga", "canonical": "ga", "phoneme": "gɑ"}],
    }
    path = tmp_path / "corpus.json"
    path.write_text(json.dumps([row]), encoding="utf-8")
    try:
        load_corpus(path)
    except ValueError as exc:
        assert "Korean test split" in str(exc)
    else:
        raise AssertionError("wrong-language corpus must be rejected")



def test_evaluate_records_and_uses_the_selected_ipa_profile(monkeypatch):
    from scripts.benchmark_ugtphon_ko import evaluate

    calls = []

    def fake_phoneticize(text, *, ipa_level="broad"):
        calls.append((text, ipa_level))
        return {
            "pronunciation_status": "resolved",
            "ipa": {
                "ipa": "ka",
                "ipa_profile": f"clippyfirst-korean-{ipa_level}-test",
                "ipa_profile_status": "partial-research-only" if ipa_level == "narrow" else "unadjudicated-cross-runtime",
                "ipa_profile_version": 3 if ipa_level == "narrow" else 1,
            },
        }

    monkeypatch.setattr("korean_ukrainian.pipeline.phoneticize_korean", fake_phoneticize)
    rows = [{
        "id": "sample_1",
        "lang": "ko",
        "split": "test",
        "text": "가",
        "canonical": "가",
        "phonemes": "ka",
        "tokens": [{"text": "가", "canonical": "가", "phoneme": "ka"}],
    }]

    report = evaluate(rows, ipa_level="narrow")

    assert calls == [("가", "narrow")]
    assert report["ipa_level"] == "narrow"
    assert report["ipa_profile"] == "clippyfirst-korean-narrow-test"
    assert report["ipa_profile_status"] == "partial-research-only"
    assert report["ipa_profile_version"] == 3
    assert report["exact_match_rate"] == 1.0



def test_sentence_benchmark_uses_sentence_gold_and_explicit_phrase_boundary_mode(monkeypatch):
    from scripts.benchmark_ugtphon_ko import evaluate_sentences

    calls = []

    def fake_phoneticize(text, *, ipa_level="broad", boundary_mode="same_word"):
        calls.append((text, ipa_level, boundary_mode))
        return {
            "pronunciation_status": "resolved",
            "ipa": {
                "ipa": "ka.na",
                "ipa_profile": "test-profile",
                "ipa_profile_status": "test-only",
                "ipa_profile_version": 1,
            },
        }

    monkeypatch.setattr("korean_ukrainian.pipeline.phoneticize_korean", fake_phoneticize)
    rows = [{
        "id": "sentence_1",
        "lang": "ko",
        "split": "test",
        "text": "가 나",
        "canonical": "가, 나!",
        "phonemes": "ka na",
        "tokens": [
            {"text": "가", "canonical": "가", "phoneme": "deliberately-wrong-token-gold"},
            {"text": "나", "canonical": "나", "phoneme": "also-not-used"},
        ],
    }]

    report = evaluate_sentences(rows, ipa_level="broad", boundary_mode="phrase")

    assert calls == [("가 나", "broad", "phrase")]
    assert report["punctuation_stripped_sentences"] == 1
    assert report["granularity"] == "sentence"
    assert report["boundary_mode"] == "phrase"
    assert report["scored_sentences"] == 1
    assert report["exact_match_rate"] == 1.0
    assert report["coverage_adjusted_exact_match_rate"] == 1.0


def test_sentence_benchmark_rejects_unknown_boundary_mode():
    from scripts.benchmark_ugtphon_ko import evaluate_sentences

    try:
        evaluate_sentences([], boundary_mode="guess")
    except ValueError as exc:
        assert "boundary_mode" in str(exc)
    else:
        raise AssertionError("unknown sentence boundary modes must be rejected")


def test_evaluate_rejects_unknown_ipa_profile():
    from scripts.benchmark_ugtphon_ko import evaluate

    try:
        evaluate([], ipa_level="experimental")
    except ValueError as exc:
        assert "ipa_level" in str(exc)
    else:
        raise AssertionError("unknown IPA profiles must be rejected")
