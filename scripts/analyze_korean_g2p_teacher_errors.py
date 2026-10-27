#!/usr/bin/env python3
"""Analyze scratch-teacher dev errors without converting them into production rules."""
from __future__ import annotations

import argparse
import json
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

from train_korean_g2p_teacher import edit_distance, score_predictions


def source_shape(source: str) -> tuple[int, str]:
    hangul = [char for char in source if "\uac00" <= char <= "\ud7a3"]
    if not hangul:
        return 0, "non_hangul_or_jamo"
    last_index = ord(hangul[-1]) - 0xAC00
    has_coda = last_index % 28 != 0
    return len(hangul), "has_coda" if has_coda else "no_coda"


def strip_length_marks(tokens: list[str]) -> list[str]:
    return [token.replace("ː", "").replace("ˑ", "") for token in tokens]


def load_predictions(path: Path) -> list[dict]:
    rows = []
    seen: set[str] = set()
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{line_number}: invalid JSONL") from exc
        if not isinstance(row, dict) or row.get("split") != "dev":
            raise ValueError(f"{path}:{line_number}: only dev predictions are accepted")
        case_id = row.get("case_id")
        source = row.get("source_text")
        reference = row.get("reference_target_tokens")
        prediction = row.get("predicted_target_tokens")
        if not isinstance(case_id, str) or not case_id or case_id in seen:
            raise ValueError(f"{path}:{line_number}: missing or duplicate case_id")
        if not isinstance(source, str) or not source.strip():
            raise ValueError(f"{path}:{line_number}: missing source text")
        if not isinstance(reference, list) or not all(isinstance(token, str) for token in reference):
            raise ValueError(f"{path}:{line_number}: invalid reference token sequence")
        if not isinstance(prediction, list) or not all(isinstance(token, str) for token in prediction):
            raise ValueError(f"{path}:{line_number}: invalid predicted token sequence")
        seen.add(case_id)
        row["source_text"] = unicodedata.normalize("NFC", source)
        rows.append(row)
    if not rows:
        raise ValueError(f"{path}: no dev predictions")
    return rows


def analyze(rows: list[dict], *, sample_limit: int = 50) -> dict:
    references = [row["reference_target_tokens"] for row in rows]
    predictions = [row["predicted_target_tokens"] for row in rows]
    metrics = score_predictions(references, predictions)
    mismatch_categories: Counter[str] = Counter()
    length_direction: Counter[str] = Counter()
    groups: dict[str, list[bool]] = defaultdict(list)
    samples = []
    reference_length_mark_tokens = 0
    predicted_length_mark_tokens = 0
    for row, reference, prediction in zip(rows, references, predictions):
        exact = reference == prediction
        syllables, coda = source_shape(row["source_text"])
        groups[f"hangul_chars_{syllables}|{coda}"].append(exact)
        reference_length_mark_tokens += sum("ː" in token or "ˑ" in token for token in reference)
        predicted_length_mark_tokens += sum("ː" in token or "ˑ" in token for token in prediction)
        if exact:
            mismatch_categories["exact_match"] += 1
            continue
        if strip_length_marks(reference) == strip_length_marks(prediction):
            mismatch_categories["length_mark_only"] += 1
            ref_count = sum(token.count("ː") + token.count("ˑ") for token in reference)
            pred_count = sum(token.count("ː") + token.count("ˑ") for token in prediction)
            if pred_count < ref_count:
                length_direction["underpredict_length_marks"] += 1
            elif pred_count > ref_count:
                length_direction["overpredict_length_marks"] += 1
            else:
                length_direction["same_count_different_location"] += 1
            category = "length_mark_only"
        else:
            mismatch_categories["other_token_or_feature_difference"] += 1
            category = "other_token_or_feature_difference"
        if len(samples) < sample_limit:
            samples.append({
                "case_id": row["case_id"],
                "source_text": row["source_text"],
                "reference_target_tokens": reference,
                "predicted_target_tokens": prediction,
                "error_category": category,
                "token_edit_distance": edit_distance(reference, prediction),
            })
    group_metrics = {
        key: {
            "example_count": len(values),
            "exact_matches": sum(values),
            "exact_match_rate": sum(values) / len(values),
        }
        for key, values in sorted(groups.items())
    }
    return {
        "schema_version": "1.0",
        "purpose": "dev-only diagnostic; not a production-rule generator",
        "model_role": "scratch research teacher",
        "metrics": metrics,
        "mismatch_categories": dict(sorted(mismatch_categories.items())),
        "length_mark_direction": dict(sorted(length_direction.items())),
        "reference_length_mark_token_count": reference_length_mark_tokens,
        "predicted_length_mark_token_count": predicted_length_mark_tokens,
        "exact_match_rate_by_source_shape": group_metrics,
        "sampled_dev_errors": samples,
        "interpretation_limits": [
            "target is SIGMORPHON tokenized roughly-phonemic IPA",
            "length-only is a diagnostic comparison, not permission to remove length marks",
            "source-shape groups are descriptive associations, not causal phonological rules",
            "no test data is accepted or analyzed",
        ],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--predictions-jsonl", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--sample-limit", type=int, default=50)
    args = parser.parse_args(argv)
    if args.sample_limit < 0:
        parser.error("sample-limit must be non-negative")
    try:
        report = analyze(load_predictions(args.predictions_jsonl), sample_limit=args.sample_limit)
    except (OSError, ValueError) as exc:
        parser.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "metrics": report["metrics"],
        "mismatch_categories": report["mismatch_categories"],
        "length_mark_direction": report["length_mark_direction"],
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
