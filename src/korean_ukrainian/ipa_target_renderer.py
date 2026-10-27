from __future__ import annotations

import csv
import hashlib
import sysconfig
import unicodedata
from pathlib import Path
from typing import Any

_SOURCE_DATA = Path(__file__).resolve().parents[2] / "data" / "korean"
_INSTALLED_DATA = (
    Path(sysconfig.get_path("data"))
    / "share"
    / "korean-ukrainian-phonetic-system"
)
_DATA_DIRS = (_SOURCE_DATA, _INSTALLED_DATA)


def _canonical_mapping_id(layer: str, input_jamo: str, ipa: str) -> str:
    key = f"{layer}|{input_jamo}|{ipa}".encode("utf-8")
    return "KUA-CAN-" + hashlib.sha1(key).hexdigest()[:12]


def _read_csv(name: str) -> list[dict[str, str]]:
    for directory in _DATA_DIRS:
        path = directory / name
        try:
            with path.open(encoding="utf-8-sig", newline="") as handle:
                return list(csv.DictReader(handle))
        except FileNotFoundError:
            continue
    return []


def _load_mappings() -> tuple[dict[str, dict[str, Any]], dict[str, str]]:
    """Load explicit Korean-specific IPA→Ukrainian mappings.

    The Ukrainian Phonetic Inventory remains the external source for Ukrainian
    phoneme/features/grapheme metadata. Cross-language correspondence policy
    is downstream and is therefore read from this repository's canonical
    correspondence table plus explicit sequence/allophone overrides.
    """
    mappings: dict[str, dict[str, Any]] = {}
    conflicts: dict[str, str] = {}

    for row in _read_csv("canonical_correspondence.csv"):
        ipa = unicodedata.normalize("NFC", (row.get("ipa") or "").strip())
        target = (row.get("ukrainian") or "").strip()
        status = (row.get("status") or "").strip()
        if not ipa or not target or "~" in ipa or status not in {"model-selected", "provisional"}:
            continue
        layer = (row.get("layer") or "").strip()
        input_jamo = (row.get("input") or "").strip()
        record = {
            "mapping_id": _canonical_mapping_id(layer, input_jamo, ipa),
            "source_ipa": ipa,
            "target_grapheme": target,
            "status": status,
            "scope": (row.get("scope") or "canonical-correspondence").strip(),
            "source_ref": f"data/korean/canonical_correspondence.csv#{layer}:{input_jamo}:{ipa}",
            "notes": (row.get("notes") or "").strip(),
            "mapping_source": "canonical_correspondence",
        }
        previous = mappings.get(ipa)
        if previous and previous["target_grapheme"] != target:
            conflicts[ipa] = "conflicting_canonical_correspondence"
            continue
        if previous:
            previous["correspondence_ids"].append(record["mapping_id"])
        else:
            record["correspondence_ids"] = [record["mapping_id"]]
            mappings[ipa] = record

    # Explicit sequence rules override general longest-match decomposition.
    for row in _read_csv("ipa_target_overrides.csv"):
        ipa = unicodedata.normalize("NFC", (row.get("source_ipa") or "").strip())
        target = (row.get("target_grapheme") or "").strip()
        mapping_id = (row.get("mapping_id") or "").strip()
        status = (row.get("status") or "").strip()
        if not ipa or not target or not mapping_id or status not in {"model-selected", "provisional"}:
            continue
        mappings[ipa] = {
            "mapping_id": mapping_id,
            "correspondence_ids": [mapping_id],
            "source_ipa": ipa,
            "target_grapheme": target,
            "status": status,
            "scope": (row.get("scope") or "ipa-sequence").strip(),
            "source_ref": (row.get("source_ref") or "").strip(),
            "notes": (row.get("notes") or "").strip(),
            "mapping_source": "ipa_target_overrides",
        }
        # An explicit reviewed override is the documented resolution for a
        # same-key conflict in the broader canonical correspondence table.
        conflicts.pop(ipa, None)

    return mappings, conflicts


_IPA_MAPPINGS, _IPA_MAPPING_CONFLICTS = _load_mappings()
_IPA_KEYS = tuple(sorted(_IPA_MAPPINGS, key=lambda value: (-len(value), value)))


def render_ipa_sequence_to_ukrainian(ipa: str, *, allow_provisional: bool = False) -> dict[str, Any]:
    """Render a source IPA sequence through the project's licensed target policy.

    Runtime input is IPA only. Hangul/Jamo are retained as provenance upstream,
    but are never consulted to choose a Ukrainian grapheme. Dots preserve
    syllable-boundary metadata and are not emitted in practical Ukrainian.
    Source vowel length remains in the returned IPA and trace metadata; it is
    deliberately not encoded in Ukrainian practical orthography. Provisional
    correspondences are withheld from final output unless the caller explicitly
    opts into research-candidate mode with allow_provisional=True.
    """
    if not isinstance(ipa, str):
        raise TypeError("IPA input must be a string")
    if not isinstance(allow_provisional, bool):
        raise TypeError("allow_provisional must be a bool")
    source_ipa = unicodedata.normalize("NFC", ipa.strip())
    if not source_ipa:
        return {
            "ipa": ipa,
            "status": "unavailable",
            "reason": "empty_ipa",
            "ukrainian_orthography": None,
            "segments": [],
            "ignored_source_markers": [],
        }
    if not _IPA_MAPPINGS:
        return {
            "ipa": source_ipa,
            "status": "unavailable",
            "reason": "local_correspondence_data_unavailable",
            "ukrainian_orthography": None,
            "segments": [],
            "ignored_source_markers": [],
        }

    ignored_markers = sorted(set("ː" for char in source_ipa if char == "ː"))
    lookup_ipa = source_ipa.replace("ː", "")
    output: list[str] = []
    trace: list[dict[str, Any]] = []
    i = 0
    syllable_index = 0
    word_index = 0

    while i < len(lookup_ipa):
        char = lookup_ipa[i]
        if char == ".":
            syllable_index += 1
            i += 1
            continue
        if char == "#" or char.isspace():
            if output and output[-1] != " ":
                output.append(" ")
            word_index += 1
            syllable_index = 0
            i += 1
            continue

        key = next((candidate for candidate in _IPA_KEYS if lookup_ipa.startswith(candidate, i)), None)
        if key is None:
            return {
                "ipa": source_ipa,
                "status": "unavailable",
                "reason": "unmapped_ipa_sequence",
                "ukrainian_orthography": None,
                "segments": trace,
                "unmapped_fragment": lookup_ipa[i:i + 12],
                "unmapped_offset": i,
                "ignored_source_markers": ignored_markers,
                "length_adaptation_status": (
                    "preserved-in-IPA-not-rendered-in-practical-orthography"
                    if ignored_markers else "not-marked"
                ),
            }

        if key in _IPA_MAPPING_CONFLICTS:
            return {
                "ipa": source_ipa,
                "status": "unavailable",
                "reason": "ambiguous_ipa_mapping",
                "ukrainian_orthography": None,
                "segments": trace,
                "unmapped_fragment": key,
                "unmapped_offset": i,
                "ignored_source_markers": ignored_markers,
                "mapping_conflict": _IPA_MAPPING_CONFLICTS[key],
            }

        mapping = _IPA_MAPPINGS[key]
        output.append(mapping["target_grapheme"])
        trace.append({
            "source_ipa": key,
            "target_grapheme": mapping["target_grapheme"],
            "mapping_id": mapping["mapping_id"],
            "correspondence_ids": list(mapping["correspondence_ids"]),
            "mapping_status": mapping["status"],
            "scope": mapping["scope"],
            "source_ref": mapping["source_ref"],
            "notes": mapping["notes"],
            "mapping_source": mapping["mapping_source"],
            "source_syllable_index": syllable_index,
            "source_word_index": word_index,
        })
        i += len(key)

    if not trace:
        return {
            "ipa": source_ipa,
            "status": "unavailable",
            "reason": "no_renderable_ipa_segments",
            "ukrainian_orthography": None,
            "segments": [],
            "ignored_source_markers": ignored_markers,
            "length_adaptation_status": (
                "preserved-in-IPA-not-rendered-in-practical-orthography"
                if ignored_markers else "not-marked"
            ),
            "renderer": "korean_ipa_correspondence",
            "score_type": "explicit_correspondence_not_probability",
        }

    overall_status = (
        "provisional"
        if any(item["mapping_status"] == "provisional" for item in trace)
        else "model-selected"
    )
    candidate_orthography = "".join(output)
    # A provisional target correspondence is useful for research comparison,
    # but must never be promoted to a production orthographic answer by default.
    if overall_status == "provisional" and not allow_provisional:
        return {
            "ipa": source_ipa,
            "status": "unavailable",
            "reason": "provisional_mapping_requires_review",
            "ukrainian_orthography": None,
            "candidate_orthography": candidate_orthography,
            "candidate_status": "provisional",
            "segments": trace,
            "ignored_source_markers": ignored_markers,
            "length_adaptation_status": (
                "preserved-in-IPA-not-rendered-in-practical-orthography"
                if ignored_markers else "not-marked"
            ),
            "renderer": "korean_ipa_correspondence",
            "score_type": "explicit_correspondence_not_probability",
        }
    return {
        "ipa": source_ipa,
        "status": overall_status,
        "reason": None,
        "ukrainian_orthography": "".join(output),
        "segments": trace,
        "ignored_source_markers": ignored_markers,
        "length_adaptation_status": (
            "preserved-in-IPA-not-rendered-in-practical-orthography"
            if ignored_markers else "not-marked"
        ),
        "renderer": "korean_ipa_correspondence",
        "score_type": "explicit_correspondence_not_probability",
    }


__all__ = ["render_ipa_sequence_to_ukrainian"]


# No IPA profile is currently approved for production target adaptation. This
# immutable allowlist is deliberately empty until phonetic adjudication,
# cross-runtime acceptance, and target-inventory review are complete.
_ADAPTER_COMPATIBLE_IPA_PROFILES: frozenset[str] = frozenset()


def render_profiled_ipa_to_ukrainian(
    source: str,
    ipa_result: dict[str, Any],
    *,
    allow_provisional: bool = False,
) -> dict[str, Any]:
    """Fail closed unless a complete, explicitly approved IPA profile is supplied.

    The raw-string renderer remains available for research and legacy callers.
    Production callers should pass the structured IPA result to this guard so
    unadjudicated or partial profiles cannot be mistaken for approved input.
    """
    if not isinstance(allow_provisional, bool):
        raise TypeError("allow_provisional must be a bool")
    if not isinstance(ipa_result, dict):
        return {
            "ipa": None, "status": "unavailable",
            "reason": "ipa_profile_result_required",
            "ukrainian_orthography": None, "segments": [],
            "ignored_source_markers": [],
        }
    ipa = ipa_result.get("ipa")
    profile = ipa_result.get("ipa_profile")
    version = ipa_result.get("ipa_profile_version")
    level = ipa_result.get("ipa_profile_level")
    profile_status = ipa_result.get("ipa_profile_status")
    base = {
        "ipa": ipa if isinstance(ipa, str) else None,
        "ipa_profile": profile,
        "ipa_profile_version": version,
        "ipa_profile_level": level,
        "ipa_profile_status": profile_status,
        "ukrainian_orthography": None,
        "segments": [],
        "ignored_source_markers": [],
        "status": "unavailable",
    }
    if (
        not isinstance(ipa, str) or not ipa.strip()
        or not isinstance(profile, str) or not profile
        or not isinstance(version, int) or isinstance(version, bool) or version < 1
        or not isinstance(level, str) or not level
        or not isinstance(profile_status, str) or not profile_status
    ):
        return {**base, "reason": "ipa_profile_metadata_incomplete"}
    if profile_status != "adjudicated-compatible":
        reason = (
            "ipa_profile_partial_research_only"
            if profile_status == "partial-research-only"
            else "ipa_profile_not_adjudicated_compatible"
        )
        return {**base, "reason": reason}
    profile_key = f"{profile}@{version}:{level}"
    if profile_key not in _ADAPTER_COMPATIBLE_IPA_PROFILES:
        return {**base, "reason": "ipa_profile_not_allowlisted_for_target_adapter"}
    adapted = render_ipa_sequence_to_ukrainian(
        ipa, allow_provisional=allow_provisional
    )
    return {
        **adapted,
        "ipa_profile": profile,
        "ipa_profile_version": version,
        "ipa_profile_level": level,
        "ipa_profile_status": profile_status,
    }
