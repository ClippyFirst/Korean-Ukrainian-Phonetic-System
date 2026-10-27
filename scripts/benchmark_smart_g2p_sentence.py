#!/usr/bin/env python3
"""Sentence-context SMART-G2P hybrid diagnostic on UGTPHON.

SMART-G2P transliterates code-mixed sentence text into Korean orthography; g2pk
then applies Korean phonology, and this repository's adapter converts Hangul
surface output to IPA. This is a separate sentence-context diagnostic, not a
token-level neural-G2P ranking and not Ukrainian-target evaluation.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Callable

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "scripts"))

from benchmark_ugtphon_ko import load_corpus  # noqa: E402
from benchmark_multi_engine_ko import _metrics, _score  # noqa: E402

HANGUL_SYLLABLE = re.compile(r"^[\uac00-\ud7a3]+$")
PUNCTUATION = set(".,!?;:'\"()[]{}<>…“”‘’、。，！？；：（）《》【】—–·")
SMART_REPO_COMMIT = "ca74123eb714f414cd21dd3fcd809b4f110085bb"
TRANSLITERATION_COMMIT = "55539265f4ba8eb4c008cdda74b62c8571b87c52"


def _hangul_only_token(value: str) -> str:
    hangul = "".join(ch for ch in value if "\uac00" <= ch <= "\ud7a3")
    residual = "".join(
        ch for ch in value
        if not ("\uac00" <= ch <= "\ud7a3")
        and not ch.isspace()
        and ch not in PUNCTUATION
    )
    if residual:
        raise ValueError(f"non-Hangul residual characters after G2P: {residual!r}")
    if not hangul:
        raise ValueError("no Hangul syllables after punctuation stripping")
    return hangul


def _ipa_from_surface(surface: str, parse_syllables: Callable[..., Any],
                      realize_syllables: Callable[..., dict[str, Any]]) -> str:
    hangul = _hangul_only_token(surface)
    return realize_syllables(parse_syllables(hangul), level="broad")["ipa"]


def _score_engine(
    rows: list[dict[str, Any]],
    per_sentence: list[dict[str, Any]],
    engine: str,
    ipa_from_surface: Callable[[str], str],
) -> list[dict[str, Any]]:
    scored: list[dict[str, Any]] = []
    sentence_by_id = {item["sentence_id"]: item for item in per_sentence}
    for row in rows:
        sentence_id = str(row["id"])
        sentence_result = sentence_by_id[sentence_id]
        tokens = row["tokens"]
        surface_key = "smart_g2p_surface" if engine == "smart_g2p_hybrid" else "g2pk_original_surface"
        raw_surface = sentence_result.get(surface_key)
        raw_tokens = raw_surface.split() if isinstance(raw_surface, str) else []
        alignment_ok = sentence_result.get(
            "smart_alignment_status" if engine == "smart_g2p_hybrid" else "g2pk_alignment_status"
        ) == "aligned"
        for index, token in enumerate(tokens):
            gold = token.get("phoneme", "")
            canonical = token.get("canonical", "")
            occurrence_id = f"{sentence_id}::{index}"
            item: dict[str, Any] = {
                "occurrence_id": occurrence_id,
                "sentence_id": sentence_id,
                "token_index": index,
                "sentence_text": row["text"],
                "input_token": canonical,
                "gold": gold,
                "engine": engine,
                "raw_sentence_surface": raw_surface,
                "raw_surface_token": raw_tokens[index] if alignment_ok and index < len(raw_tokens) else None,
            }
            if not isinstance(gold, str) or not gold.strip():
                item.update({"status": "skipped_missing_gold", "reason": "UGTPHON token has no IPA reference"})
            elif not alignment_ok:
                item.update({
                    "status": "alignment_mismatch",
                    "reason": sentence_result.get(
                        "smart_alignment_reason" if engine == "smart_g2p_hybrid" else "g2pk_alignment_reason"
                    ) or "sentence output token count did not match UGTPHON token count",
                })
            else:
                try:
                    predicted_ipa = ipa_from_surface(raw_tokens[index])
                    item.update(_score(predicted_ipa, gold))
                    item.update({"status": "scored", "predicted_ipa": predicted_ipa})
                except Exception as exc:
                    item.update({
                        "status": "invalid_output",
                        "reason": f"{type(exc).__name__}: {exc}",
                        "predicted_ipa": None,
                    })
            scored.append(item)
    return scored


def evaluate_sentence_context(
    rows: list[dict[str, Any]],
    transliterate: Callable[[str], str],
    g2p: Callable[[str], str],
    ipa_from_surface: Callable[[str], str],
) -> dict[str, Any]:
    sentence_results: list[dict[str, Any]] = []
    for row in rows:
        sentence_id = str(row["id"])
        text = row["text"]
        expected_tokens = len(row["tokens"])
        result: dict[str, Any] = {
            "sentence_id": sentence_id,
            "text": text,
            "expected_token_count": expected_tokens,
            "transliterated_sentence": None,
            "smart_g2p_surface": None,
            "g2pk_original_surface": None,
            "smart_output_token_count": 0,
            "g2pk_output_token_count": 0,
            "smart_alignment_status": "error",
            "g2pk_alignment_status": "error",
        }
        try:
            transliterated = transliterate(text)
            smart_surface = g2p(transliterated)
            result["transliterated_sentence"] = transliterated
            result["smart_g2p_surface"] = smart_surface
            smart_tokens = smart_surface.split()
            result["smart_output_token_count"] = len(smart_tokens)
            if len(smart_tokens) == expected_tokens:
                result["smart_alignment_status"] = "aligned"
            else:
                result["smart_alignment_status"] = "alignment_mismatch"
                result["smart_alignment_reason"] = (
                    f"expected {expected_tokens} whitespace tokens, got {len(smart_tokens)}"
                )
        except Exception as exc:
            result["smart_alignment_status"] = "error"
            result["smart_alignment_reason"] = f"{type(exc).__name__}: {exc}"

        try:
            baseline_surface = g2p(text)
            result["g2pk_original_surface"] = baseline_surface
            baseline_tokens = baseline_surface.split()
            result["g2pk_output_token_count"] = len(baseline_tokens)
            if len(baseline_tokens) == expected_tokens:
                result["g2pk_alignment_status"] = "aligned"
            else:
                result["g2pk_alignment_status"] = "alignment_mismatch"
                result["g2pk_alignment_reason"] = (
                    f"expected {expected_tokens} whitespace tokens, got {len(baseline_tokens)}"
                )
        except Exception as exc:
            result["g2pk_alignment_status"] = "error"
            result["g2pk_alignment_reason"] = f"{type(exc).__name__}: {exc}"
        sentence_results.append(result)

    smart_cases = _score_engine(rows, sentence_results, "smart_g2p_hybrid", ipa_from_surface)
    baseline_cases = _score_engine(rows, sentence_results, "g2pk_original_sentence", ipa_from_surface)

    def engine_summary(cases: list[dict[str, Any]]) -> dict[str, Any]:
        eligible = sum(1 for row in rows for token in row["tokens"] if isinstance(token.get("phoneme"), str) and token["phoneme"].strip())
        comparable = [case for case in cases if case["status"] == "scored"]
        metrics = _metrics(comparable)
        alignment_errors = sum(
            1 for row in sentence_results
            if row.get("smart_alignment_status" if cases is smart_cases else "g2pk_alignment_status") != "aligned"
        )
        return {
            **metrics,
            "eligible_token_occurrences": eligible,
            "coverage": round(len(comparable) / eligible, 6) if eligible else None,
            "aligned_sentence_count": sum(
                1 for row in sentence_results
                if row.get("smart_alignment_status" if cases is smart_cases else "g2pk_alignment_status") == "aligned"
            ),
            "alignment_or_inference_failure_sentences": alignment_errors,
            "status_counts": {
                status: sum(1 for case in cases if case["status"] == status)
                for status in sorted({case["status"] for case in cases})
            },
        }

    smart_by_id = {case["occurrence_id"]: case for case in smart_cases if case["status"] == "scored"}
    baseline_by_id = {case["occurrence_id"]: case for case in baseline_cases if case["status"] == "scored"}
    common_ids = sorted(set(smart_by_id) & set(baseline_by_id))
    smart_common = [smart_by_id[key] for key in common_ids]
    baseline_common = [baseline_by_id[key] for key in common_ids]
    smart_common_metrics = _metrics(smart_common)
    baseline_common_metrics = _metrics(baseline_common)
    smart_wins = sum(1 for left, right in zip(smart_common, baseline_common) if left["exact"] and not right["exact"])
    baseline_wins = sum(1 for left, right in zip(smart_common, baseline_common) if right["exact"] and not left["exact"])

    return {
        "schema_version": 1,
        "benchmark": "UGTPHON Korean test split — sentence-context hybrid diagnostic",
        "contract": "full original sentence is passed to SMART-G2P before token alignment; per-token scoring is performed only when output whitespace-token count equals the gold token count",
        "rows": len(rows),
        "engines": {
            "smart_g2p_hybrid": engine_summary(smart_cases),
            "g2pk_original_sentence": engine_summary(baseline_cases),
        },
        "paired_on_common_scored_tokens": {
            "common_occurrences": len(common_ids),
            "smart_g2p_hybrid_metrics": smart_common_metrics,
            "g2pk_original_sentence_metrics": baseline_common_metrics,
            "exact_match_delta_smart_minus_g2pk": (
                round(smart_common_metrics["exact_match_rate"] - baseline_common_metrics["exact_match_rate"], 6)
                if smart_common_metrics.get("exact_match_rate") is not None and baseline_common_metrics.get("exact_match_rate") is not None else None
            ),
            "cer_delta_smart_minus_g2pk": (
                round(smart_common_metrics["character_error_rate"] - baseline_common_metrics["character_error_rate"], 6)
                if smart_common_metrics.get("character_error_rate") is not None and baseline_common_metrics.get("character_error_rate") is not None else None
            ),
            "smart_only_exact": smart_wins,
            "g2pk_only_exact": baseline_wins,
        },
        "sentence_results": sentence_results,
        "per_token": {"smart_g2p_hybrid": smart_cases, "g2pk_original_sentence": baseline_cases},
        "limitations": [
            "SMART-G2P is a code-mixed transliteration plus g2pk hybrid, not a direct IPA neural G2P model.",
            "Sentence-context inference is preserved; per-token scores are only emitted after strict whitespace-token alignment.",
            "The reference is the concatenation of UGTPHON token IPA annotations, not independently adjudicated phrase-level IPA gold.",
            "The separate weights license for transliteration.pt is not stated; weights are not redistributed.",
            "The external code requires a local CPU-compatibility patch; the exact patch is recorded in provenance.",
        ],
    }


def apply_cpu_compat_patch(smart_dir: Path) -> list[str]:
    patches: list[str] = []
    infer_path = smart_dir / "infer.py"
    infer = infer_path.read_text(encoding="utf-8")
    replacements = [
        ('os.environ["CUDA_VISIBLE_DEVICES"]=\'1\'', '# CPU-compatible research patch: do not force a CUDA device'),
        ('model.load_state_dict(torch.load("transliteration.pt"))', 'model.load_state_dict(torch.load("transliteration.pt", map_location=device))\nmodel.eval()'),
        ('torch.tensor(g2seq(text)).unsqueeze(1).cuda()', 'torch.tensor(g2seq(text)).unsqueeze(1).to(device)'),
    ]
    for old, new in replacements:
        if old in infer:
            infer = infer.replace(old, new)
            patches.append(f"infer.py: {old} -> {new}")
    if "torch.tensor(g2seq(text)).unsqueeze(1).to(device)" not in infer:
        raise RuntimeError("could not apply CPU device patch to SMART-G2P infer.py")
    infer_path.write_text(infer, encoding="utf-8")

    trans_path = smart_dir / "trans.py"
    trans = trans_path.read_text(encoding="utf-8")
    old = "import mecab\nmecab = mecab.MeCab()"
    new = "import mecab_ko as mecab\nmecab = mecab.MeCab()"
    if old in trans:
        trans = trans.replace(old, new)
        patches.append("trans.py: import mecab -> import mecab_ko as mecab")
    else:
        raise RuntimeError("could not apply python-mecab-ko import patch to SMART-G2P trans.py")
    trans_path.write_text(trans, encoding="utf-8")
    return patches


def load_smart_g2p(smart_dir: Path) -> tuple[Callable[[str], str], Callable[[str], str]]:
    apply_cpu_compat_patch(smart_dir)
    original_cwd = Path.cwd()
    sys.path.insert(0, str(smart_dir))
    try:
        os.chdir(smart_dir)
        import trans as smart_trans  # type: ignore[import-not-found]
        return smart_trans.sentranslit, smart_trans.g2p
    finally:
        os.chdir(original_cwd)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus", required=True, type=Path)
    parser.add_argument("--smart-g2p-dir", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--provenance-output", required=True, type=Path)
    args = parser.parse_args()

    rows = load_corpus(args.corpus)
    smart_dir = args.smart_g2p_dir.resolve()
    transliterate, g2p = load_smart_g2p(smart_dir)

    def ipa_adapter(surface: str) -> str:
        from korean_ukrainian.phonology import parse_syllables
        from korean_ukrainian.ipa import realize_syllables
        return _ipa_from_surface(surface, parse_syllables, realize_syllables)

    report = evaluate_sentence_context(rows, transliterate, g2p, ipa_adapter)
    weight_path = smart_dir / "transliteration.pt"
    payload = {
        "schema_version": 1,
        "smart_g2p": {
            "repository": "https://github.com/SMART-TTS/SMART-G2P",
            "commit": SMART_REPO_COMMIT,
            "code_license": "GPL-3.0 (repository LICENSE)",
            "weights_path": "transliteration.pt",
            "weights_size_bytes": weight_path.stat().st_size,
            "weights_sha256": sha256(weight_path),
            "weights_license_status": "UNRESOLVED: no separate model-weight license statement found; repository-level GPL-3.0 does not independently settle training-data/weight provenance",
        },
        "transliteration_data": {
            "repository": "https://github.com/muik/transliteration",
            "commit": TRANSLITERATION_COMMIT,
            "repository_license": "Apache-2.0",
            "training_data_license_status": "PARTIAL: repository license is Apache-2.0, but per-source dictionary provenance was not independently audited",
        },
        "runtime": {
            "python": sys.version.split()[0],
            "torch": __import__("torch").__version__,
            "g2pk": "0.9.4 (workflow pin)",
            "runtime_patches": [
                "map transliteration.pt to CPU",
                "replace hard-coded CUDA tensor placement with .to(device)",
                "disable model training mode",
                "use python-mecab-ko module alias mecab_ko",
            ],
        },
        "evaluation": {
            "dataset": "naver-ai/UGTPHON",
            "commit": "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54",
            "file": "ko/test.json",
            "license": "Apache-2.0",
            "rows": len(rows),
            "task": "sentence-context inference, strict token alignment, project IPA adapter",
        },
        "artifact_policy": "raw transliterations, IPA predictions, metrics, and provenance only; no upstream source tree or weights are uploaded",
    }
    report["provenance"] = payload
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.provenance_output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.provenance_output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "provenance_output": str(args.provenance_output),
        "rows": report["rows"],
        "engines": report["engines"],
        "paired": report["paired_on_common_scored_tokens"],
    }, ensure_ascii=False, indent=2))
    if report["engines"]["smart_g2p_hybrid"]["scored_tokens"] == 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
