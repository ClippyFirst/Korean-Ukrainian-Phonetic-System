#!/usr/bin/env python3
"""Compare Native and Browser Kozak Kim on the same pinned IPA occurrences.

This is a diagnostic contract check, not a normative IPA accuracy benchmark.
Surface parity and IPA-profile parity are reported separately.
"""
from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any


def _load(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path}: report root must be an object")
    return value


def _index_records(
    records: list[dict[str, Any]], *, runtime: str, row_key: str, ipa_key: str
) -> dict[str, dict[str, Any]]:
    indexed: dict[str, dict[str, Any]] = {}
    for position, item in enumerate(records):
        occurrence_id = str(item.get("occurrence_id", ""))
        if occurrence_id != str(position):
            raise ValueError(
                f"{runtime}: occurrence IDs must be complete and ordered; "
                f"position {position} has {occurrence_id!r}"
            )
        if occurrence_id in indexed:
            raise ValueError(f"{runtime}: duplicate occurrence_id {occurrence_id}")
        if not item.get(row_key) or not item.get("token") or not item.get("gold"):
            raise ValueError(f"{runtime}: incomplete identity at occurrence {occurrence_id}")
        if item.get(ipa_key) is not None and not isinstance(item.get(ipa_key), str):
            raise ValueError(f"{runtime}: non-string IPA at occurrence {occurrence_id}")
        indexed[occurrence_id] = item
    return indexed


def _native_scored(item: dict[str, Any]) -> bool:
    return item.get("status") == "scored" and isinstance(item.get("ipa"), str)


def _browser_scored(item: dict[str, Any]) -> bool:
    return (
        item.get("pronunciation_status") == "resolved"
        and isinstance(item.get("predicted"), str)
        and isinstance(item.get("distance"), int)
    )


def _surface(item: dict[str, Any], *, browser: bool) -> str | None:
    value = item.get("surface_hangul")
    if value is None:
        return None
    # The browser benchmark reconstructs a complete surface from trace; no delta semantics remain here.
    return str(value)


def _score_metrics(items: list[tuple[dict[str, Any], dict[str, Any]]], *, broad: bool) -> dict[str, Any]:
    native_exact = browser_exact = 0
    native_distance = browser_distance = 0
    native_reference = browser_reference = 0
    for native, browser in items:
        if broad:
            n = native.get("broad_candidate") or {}
            nd = int(n["distance"])
            ne = bool(n["exact"])
            nr = int(n["reference_length"])
            bd = int(browser["broad_candidate_distance"])
            be = bool(browser["broad_candidate_exact"])
            br = len(str(browser["broad_candidate_gold"]))
        else:
            nd = int(native["distance"])
            ne = bool(native["exact"])
            nr = int(native["reference_length"])
            bd = int(browser["distance"])
            be = bool(browser["exact"])
            br = len(str(browser["closest_normalized_gold"]))
        native_exact += int(ne)
        browser_exact += int(be)
        native_distance += nd
        browser_distance += bd
        native_reference += nr
        browser_reference += br
    count = len(items)
    return {
        "paired_scored_occurrences": count,
        "native": {
            "exact_matches": native_exact,
            "exact_match_rate": native_exact / count if count else None,
            "character_errors": native_distance,
            "reference_characters": native_reference,
            "character_error_rate": native_distance / native_reference if native_reference else None,
        },
        "browser": {
            "exact_matches": browser_exact,
            "exact_match_rate": browser_exact / count if count else None,
            "character_errors": browser_distance,
            "reference_characters": browser_reference,
            "character_error_rate": browser_distance / browser_reference if browser_reference else None,
        },
        "browser_minus_native": {
            "exact_match_rate": (browser_exact - native_exact) / count if count else None,
            "character_error_rate": (
                browser_distance / browser_reference - native_distance / native_reference
                if browser_reference and native_reference else None
            ),
        },
    }


def compare_reports(native_report: dict[str, Any], browser_report: dict[str, Any]) -> dict[str, Any]:
    if native_report.get("occurrence_ledger_schema_version") != 2:
        raise ValueError("native report must use occurrence-ledger schema v2")
    if browser_report.get("benchmark") != "UGTPHON Korean canonical-token diagnostic":
        raise ValueError("browser report is not the direct Kozak Kim canonical-token diagnostic")
    native_profile = native_report.get("native_ipa_profile") or {}
    browser_profile = {
        "ipa_profile": browser_report.get("ipa_profile"),
        "ipa_profile_version": browser_report.get("ipa_profile_version"),
        "ipa_profile_status": browser_report.get("ipa_profile_status"),
        "ipa_profile_level": browser_report.get("ipa_profile_level"),
    }
    native_broad_profile = native_report.get("broad_candidate_profile") or {}
    browser_broad_profile = browser_report.get("broad_candidate_profile") or {}
    if not native_broad_profile.get("profile_id") or any(
        native_broad_profile.get(key) != browser_broad_profile.get(key)
        for key in ("profile_id", "profile_version", "status")
    ):
        raise ValueError("Native and Browser reports do not use the same broad-candidate profile contract")

    native_records = native_report.get("per_engine_occurrences", {}).get("clippyfirst_native")
    browser_records = browser_report.get("records")
    if not isinstance(native_records, list) or not isinstance(browser_records, list):
        raise ValueError("both reports must contain per-occurrence records")
    native = _index_records(native_records, runtime="native", row_key="row_id", ipa_key="ipa")
    browser = _index_records(browser_records, runtime="browser", row_key="id", ipa_key="predicted")
    if list(native) != list(browser):
        raise ValueError("Native and Browser occurrence IDs differ")
    ids = list(native)
    native_eligible = native_report.get("eligible_token_occurrences")
    browser_eligible = browser_report.get("eligible_tokens")
    if native_eligible != len(ids) or browser_eligible != len(ids):
        raise ValueError(
            f"eligible-occurrence count mismatch: ledger={len(ids)}, "
            f"native={native_eligible}, browser={browser_eligible}"
        )
    native_rows = native_report.get("dataset_rows")
    browser_rows = browser_report.get("rows")
    if native_rows != browser_rows:
        raise ValueError(f"dataset row-count mismatch: native={native_rows}, browser={browser_rows}")
    identity_mismatches = []
    for occurrence_id in ids:
        n, b = native[occurrence_id], browser[occurrence_id]
        if (str(n["row_id"]), str(n["token"]), str(n["gold"])) != (str(b["id"]), str(b["token"]), str(b["gold"])):
            identity_mismatches.append(occurrence_id)
    if identity_mismatches:
        raise ValueError("Native/Browser occurrence identity mismatch: " + ", ".join(identity_mismatches[:10]))

    both_scored: list[tuple[dict[str, Any], dict[str, Any]]] = []
    native_only = browser_only = both_abstain = 0
    surface_counts: Counter[str] = Counter()
    ipa_counts: Counter[str] = Counter()
    sibilant_only = 0
    examples: list[dict[str, Any]] = []
    surface_examples: list[dict[str, Any]] = []
    native_feature_loss: Counter[str] = Counter()
    browser_feature_loss: Counter[str] = Counter()

    for occurrence_id in ids:
        n, b = native[occurrence_id], browser[occurrence_id]
        ns, bs = _native_scored(n), _browser_scored(b)
        if ns and bs:
            both_scored.append((n, b))
            ni, bi = str(n["ipa"]), str(b["predicted"])
            same_ipa = ni == bi
            same_broad = str((n.get("broad_candidate") or {}).get("predicted", "")) == str(b.get("broad_candidate_predicted", ""))
            ipa_counts["same_raw_ipa" if same_ipa else "different_raw_ipa"] += 1
            ipa_counts["same_broad_ipa" if same_broad else "different_broad_ipa"] += 1
            if not same_ipa:
                if ni.replace("ɕ", "s") == bi.replace("ɕ", "s"):
                    sibilant_only += 1
                if len(examples) < 50:
                    examples.append({
                        "occurrence_id": occurrence_id, "row_id": n["row_id"], "token": n["token"],
                        "gold": n["gold"], "native_ipa": ni, "browser_ipa": bi,
                        "native_broad_ipa": (n.get("broad_candidate") or {}).get("predicted"),
                        "browser_broad_ipa": b.get("broad_candidate_predicted"),
                        "native_strict_distance": n.get("distance"), "browser_strict_distance": b.get("distance"),
                        "native_broad_distance": (n.get("broad_candidate") or {}).get("distance"),
                        "browser_broad_distance": b.get("broad_candidate_distance"),
                    })
        elif ns:
            native_only += 1
        elif bs:
            browser_only += 1
        else:
            both_abstain += 1

        n_surface = _surface(n, browser=False)
        b_surface = _surface(b, browser=True)
        if n_surface is None or b_surface is None:
            surface_counts["surface_missing"] += 1
        elif n_surface == b_surface:
            surface_counts["surface_equal"] += 1
        else:
            surface_counts["surface_different"] += 1
            if len(surface_examples) < 50:
                surface_examples.append({
                    "occurrence_id": occurrence_id, "row_id": n["row_id"], "token": n["token"],
                    "native_surface": n_surface, "browser_surface": b_surface,
                })

        if isinstance((n.get("broad_candidate") or {}).get("prediction_feature_loss_counts"), dict):
            native_feature_loss.update(n["broad_candidate"]["prediction_feature_loss_counts"])
        if isinstance(b.get("broad_candidate_prediction_feature_loss_counts"), dict):
            browser_feature_loss.update(b["broad_candidate_prediction_feature_loss_counts"])

    surface_compared = surface_counts["surface_equal"] + surface_counts["surface_different"]
    ipa_compared = len(both_scored)
    same_profile_id = native_profile.get("ipa_profile") == browser_profile.get("ipa_profile")
    profile_fields = ("ipa_profile", "ipa_profile_version", "ipa_profile_level", "ipa_profile_status")
    profile_same = all(native_profile.get(key) == browser_profile.get(key) for key in profile_fields)
    result = {
        "schema_version": 1,
        "benchmark": "UGTPHON Korean test split — paired Native/Browser Kozak Kim runtime audit",
        "purpose": "runtime differential diagnostic; not normative IPA accuracy or Ukrainian target validation",
        "dataset": {
            "native_benchmark": native_report.get("benchmark"),
            "browser_benchmark": browser_report.get("benchmark"),
            "rows": native_report.get("dataset_rows"),
            "eligible_occurrences": len(ids),
            "source": native_report.get("dataset_source"),
        },
        "occurrence_identity": {
            "status": "PASS",
            "matched_occurrences": len(ids),
            "identity_mismatches": len(identity_mismatches),
        },
        "ipa_profiles": {
            "native": native_profile,
            "browser": browser_profile,
            "same_profile_id": same_profile_id,
            "same_profile_contract": profile_same,
            "parity_status": "SAME_PROFILE_CONTRACT" if profile_same else "DIFFERENT_PROFILE_CONTRACTS",
            "shared_broad_candidate_profile": {
                "profile_id": native_broad_profile.get("profile_id"),
                "profile_version": native_broad_profile.get("profile_version"),
                "status": native_broad_profile.get("status"),
            },
        },
        "coverage": {
            "native_scored": sum(_native_scored(item) for item in native.values()),
            "browser_scored": sum(_browser_scored(item) for item in browser.values()),
            "both_scored": len(both_scored),
            "native_only_scored": native_only,
            "browser_only_scored": browser_only,
            "both_unresolved_or_abstained": both_abstain,
        },
        "surface_parity": {
            "compared_occurrences": surface_compared,
            "equal": surface_counts["surface_equal"],
            "different": surface_counts["surface_different"],
            "missing": surface_counts["surface_missing"],
            "exact_rate": surface_counts["surface_equal"] / surface_compared if surface_compared else None,
            "difference_examples": surface_examples,
        },
        "ipa_parity": {
            "compared_scored_occurrences": ipa_compared,
            "same_raw_ipa": ipa_counts["same_raw_ipa"],
            "different_raw_ipa": ipa_counts["different_raw_ipa"],
            "raw_ipa_exact_rate": ipa_counts["same_raw_ipa"] / ipa_compared if ipa_compared else None,
            "same_broad_ipa": ipa_counts["same_broad_ipa"],
            "different_broad_ipa": ipa_counts["different_broad_ipa"],
            "broad_ipa_exact_rate": ipa_counts["same_broad_ipa"] / ipa_compared if ipa_compared else None,
            "different_ipa_cases_only_s_vs_ɕ": sibilant_only,
            "other_ipa_difference_cases": ipa_counts["different_raw_ipa"] - sibilant_only,
            "difference_examples": examples,
        },
        "paired_gold_diagnostic": {
            "strict": _score_metrics(both_scored, broad=False),
            "broad_candidate": _score_metrics(both_scored, broad=True),
        },
        "broad_candidate_feature_loss": {
            "native_prediction": dict(sorted(native_feature_loss.items())),
            "browser_prediction": dict(sorted(browser_feature_loss.items())),
        },
        "interpretation": [
            "Native and Browser IPA profile IDs must match before exact IPA string parity is a valid acceptance gate.",
            "Surface Hangul parity is evaluated separately from IPA serialization and transcription convention.",
            "Broad-candidate scores are sensitivity metrics under a research-only, unadjudicated profile; they are not normative accuracy.",
            "The report does not evaluate Ukrainian target adaptation.",
        ],
    }
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--native-report", type=Path, required=True)
    parser.add_argument("--browser-report", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        result = compare_reports(_load(args.native_report), _load(args.browser_report))
    except Exception as exc:
        parser.error(f"runtime parity audit failed: {type(exc).__name__}: {exc}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
