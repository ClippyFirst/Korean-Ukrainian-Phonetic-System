#!/usr/bin/env python3
"""Prepare conservative token-level UGTPHON Korean examples for ClippyFirst research.

Only exact, canonical, single-token entries with one unambiguous phoneme string are
exported. The test split is inspected for source integrity and overlap statistics,
never serialized. This is a filtered corpus, not a claim that all source labels are
normative or convention-identical to ClippyFirst broad IPA.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from urllib.request import urlopen

DATASET_ID = "ugtphon-korean"
REVISION = "ef0d5a09c2ea1874c7206020f875cbd9cfea2f54"
BASE_URL = f"https://raw.githubusercontent.com/naver-ai/UGTPHON/{REVISION}/ko/{{split}}.json"
EXPECTED_GIT_BLOB_SHA1 = {
    "train": "771ef17ceed8127980f0be5103674cfa53627e55",
    "dev": "71127176c1487741ed9a6492cdaabba78222461d",
    "test": "59380491d5a797308c475f7d0007dcf6c4be00af",
}
EXPECTED_ROWS = {"train": 1976, "dev": 246, "test": 275}


def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def fetch_split(split: str) -> tuple[bytes, dict[str, str | int]]:
    if split not in EXPECTED_ROWS:
        raise ValueError(f"unsupported split: {split!r}")
    url = BASE_URL.format(split=split)
    with urlopen(url, timeout=60) as response:
        data = response.read()
    actual = git_blob_sha1(data)
    expected = EXPECTED_GIT_BLOB_SHA1[split]
    if actual != expected:
        raise ValueError(f"{split}: pinned Git blob mismatch: expected {expected}, got {actual}")
    return data, {"url": url, "git_blob_sha1": actual, "sha256": sha256(data), "bytes": len(data)}


def parse_split(data: bytes, split: str, *, expected_rows: int | None = None) -> tuple[list[dict], dict]:
    if split not in EXPECTED_ROWS:
        raise ValueError(f"unsupported split: {split!r}")
    try:
        rows = json.loads(data.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError(f"{split}: invalid UTF-8 JSON") from exc
    required_rows = EXPECTED_ROWS[split] if expected_rows is None else expected_rows
    if not isinstance(rows, list) or len(rows) != required_rows:
        actual = len(rows) if isinstance(rows, list) else "non-array"
        raise ValueError(f"{split}: expected {required_rows} sentence rows, got {actual}")

    seen_ids: set[str] = set()
    output: list[dict] = []
    excluded: Counter[str] = Counter()
    all_forms: set[str] = set()
    eligible_forms: set[str] = set()
    target_by_source: dict[str, set[str]] = defaultdict(set)
    eligible_occurrences = 0

    for row_index, row in enumerate(rows):
        if not isinstance(row, dict):
            raise ValueError(f"{split}: row {row_index} is not an object")
        case_id = row.get("id")
        if not isinstance(case_id, str) or not case_id:
            raise ValueError(f"{split}: row {row_index} has no id")
        if case_id in seen_ids:
            raise ValueError(f"{split}: duplicate sentence id {case_id!r}")
        seen_ids.add(case_id)
        if row.get("lang") != "ko" or row.get("split") != split:
            raise ValueError(f"{split}: row {case_id!r} has mismatched lang/split")
        tokens = row.get("tokens")
        if not isinstance(tokens, list):
            raise ValueError(f"{split}: row {case_id!r} tokens must be a list")

        for token_index, token in enumerate(tokens):
            if not isinstance(token, dict):
                excluded["malformed_token"] += 1
                continue
            surface = token.get("text")
            canonical = token.get("canonical")
            phoneme = token.get("phoneme")
            if isinstance(canonical, str) and canonical.strip():
                normalized_form = unicodedata.normalize("NFC", canonical.strip())
                all_forms.add(normalized_form)
            else:
                normalized_form = ""
            reason = None
            if not isinstance(surface, str) or not surface.strip():
                reason = "missing_surface"
            elif not isinstance(canonical, str) or not canonical.strip():
                reason = "missing_canonical"
            elif token.get("is_nc") is not False or surface != canonical:
                reason = "noncanonical_or_surface_mismatch"
            elif any(ch.isspace() for ch in canonical.strip()):
                reason = "multiword_token"
            elif not isinstance(phoneme, str) or not phoneme.strip():
                reason = "missing_phoneme"
            elif "," in phoneme or "," in canonical:
                reason = "ambiguous_comma_variant"
            elif "<" in phoneme or ">" in phoneme:
                reason = "placeholder_phoneme"
            if reason:
                excluded[reason] += 1
                continue

            source_nfc = unicodedata.normalize("NFC", canonical.strip())
            target_raw = phoneme.strip()
            eligible_occurrences += 1
            eligible_forms.add(source_nfc)
            target_by_source[source_nfc].add(target_raw)
            output.append({
                "case_id": f"{DATASET_ID}:{split}:{case_id}:{token_index}",
                "dataset_id": DATASET_ID,
                "dataset_revision": REVISION,
                "source_sentence_id": case_id,
                "source": row.get("source", ""),
                "split": split,
                "source_text": source_nfc,
                "source_text_raw": canonical,
                "surface_text_raw": surface,
                "target_raw": target_raw,
                "target_representation": "ugtphon_token_phoneme_ipa",
                "target_normalization": "none; target string preserved apart from surrounding whitespace",
                "source_sentence_text": row.get("text", ""),
                "token_index": token_index,
                "is_nc": False,
            })

    conflict_forms = {form for form, targets in target_by_source.items() if len(targets) > 1}
    summary = {
        "sentence_rows": len(rows),
        "unique_sentence_ids": len(seen_ids),
        "eligible_token_occurrences": eligible_occurrences,
        "unique_canonical_forms_seen": len(all_forms),
        "unique_eligible_source_forms": len(eligible_forms),
        "eligible_source_forms_with_multiple_target_strings": len(conflict_forms),
        "excluded_token_counts_by_reason": dict(sorted(excluded.items())),
        "exported": split in {"train", "dev"},
    }
    return output, summary


def prepare(output_dir: Path) -> dict:
    output_dir.mkdir(parents=True, exist_ok=True)
    source_meta: dict[str, dict[str, str | int]] = {}
    summaries: dict[str, dict] = {}
    form_sets: dict[str, set[str]] = {}
    train_dev_records: dict[str, list[dict]] = {}

    for split in ("train", "dev", "test"):
        data, meta = fetch_split(split)
        records, summary = parse_split(data, split)
        source_meta[split] = meta
        summaries[split] = summary
        form_sets[split] = {str(row["source_text"]) for row in records}
        if split in {"train", "dev"}:
            train_dev_records[split] = records

    for split in ("train", "dev"):
        payload = "".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n"
                          for row in train_dev_records[split])
        (output_dir / f"{split}.jsonl").write_text(payload, encoding="utf-8", newline="\n")

    manifest = {
        "schema_version": "1.0",
        "purpose": "filtered token-level research corpus; no model inference",
        "dataset_id": DATASET_ID,
        "dataset_revision": REVISION,
        "source_license_note": "The pinned Korean subset declares Apache-2.0; retain source attribution and the upstream license with any redistribution.",
        "selection_policy": {
            "include": "is_nc=false, surface equals canonical, single-token canonical form, non-empty phoneme string, no comma variants/placeholders",
            "exclude": "non-canonical/noisy forms, surface/canonical mismatches, multiword tokens, missing phonemes, ambiguous comma-separated targets",
            "target": "raw token-level IPA field, not normalized to ClippyFirst's broad IPA",
        },
        "splits": {
            split: {
                **source_meta[split],
                **summaries[split],
                "output_file_sha256": sha256((output_dir / f"{split}.jsonl").read_bytes())
                if split in {"train", "dev"} else None,
            }
            for split in ("train", "dev", "test")
        },
        "eligible_source_form_overlap_counts": {
            "train_dev": len(form_sets["train"] & form_sets["dev"]),
            "train_test": len(form_sets["train"] & form_sets["test"]),
            "dev_test": len(form_sets["dev"] & form_sets["test"]),
        },
        "test_policy": "test was fetched only for pinned-source integrity, summary, and overlap diagnostics; no test records are exported or used for selection",
        "training_or_tuning_on_test": False,
    }
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        manifest = prepare(args.output_dir)
    except (OSError, ValueError) as exc:
        parser.error(str(exc))
    print(json.dumps({
        "dataset_id": manifest["dataset_id"],
        "eligible_token_occurrences": {
            split: manifest["splits"][split]["eligible_token_occurrences"] for split in ("train", "dev")
        },
        "unique_eligible_source_forms": {
            split: manifest["splits"][split]["unique_eligible_source_forms"] for split in ("train", "dev")
        },
        "eligible_source_form_overlap_counts": manifest["eligible_source_form_overlap_counts"],
        "test_records_exported": False,
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
