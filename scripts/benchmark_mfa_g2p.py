#!/usr/bin/env python3
"""Run pinned Montreal Forced Aligner Korean G2P models as comparison-only baselines.

The model emits MFA's Korean IPA phone set. This adapter is intentionally
identity-only: every phone must be in the published v2 Korean inventory. No
Kozak Kim phonological rules or Ukrainian rendering are applied.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import subprocess
import tempfile
import time
import unicodedata
from pathlib import Path
from typing import Any

from benchmark_multi_engine_ko import _load_rows_and_words, _score
from benchmark_ugtphon_ko import normalize_ipa

MFA_KOREAN_V2_PHONES = frozenset("""
b d dʑ e eː h i iː j k kʰ k̚ k͈ m n o oː p pʰ p̚ p͈
s sʰ s͈ t tɕ tɕʰ tɕ͈ tʰ t̚ t͈ u uː w x ç ŋ ɐ ɕʰ ɕ͈
ɡ ɣ ɥ ɦ ɨ ɨː ɭ ɰ ɲ ɸ ɾ ʌ ʌː ʎ ʝ β
""".split())

MODEL_METADATA = {
    "hangul": {
        "model_name": "korean_mfa",
        "model_version": "2.0.0",
        "release_tag": "g2p-korean_mfa-v2.0.0",
        "asset": "korean_mfa.zip",
        "sha256": "b7b19314b141e20b9714bed8d6eb80d3c291ae3f4d282ffdb643468fedce18d8",
        "license": "CC BY 4.0 (upstream model declaration; archive checked at runtime)",
        "training_words": 48665,
        "reported_heldout_words": 5407,
        "reported_wer": 0.1025,
        "reported_per": 0.0226,
        "graphemes": 2059,
    },
    "jamo": {
        "model_name": "korean_jamo_mfa",
        "model_version": "2.0.0",
        "release_tag": "g2p-korean_jamo_mfa-v2.0.0",
        "asset": "korean_jamo_mfa.zip",
        "sha256": "8068b669bf39fa11b9e606e8961d434c7811e9437e71eb1840f841ed4cb63398",
        "license": "CC BY 4.0 (upstream model declaration; archive checked at runtime)",
        "training_words": 48682,
        "reported_heldout_words": 5409,
        "reported_wer": 0.0390,
        "reported_per": 0.0064,
        "graphemes": 55,
    },
}


def prepare_model_input(word: str, model_kind: str) -> str:
    """Normalize Hangul input and apply the documented Jamo orthography adapter."""
    if not isinstance(word, str) or not word:
        raise ValueError("input word must be a non-empty string")
    normalized = unicodedata.normalize("NFC", word)
    if any(not ("\uac00" <= char <= "\ud7a3") for char in normalized):
        raise ValueError(f"benchmark token is not precomposed Hangul: {word!r}")
    if model_kind == "hangul":
        return normalized
    if model_kind != "jamo":
        raise ValueError(f"unsupported MFA model kind: {model_kind!r}")
    try:
        from jamo import hangul_to_hcj
    except ImportError as exc:
        raise RuntimeError("the pinned 'jamo' package is required for the Jamo MFA model") from exc
    decomposed = "".join(hangul_to_hcj(normalized))
    if not decomposed or any(not ("\u3130" <= char <= "\u318f") for char in decomposed):
        raise ValueError(f"Hangul-to-compatibility-Jamo adapter produced unexpected output: {decomposed!r}")
    return decomposed


def _is_probability(value: str) -> bool:
    try:
        number = float(value)
    except ValueError:
        return False
    return math.isfinite(number) and 0.0 <= number <= 1.0


def parse_mfa_dictionary_output(
    text: str,
    expected_words: set[str],
    phone_inventory: frozenset[str] = MFA_KOREAN_V2_PHONES,
) -> dict[str, dict[str, str]]:
    """Parse MFA dictionary rows and fail closed on unknown phone symbols."""
    predictions: dict[str, dict[str, str]] = {}
    for line_number, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        fields = line.split()
        if len(fields) < 2:
            raise ValueError(f"line {line_number}: expected word and at least one phone")
        word, phones = fields[0], fields[1:]
        if word not in expected_words:
            raise ValueError(f"line {line_number}: unexpected output word {word!r}")
        if word in predictions:
            raise ValueError(f"line {line_number}: duplicate pronunciation row for {word!r}")
        # MFA dictionaries may optionally include a pronunciation probability.
        if phones and _is_probability(phones[0]):
            phones = phones[1:]
        if not phones:
            raise ValueError(f"line {line_number}: empty phone sequence for {word!r}")
        unknown = sorted(set(phones) - phone_inventory)
        if unknown:
            raise ValueError(f"line {line_number}: unmapped MFA phone(s) for {word!r}: {unknown}")
        ipa = normalize_ipa("".join(phones))
        if not ipa:
            raise ValueError(f"line {line_number}: normalized IPA is empty for {word!r}")
        predictions[word] = {"ipa": ipa, "mfa_phones": phones}
    return predictions


def run_mfa_g2p(
    words: list[str],
    model_path: Path,
    model_kind: str,
    *,
    mfa_command: str = "mfa",
    timeout_seconds: int = 900,
) -> tuple[dict[str, dict[str, str]], dict[str, Any]]:
    """Invoke the pinned MFA CLI over a deterministic unique-word input file."""
    if not model_path.is_file():
        raise FileNotFoundError(f"MFA model archive not found: {model_path}")
    prepared = [prepare_model_input(word, model_kind) for word in words]
    if len(prepared) != len(set(prepared)):
        raise ValueError("model-input normalization collapsed distinct source words")
    with tempfile.TemporaryDirectory(prefix="mfa-korean-g2p-") as temp:
        root = Path(temp)
        input_path, output_path = root / "words.txt", root / "predictions.dict"
        config_path = root / "mfa-g2p-config.yaml"
        config_path.write_text("num_pronunciations: 1\ng2p_threshold: 1.0\nstrict_graphemes: true\n", encoding="utf-8")
        input_path.write_text("\n".join(prepared) + "\n", encoding="utf-8")
        started = time.perf_counter()
        completed = subprocess.run(
            [mfa_command, "g2p", str(model_path), str(input_path), str(output_path), "--num_jobs", "3", "--config_path", str(config_path)],
            capture_output=True, text=True, check=False, timeout=timeout_seconds,
        )
        elapsed_ms = (time.perf_counter() - started) * 1000
        if completed.returncode:
            raise RuntimeError(
                f"MFA G2P exited {completed.returncode}: {completed.stderr[-4000:]}"
            )
        if not output_path.is_file():
            raise RuntimeError("MFA G2P completed without creating its dictionary output")
        raw_output = output_path.read_text(encoding="utf-8")
        parsed = parse_mfa_dictionary_output(raw_output, set(prepared))
    reverse = dict(zip(prepared, words))
    predictions = {reverse[key]: value for key, value in parsed.items()}
    return predictions, {
        "runtime_ms": round(elapsed_ms, 3),
        "unique_input_words": len(words),
        "model_input_kind": model_kind,
        "num_pronunciations": 1,
        "g2p_threshold": 1.0,
        "strict_graphemes": True,
        "num_jobs": 3,
        "model_input_normalization": "NFC Hangul" if model_kind == "hangul" else "NFC Hangul -> jamo.hangul_to_hcj (jamo==0.4.1)",
        "mfa_stdout_tail": completed.stdout[-1000:],
        "mfa_stderr_tail": completed.stderr[-1000:],
    }


def build_report(
    rows: list[dict[str, Any]],
    predictions: dict[str, dict[str, str]],
    *,
    model_kind: str,
    model_sha256: str,
    dataset_source: str,
    runtime: dict[str, Any],
) -> dict[str, Any]:
    items, words = _load_rows_and_words(rows)
    occurrences = []
    scored = []
    for item in items:
        prediction = predictions.get(item["word"])
        if not prediction:
            occurrences.append({
                "occurrence_id": item["occurrence_id"], "row_id": item["row_id"],
                "word": item["word"], "gold": item["gold"], "status": "missing",
                "ipa": None, "exact": None, "distance": None,
            })
            continue
        score = _score(prediction["ipa"], item["gold"])
        scored.append(score)
        occurrences.append({
            "occurrence_id": item["occurrence_id"], "row_id": item["row_id"],
            "word": item["word"], "gold": item["gold"], "status": "scored",
            "ipa": prediction["ipa"], "mfa_phones": prediction["mfa_phones"],
            "exact": score["exact"], "distance": score["distance"],
            "reference_length": score["reference_length"],
        })
    exact_matches = sum(bool(item["exact"]) for item in scored)
    char_errors = sum(int(item["distance"]) for item in scored)
    reference_characters = sum(int(item["reference_length"]) for item in scored)
    phoneme_errors = sum(int(item["phoneme_distance"]) for item in scored)
    reference_phonemes = sum(int(item["reference_phoneme_count"]) for item in scored)
    feature_weighted_errors = sum(float(item["feature_weighted_distance"]) for item in scored)
    feature_reference_phonemes = sum(int(item["feature_reference_phoneme_count"]) for item in scored)
    unsupported_feature_segments = sum(int(item["unsupported_feature_segments"]) for item in scored)
    metadata = MODEL_METADATA[model_kind]
    return {
        "schema_version": 1,
        "benchmark": "MFA Korean G2P external comparison",
        "engine": "Montreal Forced Aligner",
        "model": metadata,
        "model_sha256": model_sha256,
        "inference_policy": {"num_pronunciations": 1, "g2p_threshold": 1.0, "strict_graphemes": True, "num_jobs": 3},
        "dataset_source": dataset_source,
        "eligible_occurrences": len(items),
        "unique_source_forms": len(words),
        "candidate_output_occurrences": len(scored),
        "candidate_output_availability_rate": round(len(scored) / len(items), 6) if items else None,
        "source_resolved_scored_occurrences": len(scored),
        "coverage_rate": round(len(scored) / len(items), 6) if items else None,
        "exact_matches": exact_matches,
        "exact_match_rate_scored_only": round(exact_matches / len(scored), 6) if scored else None,
        "coverage_adjusted_exact_match_rate": round(exact_matches / len(items), 6) if items else None,
        "character_errors": char_errors,
        "reference_characters": reference_characters,
        "character_error_rate": round(char_errors / reference_characters, 6) if reference_characters else None,
        "phoneme_errors": phoneme_errors,
        "reference_phonemes": reference_phonemes,
        "phoneme_error_rate": round(phoneme_errors / reference_phonemes, 6) if reference_phonemes else None,
        "feature_weighted_errors": round(feature_weighted_errors, 6),
        "feature_reference_phonemes": feature_reference_phonemes,
        "feature_weighted_error_rate": round(feature_weighted_errors / feature_reference_phonemes, 6) if feature_reference_phonemes else None,
        "unsupported_feature_segments": unsupported_feature_segments,
        "engine_errors": 0,
        "missing_predictions": len(items) - len(scored),
        "runtime": runtime,
        "occurrences": occurrences,
        "interpretation": (
            "Comparison-only MFA phone-set IPA; identity adapter accepts only the documented "
            "56-symbol Korean v2 inventory. No Ukrainian rendering or Kozak Kim rules are applied. "
            "Model-card held-out metrics are publisher-reported and are not these benchmark results."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", required=True, type=Path)
    parser.add_argument("--model", required=True, type=Path)
    parser.add_argument("--model-kind", required=True, choices=sorted(MODEL_METADATA))
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--model-sha256", required=True)
    parser.add_argument("--dataset-source", required=True)
    parser.add_argument("--mfa-command", default="mfa")
    parser.add_argument("--timeout-seconds", type=int, default=900)
    args = parser.parse_args()

    rows = json.loads(args.corpus.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        raise ValueError("corpus JSON must be a list of rows")
    items, words = _load_rows_and_words(rows)
    if not items or not words:
        raise ValueError("corpus has no eligible Hangul/IPA occurrences")
    actual_sha256 = hashlib.sha256(args.model.read_bytes()).hexdigest()
    expected_sha256 = MODEL_METADATA[args.model_kind]["sha256"]
    if args.model_sha256 != actual_sha256:
        raise ValueError("supplied model SHA-256 does not match the downloaded archive")
    if actual_sha256 != expected_sha256:
        raise ValueError(f"model archive checksum drift: expected {expected_sha256}, found {actual_sha256}")
    predictions, runtime = run_mfa_g2p(
        words, args.model, args.model_kind,
        mfa_command=args.mfa_command, timeout_seconds=args.timeout_seconds,
    )
    report = build_report(
        rows, predictions, model_kind=args.model_kind,
        model_sha256=actual_sha256, dataset_source=args.dataset_source,
        runtime=runtime,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "model": report["model"]["model_name"],
        "model_sha256": args.model_sha256,
        "eligible_occurrences": report["eligible_occurrences"],
        "unique_source_forms": report["unique_source_forms"],
        "candidate_output_occurrences": report["candidate_output_occurrences"],
        "coverage_rate": report["coverage_rate"],
        "exact_match_rate_scored_only": report["exact_match_rate_scored_only"],
        "character_error_rate": report["character_error_rate"],
        "engine_errors": report["engine_errors"],
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
