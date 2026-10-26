#!/usr/bin/env python3
"""Create typed, lossless IPA annotation packets without pretending corpus conventions match.

This is a representation boundary, not a phonological converter. It preserves raw
annotations and marks only explicit separators/diacritics. It never rewrites symbols,
infers syllable boundaries, or emits ClippyFirst broad IPA / Ukrainian text.
"""
from __future__ import annotations

import argparse
import json
import unicodedata
from pathlib import Path

SCHEMA_VERSION = "1.0"
SIGMORPHON = "tokenized_ipa_from_sigmorphon_tsv"
UGTPHON = "ugtphon_token_phoneme_ipa"
SUPPORTED = {SIGMORPHON, UGTPHON}
BOUNDARY_SYMBOLS = {".", "‧", "·"}
STRESS_SYMBOLS = {"ˈ", "ˌ"}
LENGTH_SYMBOLS = {"ː", "ˑ"}


def _validate_text(value: object, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be a non-empty string")
    return value


def _marker_inventory(raw: str, representation: str) -> dict:
    """Record explicit markers without promoting punctuation inside a token to a boundary."""
    boundaries = []
    stress = []
    length = []
    if representation == SIGMORPHON:
        # A boundary token must be isolated by the source's whitespace tokenization.
        offset = 0
        for token in raw.split():
            token_offset = raw.find(token, offset)
            if token in BOUNDARY_SYMBOLS:
                boundaries.append({"codepoint_offset": token_offset, "symbol": token, "kind": "explicit_boundary"})
            offset = token_offset + len(token)
    else:
        # UGTPHON compact annotations encode dots directly; retain each literal marker.
        boundaries = [
            {"codepoint_offset": offset, "symbol": char, "kind": "explicit_boundary"}
            for offset, char in enumerate(raw) if char in BOUNDARY_SYMBOLS
        ]
    for offset, char in enumerate(raw):
        if char in STRESS_SYMBOLS:
            stress.append({"codepoint_offset": offset, "symbol": char, "kind": "stress_marker"})
        elif char in LENGTH_SYMBOLS:
            length.append({"codepoint_offset": offset, "symbol": char, "kind": "length_marker"})
    return {
        "explicit_boundary_markers": boundaries,
        "stress_markers": stress,
        "length_markers": length,
        "marker_policy": "observed_only; no deletion, normalization, or inferred boundary",
    }


def _tokenized_units(raw: str) -> list[dict]:
    # Whitespace is a source serialization separator in this representation.
    # A dot is a boundary only when it is an entire token; punctuation inside a
    # token remains part of that raw token and is never stripped.
    units = []
    for token_index, token in enumerate(raw.split()):
        if token in BOUNDARY_SYMBOLS:
            kind = "explicit_boundary"
        elif token in STRESS_SYMBOLS:
            kind = "stress_marker"
        else:
            kind = "opaque_source_token"
        units.append({
            "index": token_index,
            "kind": kind,
            "raw": token,
            "unicode_codepoints": [f"U+{ord(char):04X}" for char in token],
        })
    return units


def _compact_units(raw: str) -> list[dict]:
    """Split into Unicode base-plus-combining-mark clusters, not phoneme segments."""
    units: list[dict] = []
    for char in raw:
        if unicodedata.combining(char) and units and units[-1]["kind"] == "opaque_unicode_cluster":
            units[-1]["raw"] += char
            units[-1]["unicode_codepoints"].append(f"U+{ord(char):04X}")
            continue
        if char.isspace():
            # Whitespace may have corpus-specific semantics; preserve it as opaque.
            kind = "opaque_whitespace"
        elif char in BOUNDARY_SYMBOLS:
            kind = "explicit_boundary"
        elif char in STRESS_SYMBOLS:
            kind = "stress_marker"
        else:
            kind = "opaque_unicode_cluster"
        units.append({
            "index": len(units),
            "kind": kind,
            "raw": char,
            "unicode_codepoints": [f"U+{ord(char):04X}"],
        })
    return units


def packetize_row(row: dict) -> dict:
    if not isinstance(row, dict):
        raise ValueError("row must be an object")
    case_id = _validate_text(row.get("case_id"), "case_id")
    source = _validate_text(row.get("source_text"), "source_text")
    raw = _validate_text(row.get("target_raw"), "target_raw")
    representation = _validate_text(row.get("target_representation"), "target_representation")
    if representation not in SUPPORTED:
        raise ValueError(f"unsupported target representation: {representation!r}")
    split = row.get("split")
    if split not in {"train", "dev"}:
        raise ValueError("only train/dev rows may be packetized; test/holdout is sealed")
    if representation == SIGMORPHON:
        units = _tokenized_units(raw)
        unit_policy = "source whitespace tokens; units are not asserted to be phonemes"
    else:
        units = _compact_units(raw)
        unit_policy = "Unicode clusters for lossless inspection; clusters are not asserted to be phonemes"
    if not units:
        raise ValueError("target produced no inspectable units")
    return {
        "schema_version": SCHEMA_VERSION,
        "case_id": case_id,
        "dataset_id": row.get("dataset_id"),
        "dataset_revision": row.get("dataset_revision"),
        "split": split,
        "source_text": source,
        "target_raw": raw,
        "target_representation": representation,
        "units": units,
        "markers": _marker_inventory(raw, representation),
        "unit_policy": unit_policy,
        "adapter_status": "SOURCE_TYPED_NOT_MAPPED",
        "clippyfirst_broad_ipa": None,
        "ukrainian_orthography": None,
        "block_reason": "No independently reviewed source-specific mapping to the ClippyFirst IPA contract exists yet.",
    }


def packetize_file(input_path: Path, output_path: Path) -> dict:
    if not input_path.is_file():
        raise ValueError(f"missing input JSONL: {input_path}")
    rows = []
    seen_ids = set()
    for line_number, line in enumerate(input_path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{input_path}:{line_number}: invalid JSONL") from exc
        packet = packetize_row(row)
        if packet["case_id"] in seen_ids:
            raise ValueError(f"{input_path}:{line_number}: duplicate case_id")
        seen_ids.add(packet["case_id"])
        rows.append(packet)
    if not rows:
        raise ValueError(f"{input_path}: no rows")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = "".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n" for row in rows)
    output_path.write_text(payload, encoding="utf-8", newline="\n")
    return {
        "input": str(input_path),
        "output": str(output_path),
        "row_count": len(rows),
        "adapter_status_counts": {"SOURCE_TYPED_NOT_MAPPED": len(rows)},
        "output_bytes": len(payload.encode("utf-8")),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-jsonl", type=Path, required=True)
    parser.add_argument("--output-jsonl", type=Path, required=True)
    parser.add_argument("--summary-json", type=Path)
    args = parser.parse_args()
    summary = packetize_file(args.input_jsonl, args.output_jsonl)
    rendered = json.dumps(summary, ensure_ascii=False, indent=2)
    if args.summary_json:
        args.summary_json.parent.mkdir(parents=True, exist_ok=True)
        args.summary_json.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
