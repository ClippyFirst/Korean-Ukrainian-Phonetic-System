#!/usr/bin/env python3
"""Seed-consensus triage only; preserves raw IPA and never scores cross-convention output."""
import argparse, json
from collections import Counter
from pathlib import Path

SEEDS = (20261026, 20261027, 20261028)

def load(path):
    rows, seen = [], set()
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip(): continue
        row = json.loads(line)
        cid = row.get("case_id")
        if not isinstance(cid, str) or not cid or cid in seen: raise ValueError(f"{path}:{n}: missing/duplicate case_id")
        if row.get("split") != "dev" or "test" in cid.lower() or "holdout" in cid.lower():
            raise ValueError(f"{path}:{n}: dev-only input required")
        seen.add(cid); rows.append(row)
    if not rows: raise ValueError(f"{path}: empty")
    return {r["case_id"]: r for r in rows}

def analyze(root):
    preds, pairs = {}, {}
    for seed in SEEDS:
        folder = root / f"seed-{seed}"
        preds[seed] = load(folder / "dev-predictions.jsonl")
        pairs[seed] = load(folder / "dev-teacher-strict-pairs.jsonl")
        if len(preds[seed]) != 1000 or len(pairs[seed]) != 994:
            raise ValueError(f"seed {seed}: expected 1000 predictions and 994 Strict pairs")
    ids = set(preds[SEEDS[0]])
    if any(set(preds[s]) != ids for s in SEEDS): raise ValueError("prediction ID sets differ")
    paired = set.intersection(*(set(pairs[s]) for s in SEEDS))
    if len(paired) != 994: raise ValueError("Strict pair ID sets differ")
    counts, compact_equal = Counter(), Counter()
    records = []
    for cid in sorted(ids):
        rs = [preds[s][cid] for s in SEEDS]
        src, ref = rs[0].get("source_text"), rs[0].get("reference_target_tokens")
        if not isinstance(src, str) or not isinstance(ref, list): raise ValueError(f"{cid}: invalid source/reference")
        if any(r.get("source_text") != src or r.get("reference_target_tokens") != ref for r in rs):
            raise ValueError(f"{cid}: source/reference mismatch across seeds")
        ok = [r.get("predicted_target_tokens") == ref for r in rs]
        cat = "all_three_match_reference" if all(ok) else "none_match_reference" if not any(ok) else "mixed_seed_correctness"
        counts[cat] += 1
        strict = None
        if cid in paired:
            prs = [pairs[s][cid] for s in SEEDS]
            if any(p.get("source_text") != src for p in prs) or len({p.get("strict_ipa_raw") for p in prs}) != 1:
                raise ValueError(f"{cid}: Strict pair mismatch across seeds")
            strict = prs[0].get("strict_ipa_raw")
            if "".join(ref).replace(" ", "").replace(".", "") == (strict or "").replace(" ", "").replace(".", ""):
                compact_equal[cat] += 1
        records.append({
            "case_id": cid, "split": "dev", "source_text": src,
            "teacher_reference_tokens": ref,
            "teacher_predictions_by_seed": {str(s): preds[s][cid]["predicted_target_tokens"] for s in SEEDS},
            "teacher_seed_correctness": {str(s): ok[i] for i, s in enumerate(SEEDS)},
            "teacher_consensus_category": cat, "strict_ipa_raw": strict,
            "strict_comparison_status": "RAW_TRIAGE_ONLY_NO_REVIEWED_ADAPTER" if strict is not None else "STRICT_UNRESOLVED_OR_DIAGNOSTIC_ONLY",
            "raw_compact_string_equal_after_separator_removal": (
                "".join(ref).replace(" ", "").replace(".", "") == (strict or "").replace(" ", "").replace(".", "")
                if strict is not None else None),
        })
    return {
        "schema_version": "1.0", "purpose": "dev seed-consensus triage; not a cross-IPA accuracy score",
        "split": "dev", "seeds": list(SEEDS), "test_partition_used": False,
        "case_count": len(records), "strict_paired_case_count": len(paired),
        "strict_unresolved_or_diagnostic_only_count": len(ids - paired),
        "teacher_consensus_counts": dict(sorted(counts.items())),
        "raw_compact_string_equal_after_separator_removal_by_category": dict(sorted(compact_equal.items())),
        "interpretation_limits": [
            "Teacher correctness is exact match to SIGMORPHON dev target, not independently adjudicated pronunciation.",
            "Dev was used for checkpoint selection; seed agreement is not ground truth.",
            "Removing separators does not reconcile IPA conventions; equality is descriptive only.",
            "No production rule is inferred or changed."
        ], "records": records
    }

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--portfolio-dir", type=Path, required=True)
    ap.add_argument("--output-json", type=Path, required=True)
    args = ap.parse_args()
    try: result = analyze(args.portfolio_dir)
    except (OSError, ValueError, json.JSONDecodeError) as exc: ap.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k:v for k,v in result.items() if k != "records"}, ensure_ascii=False, indent=2))
    return 0

if __name__ == "__main__": raise SystemExit(main())
