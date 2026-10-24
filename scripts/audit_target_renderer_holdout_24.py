#!/usr/bin/env python3
"""Reproduce native/G2P outputs for the 24-form holdout without treating them as gold.

The optional g2pK engine is initialized explicitly because its adapter is lazy-loaded.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
from pathlib import Path
from typing import Any

from korean_ukrainian.pipeline import transliterate_korean
from korean_ukrainian import g2pk_engine

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "data" / "korean" / "benchmarks" / "target-renderer-holdout-24.csv"


def _native_record(form: str, fixture_row: dict[str, str]) -> dict[str, Any]:
    result = transliterate_korean(form)
    phonetics = result.get("phonetics") or {}
    ipa = result.get("ipa") or {}
    target = result.get("target_analysis") or {}
    inventory = result.get("target_inventory_diagnostic") or {}
    trace = target.get("segments", []) if isinstance(target, dict) else []
    return {
        "pronunciation_status": phonetics.get("pronunciation_status"),
        "ipa_status": result.get("ipa_status"),
        "ipa_is_diagnostic_only": result.get("ipa_is_diagnostic_only"),
        "ipa_status_reason": result.get("ipa_status_reason"),
        "ipa": ipa.get("ipa"),
        "target_status": result.get("target_status"),
        "target_unavailable_reason": result.get("target_unavailable_reason"),
        "target_unavailable_segments": result.get("target_unavailable_segments", []),
        "target_unmapped_fragment": target.get("unmapped_fragment"),
        "target_unmapped_offset": target.get("unmapped_offset"),
        "ukrainian_orthography": result.get("ukrainian_orthography"),
        "target_mapping_ids": [item.get("mapping_id") for item in trace if item.get("mapping_id")],
        "target_mapping_trace": trace,
        "target_inventory_status": result.get("target_inventory_status"),
        "target_inventory_diagnostic_reason": inventory.get("reason"),
        "lexical_target_reference": result.get("lexical_target_reference"),
        "lexical_target_comparison": result.get("lexical_target_comparison"),
        "ipa_gold_status": fixture_row["ipa_gold_status"],
        "ukrainian_gold_status": fixture_row["ukrainian_gold_status"],
    }


def _g2pk_record(form: str, fixture_row: dict[str, str]) -> dict[str, Any]:
    try:
        # The production adapter initializes g2pK lazily; checking _ENGINE
        # before calling _get_engine() would falsely report it as unavailable.
        g2pk_engine._get_engine()
    except RuntimeError as exc:
        return {
            "status": "blocked_engine_unavailable",
            "reason": str(exc),
            "ipa_gold_status": fixture_row["ipa_gold_status"],
            "ukrainian_gold_status": fixture_row["ukrainian_gold_status"],
        }

    result = g2pk_engine.transliterate_with_g2pk(form)
    ipa = result.get("ipa") or {}
    inventory = result.get("target_inventory_analysis") or []
    target = result.get("target_analysis") or []
    mapping_ids = [
        mapping.get("mapping_id")
        for word in target
        for mapping in word.get("mapping_trace", [])
        if mapping.get("mapping_id")
    ]
    return {
        "status": result.get("target_status"),
        "pronunciation_engine": result.get("pronunciation_engine"),
        "ipa_status": result.get("ipa_status"),
        "ipa_is_diagnostic_only": result.get("ipa_is_diagnostic_only"),
        "ipa_status_reason": result.get("ipa_status_reason"),
        "ipa": ipa.get("ipa"),
        "ukrainian_orthography": result.get("ukrainian_orthography"),
        "unavailable_reasons": result.get("unavailable_reasons", []),
        "target_mapping_ids": mapping_ids,
        "target_mapping_trace": [
            {
                "surface_hangul": word.get("surface_hangul"),
                "ipa": word.get("ipa"),
                "status": word.get("status"),
                "reason": word.get("reason"),
                "unmapped_fragment": word.get("unmapped_fragment"),
                "segments": word.get("mapping_trace", []),
            }
            for word in target
        ],
        "target_inventory_status": result.get("target_inventory_status"),
        "target_inventory_diagnostics": [
            {
                "surface_hangul": item.get("surface_hangul"),
                "reason": item.get("summary", {}).get("reason"),
                "segment_reasons": item.get("summary", {}).get("segment_reasons", []),
                "adapter_status": item.get("summary", {}).get("adapter_status"),
            }
            for item in inventory
        ],
        "ipa_gold_status": fixture_row["ipa_gold_status"],
        "ukrainian_gold_status": fixture_row["ukrainian_gold_status"],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, help="write JSON report to this path")
    args = parser.parse_args()

    raw_fixture = FIXTURE.read_bytes()
    with FIXTURE.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 24 or len({row["form"] for row in rows}) != 24:
        raise SystemExit("holdout fixture must contain exactly 24 unique forms")

    report_rows = []
    for row in rows:
        form = row["form"]
        report_rows.append({
            "holdout_id": row["holdout_id"],
            "form": form,
            "source_manifest_status": row["source_manifest_status"],
            "provenance_note": row["provenance_note"],
            "native": _native_record(form, row),
            "g2pk": _g2pk_record(form, row),
        })

    report = {
        "report": "target-renderer-holdout-24",
        "source_commit": os.environ.get("GITHUB_SHA"),
        "fixture_sha256": hashlib.sha256(raw_fixture).hexdigest(),
        "input_count": len(report_rows),
        "ipa_gold_labels_available": False,
        "ukrainian_gold_labels_available": False,
        "interpretation": (
            "Diagnostic reproduction only. Engine output and stored lexical references are not "
            "independent IPA or Ukrainian gold labels."
        ),
        "rows": report_rows,
    }
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
        print(
            f"wrote {args.output}: {len(report_rows)} forms; "
            f"native outputs={sum(row['native']['ukrainian_orthography'] is not None for row in report_rows)}; "
            f"g2pK outputs={sum(row['g2pk'].get('ukrainian_orthography') is not None for row in report_rows)}"
        )
    else:
        print(rendered)


if __name__ == "__main__":
    main()
