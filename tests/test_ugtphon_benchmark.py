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
