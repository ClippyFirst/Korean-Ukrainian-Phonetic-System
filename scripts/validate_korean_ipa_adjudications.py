#!/usr/bin/env python3
"""Validate and merge human IPA-adjudication decisions into a separate ledger.

The source conflict queue remains immutable. This tool never decides pronunciation,
maps IPA symbols, or promotes rules; it only validates explicitly supplied reviewer
records and emits a provenance-linked decision ledger.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

DECISIONS = {"ACCEPT_SOURCE_VARIANT", "CONVENTION_ONLY", "LIKELY_ERROR", "UNRESOLVED"}
REVIEWERS = ("reviewer_1", "reviewer_2")


def _read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read JSON file: {path}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return value


def _nonempty_string(value: Any, field: str, *, required: bool = True) -> str | None:
    if value is None and not required:
        return None
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be a non-empty string")
    return value.strip()


def validate_and_merge(queue: dict[str, Any], decisions_doc: dict[str, Any]) -> dict[str, Any]:
    """Validate reviewer decisions against queue IDs and exact source forms."""
    pins = queue.get("source_pins")
    if not isinstance(pins, dict) or not {"sigmorphon", "ugtphon"} <= set(pins):
        raise ValueError("queue must declare SIGMORPHON and UGTPHON source pins")
    items = queue.get("items")
    if not isinstance(items, list) or not items:
        raise ValueError("queue must contain non-empty items")
    queue_by_id: dict[str, dict[str, Any]] = {}
    seen_sources: set[str] = set()
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("queue items must be objects")
        qid = _nonempty_string(item.get("queue_id"), "queue_id")
        source = _nonempty_string(item.get("source_text"), f"{qid}.source_text")
        if qid in queue_by_id:
            raise ValueError(f"duplicate queue_id in queue: {qid}")
        if source in seen_sources:
            raise ValueError(f"duplicate source form in queue: {source}")
        queue_by_id[qid] = item
        seen_sources.add(source)

    if decisions_doc.get("schema_version") != "1.0":
        raise ValueError("unsupported decision schema_version; expected '1.0'")
    if decisions_doc.get("source_pins") != pins:
        raise ValueError("decision source_pins do not exactly match the queue")
    records = decisions_doc.get("decisions")
    if not isinstance(records, list):
        raise ValueError("decisions must be an array")
    seen_decisions: set[str] = set()
    validated = []
    for index, record in enumerate(records):
        where = f"decisions[{index}]"
        if not isinstance(record, dict):
            raise ValueError(f"{where} must be an object")
        qid = _nonempty_string(record.get("queue_id"), f"{where}.queue_id")
        if qid not in queue_by_id:
            raise ValueError(f"{where}: unknown queue_id {qid}")
        if qid in seen_decisions:
            raise ValueError(f"duplicate decision for queue_id {qid}")
        seen_decisions.add(qid)
        item = queue_by_id[qid]
        if record.get("source_text") != item["source_text"]:
            raise ValueError(f"{where}: source_text does not match queue item {qid}")
        reviewers = record.get("reviewers")
        if not isinstance(reviewers, dict):
            raise ValueError(f"{where}.reviewers must contain independent reviewer records")
        validated_reviewers = {}
        for reviewer in REVIEWERS:
            entry = reviewers.get(reviewer)
            if not isinstance(entry, dict):
                raise ValueError(f"{where}.reviewers.{reviewer} is required")
            status = _nonempty_string(entry.get("decision"), f"{where}.{reviewer}.decision")
            if status not in DECISIONS:
                raise ValueError(f"{where}.{reviewer}.decision must be one of {sorted(DECISIONS)}")
            rationale = _nonempty_string(entry.get("rationale"), f"{where}.{reviewer}.rationale")
            source_ref = _nonempty_string(entry.get("evidence_reference"), f"{where}.{reviewer}.evidence_reference", required=False)
            if status != "UNRESOLVED" and source_ref is None:
                raise ValueError(f"{where}.{reviewer}: evidence_reference required unless decision is UNRESOLVED")
            validated_reviewers[reviewer] = {
                "decision": status,
                "rationale": rationale,
                "evidence_reference": source_ref,
            }
        adjudicator = _nonempty_string(record.get("adjudicator"), f"{where}.adjudicator", required=False)
        final_decision = _nonempty_string(record.get("final_decision"), f"{where}.final_decision", required=False)
        if final_decision is not None and final_decision not in DECISIONS:
            raise ValueError(f"{where}.final_decision must be one of {sorted(DECISIONS)}")
        if final_decision is not None and (not adjudicator or not record.get("final_rationale", "").strip()):
            raise ValueError(f"{where}: final decision requires adjudicator and final_rationale")
        validated.append({
            "queue_id": qid,
            "source_text": item["source_text"],
            "source_candidates": {
                "sigmorphon": item.get("sigmorphon_candidates", []),
                "ugtphon": item.get("ugtphon_candidates", []),
            },
            "reviewers": validated_reviewers,
            "reviewer_agreement": (
                validated_reviewers["reviewer_1"]["decision"]
                == validated_reviewers["reviewer_2"]["decision"]
            ),
            "adjudicator": adjudicator,
            "final_decision": final_decision,
            "final_rationale": record.get("final_rationale"),
            "review_status": "ADJUDICATED" if final_decision else "REVIEWED_PENDING_ADJUDICATION",
        })
    return {
        "schema_version": "1.0",
        "status": "HUMAN_DECISIONS_VALIDATED",
        "source_pins": pins,
        "queue_item_count": len(queue_by_id),
        "decision_record_count": len(validated),
        "unreviewed_queue_ids": sorted(set(queue_by_id) - seen_decisions),
        "decisions": validated,
        "guardrails": {
            "source_queue_modified": False,
            "automatic_pronunciation_adjudication": False,
            "ipa_mapping_applied": False,
            "production_rules_changed": False,
            "reviewer_decisions_inferred": False,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--queue-json", type=Path, required=True)
    parser.add_argument("--decisions-json", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    args = parser.parse_args()
    try:
        result = validate_and_merge(_read_json(args.queue_json), _read_json(args.decisions_json))
    except (OSError, ValueError) as exc:
        parser.error(str(exc))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({k: result[k] for k in ("status", "queue_item_count", "decision_record_count", "unreviewed_queue_ids")}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
