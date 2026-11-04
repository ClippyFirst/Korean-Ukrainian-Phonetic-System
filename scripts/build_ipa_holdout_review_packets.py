#!/usr/bin/env python3
"""Build separate, engine-output-free IPA annotation sheets from the frozen 24-item holdout."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path
from typing import Any

FIELDS = [
    "case_id",
    "korean_input",
    "source_rule",
    "official_hangul_surface_reading",
    "source_locator",
    "ipa_primary",
    "ipa_alternatives",
    "ipa_convention_or_profile",
    "variety_scope",
    "confidence",
    "uncertainty_or_variation",
    "reviewer_notes",
    "reviewer_id",
    "reviewed_at",
]


def build_packets(manifest_path: Path, output_dir: Path) -> dict[str, Any]:
    raw = manifest_path.read_bytes()
    manifest = json.loads(raw.decode("utf-8"))
    cases = manifest.get("cases")
    if manifest.get("caseCount") != 24 or not isinstance(cases, list) or len(cases) != 24:
        raise ValueError("the frozen holdout must contain exactly 24 cases")
    if manifest.get("split") != "HOLDOUT" or manifest.get("status") != "FROZEN_INPUT_OVERLAP_CHECKED_IPA_ANNOTATION_PENDING":
        raise ValueError("manifest is not the frozen IPA-annotation-pending holdout")
    ids = [str(case.get("caseId", "")) for case in cases]
    if len(set(ids)) != 24 or any(not value for value in ids):
        raise ValueError("holdout case IDs must be 24 unique non-empty values")
    for case in cases:
        if case.get("ipaGold") is not None or case.get("engineOutputsStored") is not False:
            raise ValueError(f"{case.get('caseId')}: holdout already contains gold or engine outputs")
        if case.get("tuningUseProhibited") is not True:
            raise ValueError(f"{case.get('caseId')}: tuning prohibition is missing")
        if any((case.get(key) or {}).get("ipa") for key in ("reviewerA", "reviewerB", "adjudicator")):
            raise ValueError(f"{case.get('caseId')}: refusing to overwrite an existing annotation")

    output_dir.mkdir(parents=True, exist_ok=True)
    packet_entries = []
    for reviewer in ("A", "B"):
        filename = f"reviewer-{reviewer.lower()}.csv"
        path = output_dir / filename
        with path.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=FIELDS, quoting=csv.QUOTE_ALL, lineterminator="\n")
            writer.writeheader()
            for case in cases:
                writer.writerow({
                    "case_id": case["caseId"],
                    "korean_input": case["input"],
                    "source_rule": case["sourceRule"],
                    "official_hangul_surface_reading": " | ".join(case.get("allowedSurfaceReadings", [])),
                    "source_locator": case["sourceLocator"],
                    "ipa_primary": "",
                    "ipa_alternatives": "",
                    "ipa_convention_or_profile": "",
                    "variety_scope": "",
                    "confidence": "",
                    "uncertainty_or_variation": "",
                    "reviewer_notes": "",
                    "reviewer_id": "",
                    "reviewed_at": "",
                })
        packet_entries.append({
            "reviewer": reviewer,
            "file": filename,
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "case_count": 24,
        })

    packet_manifest = {
        "schema_version": 1,
        "source_manifest": str(manifest_path),
        "source_manifest_sha256": hashlib.sha256(raw).hexdigest(),
        "holdout_case_ids": ids,
        "case_count": 24,
        "annotation_status": "PENDING_TWO_INDEPENDENT_REVIEWERS",
        "engine_outputs_included": False,
        "ipa_gold_included": False,
        "tuning_use_prohibited": True,
        "reviewer_packets": packet_entries,
    }
    (output_dir / "packet-manifest.json").write_text(
        json.dumps(packet_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return packet_manifest


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--manifest",
        type=Path,
        default=Path("data/korean/benchmarks/ipa-holdout-24-manifest.json"),
    )
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    try:
        result = build_packets(args.manifest, args.output_dir)
    except Exception as exc:
        parser.error(f"cannot build independent IPA review packets: {type(exc).__name__}: {exc}")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
