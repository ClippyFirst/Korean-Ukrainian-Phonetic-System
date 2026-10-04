#!/usr/bin/env python3
"""Generate the Korean → Ukrainian multi-level research data corpus.

Canonical data source:
    data/korean/canonical_correspondence.csv

This generator deliberately separates:
    1. grapheme/Jamo inventory;
    2. exhaustive modern Hangul syllable-block inventory;
    3. contextual sequence data;
    4. rule registry;
    5. provenance;
    6. machine-generated validation.

The 11,172 Hangul rows are a Unicode combinatorial inventory. The generator
does not invent lexical attestations, contextual pronunciations, narrow IPA,
or Ukrainian normative spellings that are not present in source data.

CSV is the canonical derived format. XLSX is optional presentation output.

Usage:
    python scripts/generate_korean_corpus.py --strict
    python scripts/generate_korean_corpus.py --strict --xlsx
    python scripts/generate_korean_corpus.py --strict --output-dir data/derived
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Mapping, Sequence


SCRIPT_VERSION = "0.7.0"
HANGUL_BASE = 0xAC00
HANGUL_END = 0xD7A3
L_BASE = 0x1100
V_BASE = 0x1161
T_BASE = 0x11A7
L_COUNT = 19
V_COUNT = 21
T_COUNT = 28
N_COUNT = V_COUNT * T_COUNT
S_COUNT = L_COUNT * N_COUNT

# Modern compatibility-Jamo inventories. These are ordered according to the
# Unicode Hangul syllable decomposition model.
L_COMPAT = tuple("ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ")
V_COMPAT = tuple("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ")
T_COMPAT = (
    "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
    "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
)

STATUS_VALUES = {
    "draft", "example", "verified", "validated", "deprecated",
    "tbd", "unknown", "model-selected", "structural-null",
    "canonical_isolated_syllable", "contextual",
}
CONFIDENCE_VALUES = {"low", "medium", "high", "unknown", ""}

GRAPHEME_FIELDS = [
    "grapheme_id",
    "grapheme",
    "jamo",
    "type",
    "unicode_codepoint",
    "unicode_name",
    "phonological_value",
    "phonological_class",
    "initial_realization",
    "intervocalic_realization",
    "before_consonant_realization",
    "final_realization",
    "before_nasal_realization",
    "before_liquid_realization",
    "before_i_j_realization",
    "surface_ipa",
    "ukrainian_phonetic_target",
    "ukrainian_graphemic_target",
    "rule_ids",
    "source_ids",
    "status",
    "confidence",
    "notes",
]

SYLLABLE_FIELDS = [
    "syllable_id",
    "syllable",
    "codepoint",
    "unicode_name",
    "canonical_decomposition",
    "onset",
    "nucleus",
    "coda",
    "onset_canonical_jamo",
    "nucleus_canonical_jamo",
    "coda_canonical_jamo",
    "onset_index",
    "nucleus_index",
    "coda_index",
    "structure",
    "syllable_position",
    "phonological_form",
    "surface_ipa",
    "contextual_realization",
    "ukrainian_phonetic_target",
    "ukrainian_graphemic_target",
    "rule_ids",
    "source_ids",
    "status",
    "confidence",
    "notes",
]

SEQUENCE_FIELDS = [
    "sequence_id",
    "word_or_phrase",
    "previous_syllable",
    "current_syllable",
    "next_syllable",
    "current_onset",
    "current_nucleus",
    "current_coda",
    "environment",
    "phonological_input",
    "applied_rule_ids",
    "surface_ipa",
    "ukrainian_phonetic_target",
    "ukrainian_graphemic_target",
    "source_ids",
    "status",
    "confidence",
    "notes",
]

RULE_FIELDS = [
    "rule_id",
    "process_name",
    "description",
    "environment",
    "input",
    "output",
    "ipa_effect",
    "ukrainian_target_effect",
    "cross_syllable",
    "morphological_license",
    "priority",
    "source_ids",
    "status",
    "confidence",
    "notes",
]

SOURCE_FIELDS = [
    "source_id",
    "title",
    "author_or_organization",
    "year",
    "url",
    "source_type",
    "scope",
    "notes",
]

VALIDATION_FIELDS = [
    "check_id",
    "category",
    "check",
    "expected",
    "actual",
    "status",
    "severity",
    "details",
]

MANIFEST_FIELDS = [
    "artifact",
    "path",
    "sha256",
    "rows",
    "source_of_truth",
]


@dataclass(frozen=True)
class ValidationResult:
    check_id: str
    category: str
    check: str
    expected: str
    actual: str
    status: str
    severity: str
    details: str = ""

    def as_row(self) -> dict[str, str]:
        return {
            "check_id": self.check_id,
            "category": self.category,
            "check": self.check,
            "expected": self.expected,
            "actual": self.actual,
            "status": self.status,
            "severity": self.severity,
            "details": self.details,
        }


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def normalize_header(value: str) -> str:
    value = unicodedata.normalize("NFKC", value or "").strip().lower()
    value = re.sub(r"[^a-z0-9_]+", "_", value)
    return value.strip("_")


def clean(value: object) -> str:
    if value is None:
        return ""
    return str(value).strip()


def split_ids(value: object) -> list[str]:
    text = clean(value)
    if not text:
        return []
    parts = re.split(r"[;,|\s]+", text)
    return [part for part in parts if part]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_csv(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        raw_headers = list(reader.fieldnames or [])
        headers = [clean(h) for h in raw_headers]
        rows: list[dict[str, str]] = []
        for raw in reader:
            row = {headers[i]: clean(raw.get(raw_headers[i], "")) for i in range(len(headers))}
            rows.append(row)
    return rows, headers


def write_csv(path: Path, fields: Sequence[str], rows: Iterable[Mapping[str, object]]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(fields), extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({field: clean(row.get(field, "")) for field in fields})
            count += 1
    return count


def canonical_jamo_from_indices(l_index: int, v_index: int, t_index: int) -> tuple[str, str, str]:
    onset = chr(L_BASE + l_index)
    nucleus = chr(V_BASE + v_index)
    coda = chr(T_BASE + t_index) if t_index else ""
    return onset, nucleus, coda


def compatibility_jamo(canonical: str) -> str:
    if not canonical:
        return ""
    return unicodedata.normalize("NFKC", canonical)


def compose_hangul(l_index: int, v_index: int, t_index: int) -> str:
    if not (0 <= l_index < L_COUNT):
        raise ValueError(f"invalid L index: {l_index}")
    if not (0 <= v_index < V_COUNT):
        raise ValueError(f"invalid V index: {v_index}")
    if not (0 <= t_index < T_COUNT):
        raise ValueError(f"invalid T index: {t_index}")
    return chr(HANGUL_BASE + (l_index * V_COUNT + v_index) * T_COUNT + t_index)


def decompose_hangul(syllable: str) -> tuple[int, int, int]:
    if len(syllable) != 1 or not HANGUL_BASE <= ord(syllable) <= HANGUL_END:
        raise ValueError(f"not a modern precomposed Hangul syllable: {syllable!r}")
    index = ord(syllable) - HANGUL_BASE
    return index // N_COUNT, (index % N_COUNT) // T_COUNT, index % T_COUNT


def generate_syllable_inventory() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []

    for l_index in range(L_COUNT):
        for v_index in range(V_COUNT):
            for t_index in range(T_COUNT):
                syllable = compose_hangul(l_index, v_index, t_index)
                onset_c, nucleus_c, coda_c = canonical_jamo_from_indices(
                    l_index, v_index, t_index
                )
                onset = compatibility_jamo(onset_c)
                nucleus = compatibility_jamo(nucleus_c)
                coda = compatibility_jamo(coda_c)

                canonical = unicodedata.normalize("NFD", syllable)
                structure = "CVC" if coda else "CV"

                rows.append({
                    "syllable_id": f"S-{ord(syllable):04X}",
                    "syllable": syllable,
                    "codepoint": f"U+{ord(syllable):04X}",
                    "unicode_name": unicodedata.name(syllable, ""),
                    "canonical_decomposition": " ".join(
                        f"U+{ord(ch):04X}" for ch in canonical
                    ),
                    "onset": onset,
                    "nucleus": nucleus,
                    "coda": coda,
                    "onset_canonical_jamo": onset_c,
                    "nucleus_canonical_jamo": nucleus_c,
                    "coda_canonical_jamo": coda_c,
                    "onset_index": str(l_index),
                    "nucleus_index": str(v_index),
                    "coda_index": str(t_index),
                    "structure": structure,
                    # Context is intentionally unknown for an isolated block.
                    "syllable_position": "isolated_block",
                    "phonological_form": "",
                    "surface_ipa": "",
                    "contextual_realization": "",
                    "ukrainian_phonetic_target": "",
                    "ukrainian_graphemic_target": "",
                    "rule_ids": "",
                    "source_ids": "",
                    "status": "generated_inventory",
                    "confidence": "high",
                    "notes": (
                        "Unicode-combinatorial inventory row; not a lexical "
                        "attestation and not a connected-speech pronunciation."
                    ),
                })

    return rows


def load_canonical_mapping(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    rows, headers = read_csv(path)
    required = {"layer", "input", "ipa", "ukrainian", "status", "scope", "notes"}
    missing = required - set(headers)
    if missing:
        raise ValueError(
            f"{path} is missing required canonical correspondence columns: "
            + ", ".join(sorted(missing))
        )
    return rows, headers


def index_canonical_mapping(
    rows: Sequence[Mapping[str, str]],
) -> tuple[dict[tuple[str, str], dict[str, str]], list[str]]:
    mapping: dict[tuple[str, str], dict[str, str]] = {}
    errors: list[str] = []

    for line_no, row in enumerate(rows, start=2):
        layer = clean(row.get("layer"))
        key = clean(row.get("input"))

        # The historical placeholder row is deliberately ignored.
        if layer == "coda" and not key:
            continue

        if not layer or not key:
            errors.append(f"line {line_no}: empty layer/input")
            continue

        index = (layer, key)
        if index in mapping:
            errors.append(f"line {line_no}: duplicate canonical key {index!r}")
            continue

        mapping[index] = {k: clean(v) for k, v in row.items()}

    return mapping, errors


def build_graphemes(
    canonical: Mapping[tuple[str, str], Mapping[str, str]],
) -> list[dict[str, str]]:
    inventory: dict[tuple[str, str], dict[str, str]] = {}

    # Onsets and vowels are direct modern compatibility-Jamo inventories.
    for index, jamo in enumerate(L_COMPAT):
        inventory[("onset", jamo)] = {
            "type": "onset",
            "index": str(index),
        }

    for index, jamo in enumerate(V_COMPAT):
        inventory[("vowel", jamo)] = {
            "type": "vowel",
            "index": str(index),
        }

    # Codas include complex clusters as orthographic final units.
    for index, jamo in enumerate(T_COMPAT):
        if jamo:
            inventory[("coda", jamo)] = {
                "type": "coda",
                "index": str(index),
            }

    rows: list[dict[str, str]] = []

    for (layer, jamo), meta in sorted(
        inventory.items(), key=lambda item: (item[0][0], int(item[1]["index"]))
    ):
        c = canonical.get((layer, jamo), {})
        canonical_target = clean(c.get("ukrainian"))
        ipa = clean(c.get("ipa"))

        # Compatibility Jamo can be decomposed into multiple characters for
        # complex codas. The Unicode name is still useful as an inventory
        # descriptor, while context-specific realizations remain blank unless
        # documented in a dedicated source layer.
        name = unicodedata.name(jamo[0], "") if jamo else ""

        rows.append({
            "grapheme_id": f"{layer[0].upper()}-{meta['index']}-{ord(jamo[0]):04X}",
            "grapheme": jamo,
            "jamo": jamo,
            "type": layer,
            "unicode_codepoint": " ".join(f"U+{ord(ch):04X}" for ch in jamo),
            "unicode_name": name,
            "phonological_value": ipa,
            "phonological_class": (
                "complex_coda" if layer == "coda" and len(jamo) > 1
                else "vowel" if layer == "vowel"
                else "consonant"
            ),
            "initial_realization": "",
            "intervocalic_realization": "",
            "before_consonant_realization": "",
            "final_realization": ipa if layer == "coda" else "",
            "before_nasal_realization": "",
            "before_liquid_realization": "",
            "before_i_j_realization": "",
            "surface_ipa": "",
            "ukrainian_phonetic_target": canonical_target,
            "ukrainian_graphemic_target": canonical_target,
            "rule_ids": "",
            "source_ids": "",
            "status": clean(c.get("status")) or "unknown",
            "confidence": "unknown",
            "notes": clean(c.get("notes")),
        })

    return rows


def merge_canonical_into_syllables(
    syllables: list[dict[str, str]],
    canonical: Mapping[tuple[str, str], Mapping[str, str]],
) -> None:
    for row in syllables:
        onset = row["onset"]
        nucleus = row["nucleus"]
        coda = row["coda"]

        onset_row = canonical.get(("onset", onset), {})
        vowel_row = canonical.get(("vowel", nucleus), {})
        coda_row = canonical.get(("coda", coda), {}) if coda else {}

        onset_ipa = clean(onset_row.get("ipa"))
        vowel_ipa = clean(vowel_row.get("ipa"))
        coda_ipa = clean(coda_row.get("ipa"))

        onset_ua = clean(onset_row.get("ukrainian"))
        vowel_ua = clean(vowel_row.get("ukrainian"))
        coda_ua = clean(coda_row.get("ukrainian"))

        # These are explicitly canonical isolated-syllable projections. They
        # are not surface pronunciations in connected speech.
        row["phonological_form"] = "".join(
            part for part in (onset_ipa, vowel_ipa, coda_ipa) if part
        )
        row["surface_ipa"] = row["phonological_form"]
        row["ukrainian_phonetic_target"] = "".join(
            part for part in (onset_ua, vowel_ua, coda_ua) if part
        )
        row["ukrainian_graphemic_target"] = row["ukrainian_phonetic_target"]
        row["status"] = "canonical_isolated_syllable"
        row["confidence"] = "unknown"

        source_layers = [
            clean(onset_row.get("source_ids")),
            clean(vowel_row.get("source_ids")),
            clean(coda_row.get("source_ids")),
        ]
        row["source_ids"] = ";".join(
            dict.fromkeys(
                sid
                for value in source_layers
                for sid in split_ids(value)
            )
        )


def read_optional_table(
    path: Path,
    fields: Sequence[str],
) -> tuple[list[dict[str, str]], list[str], str | None]:
    if not path.exists():
        return [], list(fields), None

    rows, headers = read_csv(path)
    return rows, headers, str(path)


def validate_headers(
    path: Path,
    actual: Sequence[str],
    expected: Sequence[str],
    check_id: str,
    required: bool = True,
) -> ValidationResult:
    missing = sorted(set(expected) - set(actual))
    if missing:
        return ValidationResult(
            check_id,
            "schema",
            f"required columns in {path.name}",
            "all required columns present",
            f"missing: {', '.join(missing)}",
            "FAIL" if required else "WARN",
            "critical" if required else "warning",
        )
    return ValidationResult(
        check_id,
        "schema",
        f"required columns in {path.name}",
        "all required columns present",
        "all present",
        "PASS",
        "critical",
    )


def validate_unique(
    rows: Sequence[Mapping[str, str]],
    key: str,
    check_id: str,
    label: str,
) -> ValidationResult:
    values = [clean(row.get(key)) for row in rows]
    duplicates = [value for value, count in Counter(values).items() if value and count > 1]
    empty = sum(1 for value in values if not value)

    if duplicates or empty:
        details = []
        if duplicates:
            details.append(f"duplicates={duplicates[:10]}")
        if empty:
            details.append(f"empty={empty}")
        return ValidationResult(
            check_id,
            "integrity",
            f"unique non-empty {label}",
            "no duplicates and no empty keys",
            f"duplicates={len(duplicates)}, empty={empty}",
            "FAIL",
            "critical",
            "; ".join(details),
        )

    return ValidationResult(
        check_id,
        "integrity",
        f"unique non-empty {label}",
        f"{len(values)} unique values",
        f"{len(values)} unique values",
        "PASS",
        "critical",
    )


def validate_hangul_inventory(
    rows: Sequence[Mapping[str, str]],
) -> list[ValidationResult]:
    results: list[ValidationResult] = []

    results.append(ValidationResult(
        "HANGUL-001",
        "inventory",
        "modern precomposed Hangul row count",
        str(S_COUNT),
        str(len(rows)),
        "PASS" if len(rows) == S_COUNT else "FAIL",
        "critical",
    ))

    syllables = [clean(row.get("syllable")) for row in rows]
    unique = len(set(syllables))
    results.append(ValidationResult(
        "HANGUL-002",
        "inventory",
        "unique syllable count",
        str(S_COUNT),
        str(unique),
        "PASS" if unique == S_COUNT else "FAIL",
        "critical",
    ))

    invalid = [
        s for s in syllables
        if len(s) != 1 or not HANGUL_BASE <= ord(s) <= HANGUL_END
    ]
    results.append(ValidationResult(
        "HANGUL-003",
        "unicode",
        "every generated row is a modern precomposed Hangul syllable",
        "0 invalid rows",
        str(len(invalid)),
        "PASS" if not invalid else "FAIL",
        "critical",
        f"examples={invalid[:5]}" if invalid else "",
    ))

    roundtrip_errors: list[str] = []
    nfd_errors: list[str] = []

    for row in rows:
        syllable = row["syllable"]
        l, v, t = decompose_hangul(syllable)
        if compose_hangul(l, v, t) != syllable:
            roundtrip_errors.append(syllable)

        nfd = unicodedata.normalize("NFD", syllable)
        if not (len(nfd) == 2 + bool(t)):
            nfd_errors.append(syllable)

    results.append(ValidationResult(
        "HANGUL-004",
        "decomposition",
        "Hangul decomposition/composition round-trip",
        "0 errors",
        str(len(roundtrip_errors)),
        "PASS" if not roundtrip_errors else "FAIL",
        "critical",
        f"examples={roundtrip_errors[:5]}" if roundtrip_errors else "",
    ))

    results.append(ValidationResult(
        "HANGUL-005",
        "unicode",
        "NFD decomposition length",
        "2 for open syllables / 3 for syllables with coda",
        str(len(nfd_errors)),
        "PASS" if not nfd_errors else "FAIL",
        "critical",
        f"examples={nfd_errors[:5]}" if nfd_errors else "",
    ))

    expected_first = chr(HANGUL_BASE)
    expected_last = chr(HANGUL_END)
    actual_first = syllables[0] if syllables else ""
    actual_last = syllables[-1] if syllables else ""

    results.append(ValidationResult(
        "HANGUL-006",
        "inventory",
        "inventory boundary",
        f"{expected_first} … {expected_last}",
        f"{actual_first} … {actual_last}",
        "PASS" if (actual_first, actual_last) == (expected_first, expected_last) else "FAIL",
        "critical",
    ))

    return results


def validate_rule_foreign_keys(
    rows: Sequence[Mapping[str, str]],
    rules: Sequence[Mapping[str, str]],
    source_id: str,
    field_names: Sequence[str],
) -> list[ValidationResult]:
    results: list[ValidationResult] = []
    rule_ids = {
        clean(row.get("rule_id"))
        for row in rules
        if clean(row.get("rule_id"))
    }

    source_ids = {
        clean(row.get("source_id"))
        for row in rules
        if clean(row.get("source_id"))
    }
    # The second set is intentionally not used as a source registry; source
    # rows are validated separately below.

    referenced_rules: set[str] = set()
    for row in rows:
        for field in field_names:
            referenced_rules.update(split_ids(row.get(field)))

    unknown_rules = sorted(referenced_rules - rule_ids)
    results.append(ValidationResult(
        f"{source_id}-RULE-FK",
        "foreign_key",
        "referenced rule IDs exist in rules.csv",
        "0 unknown rule IDs",
        str(len(unknown_rules)),
        "PASS" if not unknown_rules else "FAIL",
        "critical",
        f"unknown={unknown_rules[:20]}" if unknown_rules else "",
    ))

    return results


def validate_status_confidence(
    rows: Sequence[Mapping[str, str]],
    source_id: str,
) -> list[ValidationResult]:
    results: list[ValidationResult] = []

    bad_status = sorted({
        clean(row.get("status"))
        for row in rows
        if clean(row.get("status")) and clean(row.get("status")) not in STATUS_VALUES
    })
    results.append(ValidationResult(
        f"{source_id}-STATUS",
        "schema",
        "status vocabulary",
        "known status values",
        str(bad_status) if bad_status else "all known",
        "PASS" if not bad_status else "WARN",
        "warning",
        "Unknown values are retained; extend STATUS_VALUES only after deciding the controlled vocabulary.",
    ))

    bad_conf = sorted({
        clean(row.get("confidence"))
        for row in rows
        if clean(row.get("confidence")) not in CONFIDENCE_VALUES
    })
    results.append(ValidationResult(
        f"{source_id}-CONF",
        "schema",
        "confidence vocabulary",
        "low|medium|high|unknown|empty",
        str(bad_conf) if bad_conf else "all known",
        "PASS" if not bad_conf else "WARN",
        "warning",
    ))

    return results


def validate_source_foreign_keys(
    rows: Sequence[Mapping[str, str]],
    sources: Sequence[Mapping[str, str]],
    source_id: str,
    fields: Sequence[str],
) -> list[ValidationResult]:
    known = {
        clean(row.get("source_id"))
        for row in sources
        if clean(row.get("source_id"))
    }
    referenced: set[str] = set()
    for row in rows:
        for field in fields:
            referenced.update(split_ids(row.get(field)))

    unknown = sorted(referenced - known)

    return [ValidationResult(
        f"{source_id}-SOURCE-FK",
        "foreign_key",
        "referenced source IDs exist in sources.csv",
        "0 unknown source IDs",
        str(len(unknown)),
        "PASS" if not unknown else "FAIL",
        "critical",
        f"unknown={unknown[:20]}" if unknown else "",
    )]


def validate_canonical_coverage(
    canonical: Mapping[tuple[str, str], Mapping[str, str]],
) -> list[ValidationResult]:
    expected_onsets = set(L_COMPAT)
    expected_vowels = set(V_COMPAT)
    expected_codas = set(T_COMPAT[1:])

    actual_onsets = {
        key for layer, key in canonical if layer == "onset"
    }
    actual_vowels = {
        key for layer, key in canonical if layer == "vowel"
    }
    actual_codas = {
        key for layer, key in canonical if layer == "coda"
    }

    checks = [
        ("CANON-001", "onset", expected_onsets, actual_onsets),
        ("CANON-002", "vowel", expected_vowels, actual_vowels),
        ("CANON-003", "coda", expected_codas, actual_codas),
    ]

    results: list[ValidationResult] = []
    for check_id, layer, expected, actual in checks:
        missing = sorted(expected - actual)
        extra = sorted(actual - expected)
        ok = not missing and not extra
        results.append(ValidationResult(
            check_id,
            "canonical_mapping",
            f"canonical {layer} inventory coverage",
            f"{len(expected)} expected",
            f"{len(actual)} present",
            "PASS" if ok else "FAIL",
            "critical",
            f"missing={missing}; extra={extra}" if not ok else "",
        ))
    return results


def load_optional_context(
    data_dir: Path,
) -> tuple[
    list[dict[str, str]],
    list[dict[str, str]],
    list[dict[str, str]],
    dict[str, list[dict[str, str]]],
]:
    paths = {
        "sequences": data_dir / "sequences.csv",
        "rules": data_dir / "rules.csv",
        "sources": data_dir / "sources.csv",
    }

    tables: dict[str, list[dict[str, str]]] = {}
    for name, path in paths.items():
        if path.exists():
            tables[name], _ = read_csv(path)
        else:
            tables[name] = []

    return (
        tables["sequences"],
        tables["rules"],
        tables["sources"],
        tables,
    )


def make_empty_or_passthrough(
    rows: Sequence[Mapping[str, str]],
    fields: Sequence[str],
) -> list[dict[str, str]]:
    return [
        {field: clean(row.get(field, "")) for field in fields}
        for row in rows
    ]


def build_manifest(
    output_dir: Path,
    artifact_paths: Sequence[tuple[str, Path, int, str]],
) -> list[dict[str, str]]:
    rows = []
    for artifact, path, count, source in artifact_paths:
        rows.append({
            "artifact": artifact,
            "path": path.as_posix(),
            "sha256": sha256_file(path),
            "rows": str(count),
            "source_of_truth": source,
        })
    return rows


def build_readme(
    output_dir: Path,
    manifest: Sequence[Mapping[str, str]],
    validation: Sequence[ValidationResult],
    include_xlsx: bool,
) -> str:
    failed = sum(1 for item in validation if item.status == "FAIL")
    warnings = sum(1 for item in validation if item.status == "WARN")

    lines = [
        "Korean → Ukrainian Phonetic System — generated research corpus",
        "",
        f"Generator version: {SCRIPT_VERSION}",
        "Canonical source of truth: data/korean/canonical_correspondence.csv",
        "",
        "Architecture:",
        "  KOR_ORTH → KOR_PHON → KOR_PHON_RULES → KOR_IPA → "
        "UA_PHONETIC_TARGET → UA_ORTHOGRAPHY",
        "",
        "Derived levels:",
        "  1. Graphemes/Jamo — inventory and correspondence metadata.",
        "  2. Syllables — exhaustive 19 × 21 × 28 = 11,172 modern "
        "precomposed Hangul blocks.",
        "  3. Sequences — contextual word/phrase data supplied separately.",
        "  4. Rules — contextual phonological process registry supplied separately.",
        "  5. Sources — provenance registry.",
        "",
        "Scientific boundary:",
        "  The 11,172 syllables are a Unicode-combinatorial inventory, "
        "not a lexical dictionary.",
        "  Generated isolated-syllable IPA/UA values are a presentation/model "
        "projection and do not replace contextual phonology.",
        "  Missing contextual evidence is left empty rather than fabricated.",
        "  No separate established-Ukrainian-norm layer is generated.",
        "",
        f"Validation: FAIL={failed}; WARN={warnings}",
        "",
        "Artifacts:",
    ]

    for row in manifest:
        lines.append(
            f"  {row['artifact']}: {row['path']} "
            f"(rows={row['rows']}, sha256={row['sha256']})"
        )

    if include_xlsx:
        lines.extend([
            "",
            "XLSX is a presentation export only; CSV remains canonical.",
        ])

    return "\n".join(lines) + "\n"


def write_xlsx(
    path: Path,
    sheets: Sequence[tuple[str, Sequence[str], Sequence[Mapping[str, object]]]],
) -> None:
    try:
        from openpyxl import Workbook
        from openpyxl.styles import Alignment, Font, PatternFill
        from openpyxl.worksheet.table import Table, TableStyleInfo
    except ImportError as exc:
        raise RuntimeError(
            "XLSX export requires openpyxl. Install with: "
            "python -m pip install openpyxl"
        ) from exc

    wb = Workbook()
    wb.remove(wb.active)

    for sheet_name, fields, rows in sheets:
        ws = wb.create_sheet(sheet_name[:31])
        ws.append(list(fields))

        for row in rows:
            ws.append([clean(row.get(field, "")) for field in fields])

        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions
        ws.sheet_view.showGridLines = False

        for cell in ws[1]:
            cell.font = Font(bold=True)
            cell.fill = PatternFill("solid", fgColor="D9E1F2")
            cell.alignment = Alignment(
                horizontal="center",
                vertical="center",
                wrap_text=True,
            )

        for row in ws.iter_rows(min_row=2):
            for cell in row:
                cell.alignment = Alignment(
                    vertical="top",
                    wrap_text=True,
                )

        for column_cells in ws.columns:
            values = [clean(cell.value) for cell in column_cells]
            width = min(max(max((len(v) for v in values), default=10) + 2, 10), 55)
            ws.column_dimensions[column_cells[0].column_letter].width = width

        if ws.max_row >= 2 and ws.max_column >= 1:
            ref = f"A1:{ws.cell(ws.max_row, ws.max_column).coordinate}"
            table_name = re.sub(r"[^A-Za-z0-9_]", "_", sheet_name) + "Table"
            table = Table(displayName=table_name, ref=ref)
            table.tableStyleInfo = TableStyleInfo(
                name="TableStyleMedium2",
                showFirstColumn=False,
                showLastColumn=False,
                showRowStripes=True,
                showColumnStripes=False,
            )
            ws.add_table(table)

    # Avoid embedding a changing generation timestamp in the workbook.
    from datetime import datetime

    fixed = datetime(2000, 1, 1)
    wb.properties.created = fixed
    wb.properties.modified = fixed
    wb.properties.title = "Korean → Ukrainian Phonetic System"
    wb.properties.subject = "Research data export"
    wb.properties.creator = "ClippyFirst"
    wb.properties.description = (
        "CSV-derived multi-level Korean → Ukrainian phonetic-graphemic corpus."
    )

    path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate Korean → Ukrainian multi-level research CSV corpus."
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=repo_root() / "data/korean",
        help="Canonical/source data directory.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=repo_root() / "data/derived",
        help="Derived artifact directory.",
    )
    parser.add_argument(
        "--xlsx",
        action="store_true",
        help="Also generate an XLSX presentation export.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit non-zero on validation FAIL and WARN results.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    data_dir = args.data_dir.resolve()
    output_dir = args.output_dir.resolve()
    canonical_path = data_dir / "canonical_correspondence.csv"

    if not canonical_path.exists():
        print(f"ERROR: canonical source not found: {canonical_path}", file=sys.stderr)
        return 2

    try:
        canonical_rows, canonical_headers = load_canonical_mapping(canonical_path)
        canonical, canonical_errors = index_canonical_mapping(canonical_rows)
    except Exception as exc:
        print(f"ERROR: cannot read canonical correspondence: {exc}", file=sys.stderr)
        return 2

    syllables = generate_syllable_inventory()
    merge_canonical_into_syllables(syllables, canonical)
    graphemes = build_graphemes(canonical)

    sequence_rows, rule_rows, source_rows, _ = load_optional_context(data_dir)
    sequences = make_empty_or_passthrough(sequence_rows, SEQUENCE_FIELDS)
    rules = make_empty_or_passthrough(rule_rows, RULE_FIELDS)
    sources = make_empty_or_passthrough(source_rows, SOURCE_FIELDS)

    output_dir.mkdir(parents=True, exist_ok=True)

    generated: list[tuple[str, Path, int, str]] = []

    grapheme_path = output_dir / "korean_graphemes.csv"
    syllable_path = output_dir / "korean_syllables_11172.csv"
    sequence_path = output_dir / "korean_ukrainian_sequences.csv"
    rule_path = output_dir / "korean_rules.csv"
    source_path = output_dir / "korean_sources.csv"

    generated.append((
        "graphemes",
        grapheme_path,
        write_csv(grapheme_path, GRAPHEME_FIELDS, graphemes),
        "generated from canonical_correspondence.csv + Unicode Jamo inventory",
    ))
    generated.append((
        "syllables",
        syllable_path,
        write_csv(syllable_path, SYLLABLE_FIELDS, syllables),
        "Unicode modern Hangul inventory + canonical_correspondence.csv",
    ))
    generated.append((
        "sequences",
        sequence_path,
        write_csv(sequence_path, SEQUENCE_FIELDS, sequences),
        "data/korean/sequences.csv (if supplied)",
    ))
    generated.append((
        "rules",
        rule_path,
        write_csv(rule_path, RULE_FIELDS, rules),
        "data/korean/rules.csv (if supplied)",
    ))
    generated.append((
        "sources",
        source_path,
        write_csv(source_path, SOURCE_FIELDS, sources),
        "data/korean/sources.csv (if supplied)",
    ))

    validation: list[ValidationResult] = []

    if canonical_errors:
        validation.append(ValidationResult(
            "CANON-000",
            "canonical_mapping",
            "canonical correspondence indexing",
            "0 indexing errors",
            str(len(canonical_errors)),
            "FAIL",
            "critical",
            "; ".join(canonical_errors[:20]),
        ))
    else:
        validation.append(ValidationResult(
            "CANON-000",
            "canonical_mapping",
            "canonical correspondence indexing",
            "0 indexing errors",
            "0",
            "PASS",
            "critical",
        ))

    validation.extend(validate_canonical_coverage(canonical))
    validation.extend(validate_hangul_inventory(syllables))
    validation.append(validate_unique(
        graphemes, "grapheme_id", "GRAPHEME-001", "grapheme IDs"
    ))
    validation.append(validate_unique(
        syllables, "syllable", "SYLLABLE-001", "Hangul syllables"
    ))
    validation.append(validate_unique(
        syllables, "syllable_id", "SYLLABLE-002", "syllable IDs"
    ))

    if rule_rows:
        validation.append(validate_headers(
            data_dir / "rules.csv",
            list(rule_rows[0]),
            RULE_FIELDS,
            "RULE-001",
        ))
        validation.append(validate_unique(
            rules, "rule_id", "RULE-002", "rule IDs"
        ))
    else:
        validation.append(ValidationResult(
            "RULE-000",
            "availability",
            "contextual rule registry availability",
            "rules.csv supplied for a complete contextual layer",
            "rules.csv not supplied",
            "WARN",
            "warning",
            "The generator does not invent contextual rules.",
        ))

    if sequence_rows:
        validation.append(validate_headers(
            data_dir / "sequences.csv",
            list(sequence_rows[0]),
            SEQUENCE_FIELDS,
            "SEQUENCE-001",
        ))
        validation.append(validate_unique(
            sequences, "sequence_id", "SEQUENCE-002", "sequence IDs"
        ))
    else:
        validation.append(ValidationResult(
            "SEQUENCE-000",
            "availability",
            "contextual sequence data availability",
            "sequences.csv supplied for lexical/contextual coverage",
            "sequences.csv not supplied",
            "WARN",
            "warning",
            "The generator does not invent lexical attestations.",
        ))

    if source_rows:
        validation.append(validate_headers(
            data_dir / "sources.csv",
            list(source_rows[0]),
            SOURCE_FIELDS,
            "SOURCE-001",
        ))
        validation.append(validate_unique(
            sources, "source_id", "SOURCE-002", "source IDs"
        ))
    else:
        validation.append(ValidationResult(
            "SOURCE-000",
            "availability",
            "provenance registry availability",
            "sources.csv supplied for complete source linkage",
            "sources.csv not supplied",
            "WARN",
            "warning",
            "Existing source references are preserved; no source records are fabricated.",
        ))

    if rules:
        validation.extend(validate_rule_foreign_keys(
            graphemes,
            rules,
            "GRAPHEME",
            ["rule_ids"],
        ))
        validation.extend(validate_rule_foreign_keys(
            syllables,
            rules,
            "SYLLABLE",
            ["rule_ids"],
        ))
        validation.extend(validate_rule_foreign_keys(
            sequences,
            rules,
            "SEQUENCE",
            ["applied_rule_ids"],
        ))

    if sources:
        validation.extend(validate_source_foreign_keys(
            graphemes,
            sources,
            "GRAPHEME",
            ["source_ids"],
        ))
        validation.extend(validate_source_foreign_keys(
            syllables,
            sources,
            "SYLLABLE",
            ["source_ids"],
        ))
        validation.extend(validate_source_foreign_keys(
            sequences,
            sources,
            "SEQUENCE",
            ["source_ids"],
        ))
        validation.extend(validate_source_foreign_keys(
            rules,
            sources,
            "RULE",
            ["source_ids"],
        ))

    # Canonical headers are recorded for provenance/audit purposes.
    validation.append(ValidationResult(
        "CANON-SCHEMA",
        "schema",
        "canonical correspondence schema",
        "layer,input,ipa,ukrainian,status,scope,notes",
        ",".join(canonical_headers),
        "PASS" if set({
            "layer", "input", "ipa", "ukrainian", "status", "scope", "notes"
        }).issubset(canonical_headers) else "FAIL",
        "critical",
    ))

    validation_path = output_dir / "korean_validation.csv"
    validation_count = write_csv(
        validation_path,
        VALIDATION_FIELDS,
        [item.as_row() for item in validation],
    )
    generated.append((
        "validation",
        validation_path,
        validation_count,
        "machine-generated validation",
    ))

    # Manifest is intentionally generated last so it contains hashes for all
    # preceding artifacts. It does not include itself, avoiding a recursive hash.
    manifest_path = output_dir / "korean_manifest.csv"
    manifest_rows = build_manifest(output_dir, generated)
    manifest_count = write_csv(manifest_path, MANIFEST_FIELDS, manifest_rows)

    readme_path = output_dir / "README.md"
    readme_path.write_text(
        build_readme(output_dir, manifest_rows, validation, args.xlsx),
        encoding="utf-8",
    )

    xlsx_path: Path | None = None
    if args.xlsx:
        xlsx_path = output_dir / "Korean_Ukrainian_Phonetic_System.xlsx"
        xlsx_sheets = [
            ("README", ["field", "value"], [
                {"field": "generator_version", "value": SCRIPT_VERSION},
                {"field": "canonical_source", "value": "data/korean/canonical_correspondence.csv"},
                {"field": "hangul_inventory", "value": "19 × 21 × 28 = 11,172"},
                {"field": "scientific_boundary", "value": "Unicode-combinatorial inventory; contextual data separate"},
            ]),
            ("Graphemes", GRAPHEME_FIELDS, graphemes),
            ("Syllables", SYLLABLE_FIELDS, syllables),
            ("Sequences", SEQUENCE_FIELDS, sequences),
            ("Rules", RULE_FIELDS, rules),
            ("Sources", SOURCE_FIELDS, sources),
            ("Validation", VALIDATION_FIELDS, [item.as_row() for item in validation]),
            ("Manifest", MANIFEST_FIELDS, manifest_rows),
        ]
        write_xlsx(xlsx_path, xlsx_sheets)

    failures = [item for item in validation if item.status == "FAIL"]
    warnings = [item for item in validation if item.status == "WARN"]

    print(f"generator={SCRIPT_VERSION}")
    print(f"canonical={canonical_path}")
    print(f"output_dir={output_dir}")
    print(f"graphemes={len(graphemes)}")
    print(f"syllables={len(syllables)}")
    print(f"sequences={len(sequences)}")
    print(f"rules={len(rules)}")
    print(f"sources={len(sources)}")
    print(f"validation_fail={len(failures)}")
    print(f"validation_warn={len(warnings)}")
    print(f"manifest={manifest_path}")
    print(f"readme={readme_path}")
    if xlsx_path:
        print(f"xlsx={xlsx_path}")

    if failures:
        print("\nFAILURES:", file=sys.stderr)
        for item in failures:
            print(
                f"  [{item.check_id}] {item.check}: {item.details or item.actual}",
                file=sys.stderr,
            )

    if warnings:
        print("\nWARNINGS:")
        for item in warnings:
            print(f"  [{item.check_id}] {item.check}: {item.details or item.actual}")

    if failures or (args.strict and warnings):
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
