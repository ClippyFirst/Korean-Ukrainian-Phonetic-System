"""Versioned typed result contract for Korean Extended IPA profiles."""
from __future__ import annotations
from typing import Any
from .ipa_segments import parse_ipa_segments

SCHEMA_VERSION = "1.2"

PROFILE_REGISTRY = {
    "phonemic": {"profile_id": "clippyfirst-korean-phonemic-v1", "profile_version": 1,
                 "status": "available-research-representation",
                 "evidence_status": "underlying-contrast-representation", "target_compatible": False},
    "broad": {"profile_id": "clippyfirst-korean-broad-v1", "profile_version": 1,
              "status": "rule-supported-broad",
              "evidence_status": "mixed-normative-and-project-derived", "target_compatible": False},
    "narrow": {"profile_id": "clippyfirst-korean-narrow-contextual-allophones-v12", "profile_version": 12,
               "status": "partial-research-only",
               "evidence_status": "source-scoped-hypotheses-require-independent-review", "target_compatible": False},
}



def _segments_for_layer(ipa: str | None, trace: list[dict[str, Any]], level: str) -> list[dict[str, Any]]:
    if not isinstance(ipa, str) or not ipa:
        return []
    output: list[dict[str, Any]] = []
    cursor = 0
    for item in trace:
        if not isinstance(item, dict) or item.get("layer") != level or not isinstance(item.get("ipa"), str) or not item["ipa"]:
            continue
        value = item["ipa"]
        points = list(ipa)
        value_points = list(value)
        start = next((i for i in range(cursor, len(points) - len(value_points) + 1)
                      if points[i:i + len(value_points)] == value_points), None)
        if start is None:
            continue
        tokens = parse_ipa_segments(
            value,
            source_span=item.get("source_span"),
            provenance={
                "rule_ids": item.get("rule_ids", []),
                "evidence_refs": item.get("evidence_refs", []),
                "evidence_status": item.get("evidence_status", "not-attributed"),
                "environment": item.get("environment"),
            },
            ipa_offset=start,
        )
        output.extend(tokens)
        cursor = start + len(value_points)
    full_tokens = parse_ipa_segments(ipa)
    expected = [token for token in full_tokens if token["kind"] in {"segment", "unknown"}]
    actual = [token for token in output if token["kind"] in {"segment", "unknown"}]
    covered = [(token["kind"], token["ipa"]) for token in actual] == [
        (token["kind"], token["ipa"]) for token in expected
    ]
    if output and covered:
        existing_boundaries = {token["ipa_span"]["start"] for token in output if token["kind"] == "boundary"}
        output.extend(token for token in full_tokens
                      if token["kind"] == "boundary" and token["ipa_span"]["start"] not in existing_boundaries)
        output.sort(key=lambda token: token["ipa_span"]["start"])
        counters = {"segment": 0, "boundary": 0, "unknown": 0}
        for token in output:
            kind = token["kind"]
            counters[kind] += 1
            token["id"] = f"{kind}-{counters[kind]:04d}"
        return output
    return parse_ipa_segments(ipa)



def _validate_segment_tokens(segments: Any, ipa: Any, source_text: str, path: str) -> list[str]:
    errors: list[str] = []
    if not isinstance(segments, list):
        return [f"{path}.segments must be an array"]
    ipa_points = list(ipa) if isinstance(ipa, str) else []
    source_length = len(source_text)
    seen_ids: set[str] = set()
    previous_end = 0
    for index, token in enumerate(segments):
        item_path = f"{path}.segments[{index}]"
        if not isinstance(token, dict):
            errors.append(f"{item_path} must be an object")
            continue
        token_id, kind, value = token.get("id"), token.get("kind"), token.get("ipa")
        if not isinstance(token_id, str) or not token_id:
            errors.append(f"{item_path}.id must be a non-empty string")
        elif token_id in seen_ids:
            errors.append(f"{path}.segments IDs must be unique")
        else:
            seen_ids.add(token_id)
        if kind not in {"segment", "boundary", "unknown"}:
            errors.append(f"{item_path}.kind is invalid")
        if not isinstance(value, str) or not value:
            errors.append(f"{item_path}.ipa must be a non-empty string")
            continue
        span = token.get("ipa_span")
        if (not isinstance(span, dict) or set(span) != {"start", "end"}
                or not isinstance(span.get("start"), int) or isinstance(span.get("start"), bool)
                or not isinstance(span.get("end"), int) or isinstance(span.get("end"), bool)
                or span["start"] < 0 or span["end"] <= span["start"]):
            errors.append(f"{item_path}.ipa_span is invalid")
            continue
        if span["end"] > len(ipa_points) or ipa_points[span["start"]:span["end"]] != list(value):
            errors.append(f"{item_path}.ipa_span does not select its IPA text")
        if span["start"] < previous_end:
            errors.append(f"{item_path}.ipa_span overlaps or is out of order")
        previous_end = max(previous_end, span["end"])
        if kind == "segment":
            if not isinstance(token.get("base"), str) or not isinstance(token.get("modifiers"), list) or not all(isinstance(mark, str) for mark in token["modifiers"]):
                errors.append(f"{item_path} requires base and string modifiers")
            if not isinstance(token.get("features"), dict) or not isinstance(token["features"].get("major_class"), str):
                errors.append(f"{item_path}.features is invalid")
            source_span = token.get("source_span")
            if source_span is not None and (
                not isinstance(source_span, dict) or set(source_span) != {"start", "end"}
                or not isinstance(source_span.get("start"), int) or isinstance(source_span.get("start"), bool)
                or not isinstance(source_span.get("end"), int) or isinstance(source_span.get("end"), bool)
                or source_span["start"] < 0 or source_span["end"] <= source_span["start"]
                or source_span["end"] > source_length
            ):
                errors.append(f"{item_path}.source_span is invalid")
            expected_alignment = "syllable-span" if source_span is not None else "unavailable"
            if token.get("source_alignment") != expected_alignment:
                errors.append(f"{item_path}.source_alignment does not match source_span")
            provenance = token.get("provenance")
            if (not isinstance(provenance, dict)
                    or not isinstance(provenance.get("rule_ids"), list)
                    or not all(isinstance(value, str) for value in provenance.get("rule_ids", []))
                    or not isinstance(provenance.get("evidence_refs"), list)
                    or not all(isinstance(value, str) for value in provenance.get("evidence_refs", []))
                    or not isinstance(provenance.get("evidence_status"), str)
                    or (provenance.get("environment") is not None and not isinstance(provenance.get("environment"), str))):
                errors.append(f"{item_path}.provenance is invalid")
        elif kind == "boundary" and token.get("boundary") not in {"word", "syllable", "separator"}:
            errors.append(f"{item_path}.boundary is invalid")
        elif kind == "unknown" and not isinstance(token.get("reason"), str):
            errors.append(f"{item_path}.reason is required")
    return errors


def validate_extended_ipa_result(result: dict[str, Any]) -> list[str]:
    """Return contract violations without requiring a runtime schema package."""
    errors: list[str] = []
    if not isinstance(result, dict):
        return ["result must be an object"]
    required = {"schema_version", "mode", "source", "layers", "variants",
                "boundaries", "trace", "target_adapter", "pronunciation_status", "context", "acoustic_annotations"}
    missing = sorted(required - result.keys())
    if missing:
        return ["missing required fields: " + ", ".join(missing)]
    if result["schema_version"] != SCHEMA_VERSION:
        errors.append("unsupported schema_version")
    if result["mode"] != "extended-ipa":
        errors.append("mode must be extended-ipa")
    source = result["source"]
    if not isinstance(source, dict) or not isinstance(source.get("text"), str):
        errors.append("source.text must be a string")
    elif source.get("offset_unit") != "unicode-code-points":
        errors.append("source.offset_unit must be unicode-code-points")
    layers = result["layers"]
    if not isinstance(layers, dict) or set(layers) != {"phonemic", "broad", "narrow"}:
        errors.append("layers must contain exactly phonemic, broad and narrow")
    else:
        for level, layer in layers.items():
            if not isinstance(layer, dict):
                errors.append(f"layers.{level} must be an object")
                continue
            if layer.get("level") != level:
                errors.append(f"layers.{level}.level mismatch")
            if layer.get("ipa") is not None and not isinstance(layer.get("ipa"), str):
                errors.append(f"layers.{level}.ipa must be a string or null")
            if not isinstance(layer.get("status"), str):
                errors.append(f"layers.{level}.status must be a string")
            if not isinstance(layer.get("target_compatible"), bool):
                errors.append(f"layers.{level}.target_compatible must be boolean")
            source_text = source.get("text", "") if isinstance(source, dict) and isinstance(source.get("text"), str) else ""
            errors.extend(_validate_segment_tokens(layer.get("segments"), layer.get("ipa"), source_text, f"layers.{level}"))
    if isinstance(layers, dict):
        for level, layer in layers.items():
            if isinstance(layer, dict) and not isinstance(layer.get("segments"), list):
                errors.append(f"layers.{level}.segments must be an array")
    for name in ("variants", "boundaries", "trace"):
        if not isinstance(result[name], list):
            errors.append(f"{name} must be an array")
    if isinstance(result["trace"], list):
        for item in result["trace"]:
            if not isinstance(item, dict) or item.get("layer") not in {"phonemic", "broad", "narrow"}:
                errors.append("every trace item requires a valid IPA layer")
    context = result["context"]
    context_fields = {
        "speaker_id", "dialect", "age_group", "speech_style",
        "speech_rate_syllables_per_second", "focus", "prosodic_position",
        "recording_conditions",
    }
    if not isinstance(context, dict) or set(context) != context_fields:
        errors.append("context must contain all nullable speaker/prosody fields")
    else:
        for field in context_fields - {"focus", "speech_rate_syllables_per_second"}:
            if context[field] is not None and not isinstance(context[field], str):
                errors.append(f"context.{field} must be a string or null")
        if context["focus"] is not None and not isinstance(context["focus"], bool):
            errors.append("context.focus must be boolean or null")
        rate = context["speech_rate_syllables_per_second"]
        if rate is not None and (not isinstance(rate, (int, float)) or isinstance(rate, bool) or rate < 0):
            errors.append("context speech rate must be a non-negative number or null")
    annotations = result["acoustic_annotations"]
    if not isinstance(annotations, list):
        errors.append("acoustic_annotations must be an array")
    else:
        for annotation in annotations:
            if not isinstance(annotation, dict):
                errors.append("acoustic annotation must be an object")
                continue
            required_annotation = {"feature", "value", "unit", "source_span", "measurement_method", "evidence_refs", "status"}
            if not required_annotation.issubset(annotation):
                errors.append("acoustic annotation is missing required fields")
                continue
            if annotation.get("status") not in {"measured", "derived", "unavailable", "hypothesis"}:
                errors.append("acoustic annotation status is invalid")
            if annotation.get("value") is not None and (
                not isinstance(annotation.get("value"), (int, float)) or isinstance(annotation.get("value"), bool)
            ):
                errors.append("acoustic annotation value must be numeric or null")
            if not isinstance(annotation.get("unit"), str) or not isinstance(annotation.get("evidence_refs"), list):
                errors.append("acoustic annotation unit and evidence_refs have invalid types")
            if annotation.get("status") == "measured" and (
                not annotation.get("measurement_method")
                or not annotation.get("evidence_refs")
                or annotation.get("source_span") is None
            ):
                errors.append("measured acoustic annotations require a method and evidence reference")
    target = result["target_adapter"]
    if not isinstance(target, dict) or target.get("input_layer") not in {"phonemic", "broad", "narrow", "none"}:
        errors.append("target_adapter.input_layer is invalid")
    if isinstance(target, dict) and target.get("input_layer") == "narrow":
        narrow = layers.get("narrow", {}) if isinstance(layers, dict) else {}
        if narrow.get("target_compatible") is not True and target.get("status") not in {
            "unavailable", "not-run-for-extended-profile", "blocked"
        }:
            errors.append("non-compatible narrow IPA must not be marked as adapted")
    return errors


def build_extended_ipa_result(source: str, layers: dict[str, dict[str, Any]], *,
                              variants: list[dict[str, Any]] | None = None,
                              boundaries: list[dict[str, Any]] | None = None,
                              trace: list[dict[str, Any]] | None = None,
                              pronunciation_status: str = "unadjudicated",
                              target_adapter: dict[str, Any] | None = None) -> dict[str, Any]:
    """Build and validate a JSON-compatible Extended IPA result."""
    result = {
        "schema_version": SCHEMA_VERSION, "mode": "extended-ipa",
        "source": {"text": source, "offset_unit": "unicode-code-points"},
        "layers": layers, "variants": variants or [], "boundaries": boundaries or [],
        "trace": trace or [],
        "target_adapter": target_adapter or {
            "status": "not-run-by-phoneticizer", "input_layer": "none", "profile_id": None
        },
        "pronunciation_status": pronunciation_status,
        "context": {
            "speaker_id": None, "dialect": None, "age_group": None,
            "speech_style": None, "speech_rate_syllables_per_second": None,
            "focus": None, "prosodic_position": None, "recording_conditions": None,
        },
        "acoustic_annotations": [],
    }
    for level, layer in result["layers"].items():
        layer["segments"] = _segments_for_layer(layer.get("ipa"), result["trace"], level)
    errors = validate_extended_ipa_result(result)
    if errors:
        raise ValueError("invalid Extended IPA result: " + "; ".join(errors))
    return result
