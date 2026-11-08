from __future__ import annotations

import json
import re
from functools import lru_cache
from importlib.resources import files

_KOREAN_BOUNDARY = re.compile(r"[\\u1100-\\u11ff\\u3130-\\u318f\\uac00-\\ud7a3]")

@lru_cache(maxsize=1)
def _registry() -> dict:
    resource = files("korean_ukrainian").joinpath("source_adjudications.json")
    return json.loads(resource.read_text(encoding="utf-8"))

def source_adjudications_for_input(source: str) -> list[dict]:
    """Return bounded source-policy annotations without changing phonetic output."""
    text = str(source or "")
    matches = []
    for item in _registry()["adjudications"]:
        for form in item["runtime_match_forms"]:
            start = 0
            while True:
                start = text.find(form, start)
                if start < 0:
                    break
                end = start + len(form)
                before = text[start - 1] if start else ""
                after = text[end] if end < len(text) else ""
                if (not before or not _KOREAN_BOUNDARY.fullmatch(before)) and (
                    not after or not _KOREAN_BOUNDARY.fullmatch(after)
                ):
                    matches.append({
                        "adjudication_id": item["adjudication_id"],
                        "case_family": item["case_family"],
                        "matched_form": form,
                        "source_adjudication_status": item["source_adjudication_status"],
                        "runtime_action": item["runtime_action"],
                        "evidence_ids": item["evidence_ids"],
                        "claim_ids": item["claim_ids"],
                        "occurrence_ids": item["occurrence_ids"],
                    })
                start = end
    return matches

def registry_metadata() -> dict:
    registry = _registry()
    return {
        "version": registry["schema_version"],
        "accepted_occurrence_count": registry["accepted_occurrence_count"],
        "adjudication_count": registry["adjudication_count"],
    }
