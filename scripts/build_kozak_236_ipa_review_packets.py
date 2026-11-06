#!/usr/bin/env python3
"""Build system-blind IPA review packets for the reconstructed 236-case cohort.

Reviewer packets contain raw Korean context but no source IPA, reference IPA, engine output,
candidate signature, cluster label, or occurrence/source-row identifiers. Source identity is
not guaranteed to be blind because raw user-generated sentences can be searchable.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV = ROOT / "research/kozak-kim-236-candidate-review-2026-11-05.csv"
EXPECTED_CASES = 236
EXPECTED_SOURCE_COMMIT = "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
APACHE_LICENSE_PATH = ROOT / "licenses/Apache-2.0.txt"
SOURCE_NOTICE_PATH = ROOT / "licenses/UGTPHON-KO-SOURCE-NOTICE.md"

REVIEW_INSTRUCTIONS = [
    "Work independently. Do not consult engine outputs, Broad-v2/IPA-Dict references, candidate signatures, cluster labels, or another reviewer's packet.",
    "The packet contains the canonical input token and the raw source token in sentence context. If they differ, transcribe the raw source form and canonical input separately; do not assume normalization preserves pronunciation.",
    "Provide broad IPA for each form under a declared Korean pronunciation convention. Add narrow IPA only when you can state the phonetic detail and evidence.",
    "Record syllable boundaries and vowel length only when supported. Preserve uncertainty and use NEEDS_CONTEXT or UNRESOLVED rather than guessing.",
    "Classify differences as phonemic, predictable allophony, lexical/morphological, source normalization, transcription convention, or unresolved.",
    "Do not generalize a rule from repeated occurrences without grouping by source context and speaker evidence.",
    "Raw user-generated sentences may contain profanity or sensitive wording. Treat them as research material, not endorsement.",
]

LIMITATIONS = [
    "The 236 IDs are a reconstructed candidate cohort, not proof of the original historical 239-member population.",
    "This packet is system-blind and reference-withheld, but not source-identity-blind: raw public sentences may identify their source.",
    "No source phoneme annotation, IPA reference, engine output, mismatch fragment, candidate cluster, or prior disposition is included.",
    "The source excerpts come from the pinned UGTPHON Korean test subset. Its ko/LICENSE declares Apache-2.0; licensed external packets must include the complete licence and the UGTPHON Korean-subset source notice.",
    "The dataset licence declaration is the documented distribution basis, not a legal opinion or independent warranty of title/non-infringement for every original user-generated post.",
    "The canonical token may differ from the raw source token because of corpus normalization. Reviewers must record both rather than silently equating them.",
    "These packets are for independent annotation only, not training, tuning, or benchmark-gold creation until review and rights gates are completed.",
]


def _read_rows(csv_path: Path) -> tuple[bytes, list[dict[str, str]]]:
    payload = csv_path.read_bytes()
    with csv_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    return payload, rows


def _validate_licensed_external_scope(rows: list[dict[str, str]]) -> None:
    for row in rows:
        if row.get("source_corpus_commit", "").strip() != EXPECTED_SOURCE_COMMIT:
            raise ValueError("Licensed external review requires the exact pinned UGTPHON source commit")
        if not row.get("source_corpus", "").strip() or not row.get("source_row_id", "").strip():
            raise ValueError("Licensed external review requires source corpus and source-row provenance on every case")
        if not row["source_row_id"].startswith(("multilexnorm2026_", "dc_inside_")):
            raise ValueError("Licensed external review found a source-row ID outside the two declared UGTPHON Korean streams")

    register_path = ROOT / "research/SOURCE-REGISTER.csv"
    with register_path.open(encoding="utf-8-sig", newline="") as handle:
        register = list(csv.DictReader(handle))
    source = next((item for item in register if item.get("source_id") == "SRC-UGTPHON-EMNLP-2026"), None)
    if source is None or "Apache-2.0" not in source.get("license_status", ""):
        raise ValueError("Licensed external review requires the canonical UGTPHON Apache-2.0 source-register record")
    if not APACHE_LICENSE_PATH.is_file() or not APACHE_LICENSE_PATH.read_text(encoding="utf-8").strip():
        raise ValueError("Full Apache-2.0 licence text is missing")
    if not SOURCE_NOTICE_PATH.is_file() or not SOURCE_NOTICE_PATH.read_text(encoding="utf-8").strip():
        raise ValueError("UGTPHON Korean-subset source notice is missing")


def build_packets(csv_path: Path = DEFAULT_CSV, distribution_mode: str = "INTERNAL_ONLY") -> dict:
    if distribution_mode not in {"INTERNAL_ONLY", "LICENSED_EXTERNAL_REVIEW"}:
        raise ValueError(f"Unsupported distribution mode: {distribution_mode}")
    payload, rows = _read_rows(csv_path)
    if len(rows) != EXPECTED_CASES:
        raise ValueError(f"Expected exactly {EXPECTED_CASES} reconstructed cases, got {len(rows)}")
    if distribution_mode == "LICENSED_EXTERNAL_REVIEW":
        _validate_licensed_external_scope(rows)

    seen: set[str] = set()
    reviewer_cases: list[dict] = []
    coordinator_cases: list[dict] = []

    for index, row in enumerate(rows, 1):
        occurrence_id = row.get("occurrence_id", "").strip()
        required = ("source_row_id", "token", "source_context_text", "source_token_index",
                    "source_corpus", "source_corpus_commit")
        if not occurrence_id or occurrence_id in seen:
            raise ValueError(f"Missing or duplicate occurrence_id: {occurrence_id!r}")
        seen.add(occurrence_id)
        missing = [field for field in required if not row.get(field, "").strip()]
        if missing:
            raise ValueError(f"Occurrence {occurrence_id}: missing {', '.join(missing)}")

        token = row["token"].strip()
        context = row["source_context_text"].strip()
        try:
            token_index = int(row["source_token_index"])
        except ValueError as exc:
            raise ValueError(f"Occurrence {occurrence_id}: source_token_index is not an integer") from exc
        raw_tokens = context.split()
        if token_index < 0 or token_index >= len(raw_tokens):
            raise ValueError(
                f"Occurrence {occurrence_id}: source_token_index {token_index} "
                f"is outside the {len(raw_tokens)} raw context tokens"
            )
        raw_token = raw_tokens[token_index]

        case_id = f"BLIND-{index:03d}"
        reviewer_cases.append({
            "caseId": case_id,
            "inputHangul": token,
            "rawSourceToken": raw_token,
            "normalizationRelation": "IDENTICAL" if token == raw_token else "DIFFERS",
            "sourceContextRaw": context,
            "rawSourceTokenIndex": token_index,
            "reviewForm": {
                "rawSurfaceBroadIpa": None,
                "canonicalInputBroadIpa": None,
                "rawSurfaceNarrowIpa": None,
                "canonicalInputNarrowIpa": None,
                "syllableBoundaries": None,
                "vowelLengthAssessment": None,
                "analysisCategory": None,
                "confidence": None,
                "reviewerNotes": None,
            },
        })
        coordinator_cases.append({
            "caseId": case_id,
            "occurrenceId": occurrence_id,
            "sourceRowId": row["source_row_id"],
            "sourceCorpus": row["source_corpus"],
            "sourceCorpusCommit": row["source_corpus_commit"],
            "sourceTokenIndex": token_index,
            "canonicalInputHangul": token,
            "rawSourceToken": raw_token,
            "normalizationRelation": "IDENTICAL" if token == raw_token else "DIFFERS",
        })

    csv_sha = hashlib.sha256(payload).hexdigest()

    def packet(slot: str) -> dict:
        cases = json.loads(json.dumps(reviewer_cases, ensure_ascii=False))
        for case in cases:
            case["reviewForm"]["reviewerSlot"] = slot
        limitations = list(LIMITATIONS)
        if distribution_mode == "INTERNAL_ONLY":
            limitations.append("INTERNAL-ONLY MODE: do not distribute this packet outside the project team.")
        else:
            limitations.append("LICENSED EXTERNAL REVIEW MODE: distribute only with the accompanying full Apache-2.0 licence and UGTPHON Korean-subset source notice.")
        return {
            "schemaVersion": "1.0",
            "packetType": "kozak-236-independent-ipa-review",
            "packetId": f"KOZAK-236-BLIND-REVIEWER-{slot}-2026-11-05",
            "reviewerSlot": slot,
            "blindnessMode": "SYSTEM_BLIND_REFERENCE_WITHHELD_SOURCE_IDENTIFIABLE",
            "distributionMode": distribution_mode,
            "sourceLicense": "Apache-2.0" if distribution_mode == "LICENSED_EXTERNAL_REVIEW" else None,
            "sourceLicenseNotice": "UGTPHON-KO-SOURCE-NOTICE.md" if distribution_mode == "LICENSED_EXTERNAL_REVIEW" else None,
            "sourceCsvSha256": csv_sha,
            "caseCount": len(cases),
            "cohortStatus": "RECONSTRUCTED_CANDIDATE_NOT_ORIGINAL_MEMBERSHIP_PROOF",
            "limitations": limitations,
            "instructions": list(REVIEW_INSTRUCTIONS),
            "cases": cases,
        }

    return {
        "source_csv_sha256": csv_sha,
        "case_count": len(reviewer_cases),
        "distribution_mode": distribution_mode,
        "reviewer_a": packet("A"),
        "reviewer_b": packet("B"),
        "coordinator_map": {
            "schemaVersion": "1.0",
            "sourceCsvSha256": csv_sha,
            "caseCount": len(coordinator_cases),
            "notice": "COORDINATOR ONLY — never send this mapping file to reviewers.",
            "cases": coordinator_cases,
        },
    }


def write_packets(result: dict, output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    files = {
        "reviewer-a.json": result["reviewer_a"],
        "reviewer-b.json": result["reviewer_b"],
        "coordinator-map.json": result["coordinator_map"],
    }
    for name, content in files.items():
        path = output_dir / name
        if path.exists():
            raise FileExistsError(f"Refusing to overwrite existing review material: {path}")
        path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    extra_files = []
    if result["distribution_mode"] == "LICENSED_EXTERNAL_REVIEW":
        for source_path, target_name in (
            (APACHE_LICENSE_PATH, "LICENSE-APACHE-2.0.txt"),
            (SOURCE_NOTICE_PATH, "UGTPHON-KO-SOURCE-NOTICE.md"),
        ):
            target = output_dir / target_name
            if target.exists():
                raise FileExistsError(f"Refusing to overwrite existing review material: {target}")
            shutil.copyfile(source_path, target)
            extra_files.append(target_name)
    return {"output_dir": str(output_dir), "files": sorted(list(files) + extra_files),
            "case_count": result["case_count"], "distribution_mode": result["distribution_mode"],
            "source_csv_sha256": result["source_csv_sha256"]}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV)
    parser.add_argument("--output-dir", type=Path, required=True)
    modes = parser.add_mutually_exclusive_group(required=True)
    modes.add_argument("--internal-review-only", dest="distribution_mode", action="store_const",
                       const="INTERNAL_ONLY", help="Generate internal packets that must not leave the project team.")
    modes.add_argument("--licensed-external-review", dest="distribution_mode", action="store_const",
                       const="LICENSED_EXTERNAL_REVIEW",
                       help="Generate reviewer packets with the full Apache-2.0 text and UGTPHON source notice.")
    args = parser.parse_args(argv)
    result = build_packets(args.csv, args.distribution_mode)
    summary = write_packets(result, args.output_dir)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
