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
from korean_ukrainian.ipa_target_renderer import render_ipa_sequence_to_ukrainian
from korean_ukrainian import g2pk_engine
from audit_holdout_manifest_recovery import audit as audit_manifest

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "data" / "korean" / "benchmarks" / "target-renderer-holdout-24.csv"


def _native_record(form: str, fixture_row: dict[str, str]) -> dict[str, Any]:
    result = transliterate_korean(form)
    phonetics = result.get("phonetics") or {}
    ipa = result.get("ipa") or {}
    target = result.get("target_analysis") or {}
    inventory = result.get("target_inventory_diagnostic") or {}
    trace = target.get("segments", []) if isinstance(target, dict) else []
    ipa_variants = []
    for variant in ipa.get("variants", []):
        variant_ipa = variant.get("ipa", "")
        rendered_variant = render_ipa_sequence_to_ukrainian(variant_ipa)
        ipa_variants.append({
            "ipa": variant_ipa,
            "note": variant.get("note"),
            "vowels": variant.get("vowels", []),
            "target_status": rendered_variant.get("status"),
            "ukrainian_orthography": rendered_variant.get("ukrainian_orthography"),
            "candidate_orthography": rendered_variant.get("candidate_orthography"),
            "candidate_status": rendered_variant.get("candidate_status"),
            "reason": rendered_variant.get("reason"),
            "unmapped_fragment": rendered_variant.get("unmapped_fragment"),
            "mapping_ids": [item.get("mapping_id") for item in rendered_variant.get("segments", []) if item.get("mapping_id")],
            "mapping_trace": rendered_variant.get("segments", []),
        })
    return {
        "pronunciation_status": phonetics.get("pronunciation_status"),
        "ipa_status": result.get("ipa_status"),
        "ipa_is_diagnostic_only": result.get("ipa_is_diagnostic_only"),
        "ipa_status_reason": result.get("ipa_status_reason"),
        "ipa": ipa.get("ipa"),
        "ipa_variants_with_target_rendering": ipa_variants,
        "target_status": result.get("target_status"),
        "target_unavailable_reason": result.get("target_unavailable_reason"),
        "target_unavailable_segments": result.get("target_unavailable_segments", []),
        "target_unmapped_fragment": target.get("unmapped_fragment"),
        "target_unmapped_offset": target.get("unmapped_offset"),
        "ukrainian_orthography": result.get("ukrainian_orthography"),
        "candidate_orthography": result.get("candidate_orthography"),
        "candidate_status": result.get("candidate_status"),
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
        "candidate_orthography": result.get("candidate_orthography"),
        "candidate_status": result.get("candidate_status"),
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

    manifest_audit = audit_manifest()
    if manifest_audit["status"] != "PASS":
        raise SystemExit("refusing to run: recovered original manifest integrity check failed")
    raw_fixture = FIXTURE.read_bytes()
    with FIXTURE.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 24 or len({row["form"] for row in rows}) != 24:
        raise SystemExit("holdout fixture must contain exactly 24 unique forms")
    if any(row.get("source_manifest_status") != "original_manifest_blob_recovered" for row in rows):
        raise SystemExit("refusing to run: fixture must match the recovered original manifest")
    if any(row.get("ipa_gold_status") != "not_available" or row.get("ukrainian_gold_status") != "not_available" for row in rows):
        raise SystemExit("refusing to run: candidate fixture must not claim independent gold labels")

    report_rows = []
    for row in rows:
        form = row["form"]
        report_rows.append({
            "holdout_id": row["holdout_id"],
            "original_case_id": row["original_case_id"],
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
        "original_manifest_blob_sha1": manifest_audit["original_blob_sha1"],
        "original_manifest_sha256": manifest_audit["sha256"],
        "manifest_membership_and_order_verified": manifest_audit["same_membership_and_order"],
        "original_manifest_historical_ref_status": "UNRESOLVED_BLOB_HAS_NO_RECOVERED_COMMIT_OR_TREE_REFERENCE",
        "input_count": len(report_rows),
        "ipa_gold_labels_available": False,
        "ukrainian_gold_labels_available": False,
        "accepted_native_outputs": sum(row["native"]["ukrainian_orthography"] is not None for row in report_rows),
        "native_candidate_outputs": sum(row["native"].get("candidate_orthography") is not None for row in report_rows),
        "accepted_g2pk_outputs": sum(row["g2pk"].get("ukrainian_orthography") is not None for row in report_rows),
        "g2pk_candidate_outputs": sum(row["g2pk"].get("candidate_orthography") is not None for row in report_rows),
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
            f"accepted native outputs={report['accepted_native_outputs']}; "
            f"native candidates={report['native_candidate_outputs']}; "
            f"accepted g2pK outputs={report['accepted_g2pk_outputs']}; "
            f"g2pK candidates={report['g2pk_candidate_outputs']}; gold labels=0"
        )
    else:
        print(rendered)


if __name__ == "__main__":
    main()
