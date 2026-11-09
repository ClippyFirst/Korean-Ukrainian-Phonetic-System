#!/usr/bin/env python3
"""Prepare reproducible, overlap-audited Korean IPA benchmark tracks.

K-SPAN's one-key transcription is checked against its published Worldbet field
and mapped to IPA using the K-SPAN documentation table. IPA-Dict is retained
as a Wiktionary-derived supplemental set, not an independent holdout.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import random
import re
import zipfile
from pathlib import Path, PurePosixPath
from typing import Any

HANGUL = re.compile(r"^[\uac00-\ud7a3]+$")

# K-SPAN 2.1 documentation: key -> Worldbet -> IPA.
KEY_TO_WORLDBET = {
    "q": "p", "Q": "p*", "v": "ph",
    "e": "t", "E": "t*", "x": "th",
    "r": "k", "R": "k*", "z": "kh",
    "w": "tc}", "W": "tc}*", "c": "tc}h",
    "t": "s", "T": "s*",
    "a": "m", "s": "n", "d": "N", "f": "l", "g": "h",
    "k": "a", "j": "^", "h": "o", "n": "u", "m": "ix", "l": "i",
    "o": "e", "p": "E",
    "1": "wa", "2": "w^", "3": "we", "4": "7", "5": "y",
    "6": "wE", "7": "ixi", "O": "je", "P": "jE",
    "i": "ja", "u": "j^", "y": "jo", "b": "ju", ":": ":",
}

WORLDBET_TO_IPA = {
    "tc}*": "tɕ͈", "tc}h": "tɕʰ", "tc}": "tɕ",
    "p*": "p͈", "t*": "t͈", "k*": "k͈", "s*": "s͈",
    "ph": "pʰ", "th": "tʰ", "kh": "kʰ",
    "ixi": "ii", "ix": "ɨ",
    "j^": "jʌ", "w^": "wʌ", "wE": "wɛ",
    "wa": "wa", "we": "we", "je": "je", "jE": "jɛ",
    "ja": "ja", "jo": "jo", "ju": "ju",
    "p": "p", "t": "t", "k": "k", "s": "s",
    "m": "m", "n": "n", "N": "ŋ", "l": "l", "h": "h",
    "a": "a", "^": "ʌ", "o": "o", "u": "u",
    "i": "i", "e": "e", "E": "ɛ", "7": "ø", "y": "y",
    ":": "ː",
}
_WORLDBET_KEYS = sorted(WORLDBET_TO_IPA, key=len, reverse=True)


def key_to_worldbet(value: str) -> str:
    value = str(value or "").strip()
    unknown = sorted(set(value) - set(KEY_TO_WORLDBET))
    if unknown:
        raise ValueError(f"unknown K-SPAN keystroke symbols: {unknown}")
    return "".join(KEY_TO_WORLDBET[ch] for ch in value)


def worldbet_to_ipa(value: str) -> str:
    value = "".join(str(value or "").split())
    out: list[str] = []
    index = 0
    while index < len(value):
        match = next((key for key in _WORLDBET_KEYS if value.startswith(key, index)), None)
        if match is None:
            raise ValueError(f"unmapped K-SPAN Worldbet sequence at offset {index}: {value[index:index+8]!r}")
        segment = WORLDBET_TO_IPA[match]
        index += len(match)
        # Worldbet's centralized diacritic is a postfix modifier (x).
        # Keep it attached to the preceding segment in IPA rather than
        # silently dropping it or treating it as an independent phone.
        if index < len(value) and value[index] == "x":
            segment += "\u033d"
            index += 1
        out.append(segment)
    return "".join(out)


def key_to_ipa(value: str) -> str:
    return worldbet_to_ipa(key_to_worldbet(value))


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _hangul_words_from_json(path: Path) -> set[str]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    words: set[str] = set()
    for row in rows:
        for token in row.get("tokens", []):
            word = token.get("canonical")
            if isinstance(word, str) and HANGUL.fullmatch(word):
                words.add(word)
    return words


def _decode_nikl_word_index(raw: bytes) -> dict[int, str]:
    """Decode NIKL's legacy text export without accepting mojibake.

    NIKL archives have circulated with Korean legacy encodings and UTF-16
    exports. Try BOM/byte-pattern-indicated Unicode encodings as well as
    CP949/EUC-KR, and accept a decode only when it yields numbered records.
    """
    candidates: list[str] = []
    if raw.startswith((b"\xff\xfe\x00\x00", b"\x00\x00\xfe\xff")):
        candidates.append("utf-32")
    elif raw.startswith(b"\xef\xbb\xbf"):
        candidates.append("utf-8-sig")
    elif raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        candidates.append("utf-16")
    else:
        # BOM-less UTF-16 exports commonly contain NULs in ASCII columns.
        even_nuls = sum(raw[index] == 0 for index in range(0, len(raw), 2))
        odd_nuls = sum(raw[index] == 0 for index in range(1, len(raw), 2))
        pairs = max(1, len(raw) // 2)
        if max(even_nuls, odd_nuls) / pairs > 0.10:
            candidates.extend(("utf-16-le", "utf-16-be"))
        candidates.extend(("cp949", "euc-kr", "utf-8-sig"))

    failures: list[str] = []
    for encoding in dict.fromkeys(candidates):
        try:
            decoded = raw.decode(encoding)
        except (UnicodeDecodeError, UnicodeError) as exc:
            failures.append(f"{encoding}: {exc}")
            continue

        by_record: dict[int, str] = {}
        for line in decoded.splitlines():
            fields = line.strip().split()
            if len(fields) < 3 or not fields[0].rstrip(".").isdigit():
                continue
            word = fields[2]
            if "\ufffd" in word or any(ord(char) < 0x20 for char in word):
                continue
            by_record[len(by_record) + 1] = word
        if by_record:
            return by_record
        failures.append(f"{encoding}: decoded text contained no numbered word records")

    detail = "; ".join(failures[-5:])
    raise ValueError(
        "cannot decode NIKL 일반어휘통계.txt into numbered word records "
        f"(tried {', '.join(dict.fromkeys(candidates))}); {detail}"
    )


def _read_nikl_word_index(archive_path: Path) -> dict[int, str]:
    with zipfile.ZipFile(archive_path) as archive:
        all_txt = [
            info for info in archive.infolist()
            if PurePosixPath(info.filename).name.lower().endswith(".txt")
        ]
        named = [
            info for info in all_txt
            if "일반어휘통계" in PurePosixPath(info.filename).name
        ]
        candidates = named or [info for info in all_txt if info.file_size >= 1_000_000]
        if not candidates:
            raise ValueError("NIKL archive does not contain the expected 일반어휘통계 TXT file")
        info = max(candidates, key=lambda item: item.file_size)
        raw = archive.read(info.filename)
    return _decode_nikl_word_index(raw)


def _load_kspan(path: Path, nikl_zip: Path, expected_rows: int | None = 63836) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    word_index = _read_nikl_word_index(nikl_zip)
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        header = stream.readline()
        delimiter = "\t" if header.count("\t") > header.count(",") else ","
        stream.seek(0)
        reader = csv.DictReader(stream, delimiter=delimiter)
        required = {"WordNum", "ModernKey", "ConservativeKey", "ModernPhon", "ConservativePhon"}
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            raise ValueError(f"K-SPAN schema missing fields: {sorted(required - set(reader.fieldnames or []))}")
        source_rows = list(reader)

    modern: list[dict[str, Any]] = []
    conservative: list[dict[str, Any]] = []
    unmatched_word_numbers: list[int] = []
    worldbet_mismatches: list[str] = []
    non_hangul = 0
    for source_row in source_rows:
        word_num = int(source_row["WordNum"])
        word = word_index.get(word_num)
        if not word:
            unmatched_word_numbers.append(word_num)
            continue
        if not HANGUL.fullmatch(word):
            non_hangul += 1
            continue
        for track, key_field, world_field, target in (
            ("modern", "ModernKey", "ModernPhon", modern),
            ("conservative", "ConservativeKey", "ConservativePhon", conservative),
        ):
            worldbet = key_to_worldbet(source_row[key_field])
            declared_worldbet = "".join(source_row[world_field].split())
            if worldbet != declared_worldbet:
                worldbet_mismatches.append(f"{word_num}:{track}:{worldbet}!={declared_worldbet}")
                continue
            try:
                ipa = worldbet_to_ipa(worldbet)
            except ValueError as exc:
                raise ValueError(
                    f"K-SPAN Worldbet conversion failed for WordNum {word_num} "
                    f"({track}, field={world_field}, value={worldbet!r}): {exc}"
                ) from exc
            if not ipa:
                raise ValueError(f"empty K-SPAN IPA for WordNum {word_num} ({track})")
            target.append({
                "id": f"kspan-{track}-{word_num}",
                "lang": "ko",
                "split": "test",
                "text": word,
                "canonical": word,
                "phonemes": ipa,
                "tokens": [{"canonical": word, "phoneme": ipa}],
            })

    if unmatched_word_numbers:
        raise ValueError(
            f"K-SPAN/NIKL join incomplete: {len(unmatched_word_numbers)} WordNum values missing; "
            f"first={unmatched_word_numbers[:10]}"
        )
    if worldbet_mismatches:
        raise ValueError(
            f"K-SPAN keystroke/Worldbet integrity check failed: {len(worldbet_mismatches)} mismatches; "
            f"first={worldbet_mismatches[:5]}"
        )
    if expected_rows is not None and len(source_rows) != expected_rows:
        raise ValueError(f"K-SPAN row-count drift: expected {expected_rows}, got {len(source_rows)}")
    metadata = {
        "source": "K-SPAN 2.1, kspan_base.csv (Dataverse file 1010), joined to NIKL MKUFS2 일반어휘통계.txt",
        "license": "K-SPAN CC0 1.0; NIKL MKUFS2 Korean Open Government License Type 1 (attribution)",
        "raw_rows": len(source_rows),
        "source_delimiter": delimiter,
        "matched_hangul_rows": len(modern),
        "non_hangul_rows": non_hangul,
        "unmatched_word_numbers": 0,
        "key_worldbet_integrity_mismatches": 0,
        "ipa_mapping": "kspan-worldbet-to-ipa-v1; based on official K-SPAN documentation table",
        "kspan_sha256": _sha256(path),
        "nikl_archive_sha256": _sha256(nikl_zip),
    }
    return modern, conservative, metadata


def _sample(rows: list[dict[str, Any]], sample_size: int, seed: int) -> list[dict[str, Any]]:
    return sorted(
        rows,
        key=lambda row: hashlib.sha256(f"{seed}|{row['id']}".encode("utf-8")).hexdigest(),
    )[:sample_size]


def _ipa_dict_rows(path: Path, excluded: set[str], sample_size: int, seed: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    grouped: dict[str, list[str]] = {}
    invalid = 0
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        if not line.strip() or "\t" not in line:
            continue
        word, raw_ipa = line.split("\t", 1)
        word = word.strip()
        if not HANGUL.fullmatch(word):
            invalid += 1
            continue
        ipa = raw_ipa.strip()
        if len(ipa) >= 2 and ipa[0] in "/[" and ipa[-1] in "/]":
            ipa = ipa[1:-1]
        variants = [part.strip().strip("/[]") for part in ipa.split(",") if part.strip().strip("/[]")]
        if not variants:
            invalid += 1
            continue
        grouped.setdefault(word, []).extend(variants)

    overlap = set(grouped) & excluded
    eligible = [
        {
            "id": f"ipa-dict-ko-{index:06d}",
            "lang": "ko",
            "split": "test",
            "text": word,
            "canonical": word,
            "phonemes": ", ".join(dict.fromkeys(variants)),
            "tokens": [{"canonical": word, "phoneme": ", ".join(dict.fromkeys(variants))}],
        }
        for index, (word, variants) in enumerate(sorted(grouped.items()), 1)
        if word not in excluded
    ]
    sampled = _sample(eligible, sample_size, seed)
    metadata = {
        "source": "open-dict-data/ipa-dict data/ko.txt at 972cd67dd5f96bc5660e28070cde26e3928abcd7",
        "license": "Korean data CC BY-SA (upstream IPA-Dict repository code/data wrapper MIT; Korean source retains upstream license)",
        "raw_hangul_word_types": len(grouped),
        "invalid_or_non_hangul_lines": invalid,
        "overlap_excluded_word_types": len(overlap),
        "eligible_word_types": len(eligible),
        "sampled_word_types": len(sampled),
        "lineage": "Korean Wiktionary via korean-word-ipa-dictionary; not an independent source from SIGMORPHON. Orthographic overlap with UGTPHON, SIGMORPHON, and K-SPAN is excluded.",
        "source_sha256": _sha256(path),
    }
    return sampled, metadata


def _seoul_rows(path: Path, sample_size: int, seed: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    pairs = json.loads(path.read_text(encoding="utf-8"))
    valid = [
        row for row in pairs
        if isinstance(row, dict)
        and isinstance(row.get("source"), str)
        and HANGUL.fullmatch(row["source"])
        and isinstance(row.get("gold"), str)
        and row["gold"].strip()
    ]
    if not valid:
        raise ValueError("Seoul IPA pair file contains no valid Hangul/IPA pairs")
    rng = random.Random(seed)
    selected = rng.choices(valid, weights=[max(1, int(row.get("weight", 1))) for row in valid], k=min(sample_size, sum(max(1, int(row.get("weight", 1))) for row in valid)))
    sampled = [
        {
            "id": f"seoul-ipa-sample-{index:06d}",
            "lang": "ko",
            "split": "test",
            "text": row["source"],
            "canonical": row["source"],
            "phonemes": row["gold"],
            "tokens": [{"canonical": row["source"], "phoneme": row["gold"]}],
        }
        for index, row in enumerate(selected, 1)
    ]
    metadata = {
        "source": "Seoul Corpus / OpenSLR SLR113, phoneme tier aligned to pWord.ortho.",
        "license": "CC BY-NC 2.0; aggregate-only reporting, no corpus text or IPA records uploaded",
        "reference_level": "phonemic word-level IPA, not narrow phonetic gold",
        "raw_unique_pairs": len(pairs),
        "eligible_unique_pairs": len(valid),
        "sampled_occurrences": len(sampled),
        "source_archive_sha256": "63c3f8ffa6976307a732689d6c5be7b2db4ec20f14bf276faf98c886add0d24b",
    }
    return sampled, metadata


def _write_rows(path: Path, rows: list[dict[str, Any]]) -> None:
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def prepare(
    kspan_csv: Path,
    nikl_zip: Path,
    ipa_dict: Path,
    ugtphon_json: Path,
    sigmorphon_json: Path,
    seoul_ipa_pairs: Path,
    output_dir: Path,
    sample_size: int = 1000,
    seed: int = 20261108,
    expected_kspan_rows: int | None = 63836,
) -> dict[str, Any]:
    if sample_size < 1:
        raise ValueError("sample_size must be >= 1")
    output_dir.mkdir(parents=True, exist_ok=True)
    ugt_words = _hangul_words_from_json(ugtphon_json)
    sig_words = _hangul_words_from_json(sigmorphon_json)
    baseline_excluded = ugt_words | sig_words

    kspan_modern, kspan_conservative, kspan_meta = _load_kspan(kspan_csv, nikl_zip, expected_kspan_rows)
    kspan_words = {row["canonical"] for row in kspan_modern}
    kspan_overlap = kspan_words & baseline_excluded
    kspan_modern_eligible = [row for row in kspan_modern if row["canonical"] not in baseline_excluded]
    kspan_conservative_eligible = [row for row in kspan_conservative if row["canonical"] not in baseline_excluded]
    kspan_modern_sample = _sample(kspan_modern_eligible, sample_size, seed)
    kspan_conservative_sample = _sample(kspan_conservative_eligible, sample_size, seed)
    ipa_sample, ipa_meta = _ipa_dict_rows(
        ipa_dict, baseline_excluded | kspan_words, sample_size, seed
    )
    seoul_sample, seoul_meta = _seoul_rows(seoul_ipa_pairs, sample_size, seed)

    outputs = {
        "kspan-modern.json": kspan_modern_sample,
        "kspan-conservative.json": kspan_conservative_sample,
        "ipa-dict-ko.json": ipa_sample,
        "seoul-ipa.json": seoul_sample,
    }
    for name, rows in outputs.items():
        if not rows:
            raise ValueError(f"prepared benchmark track is empty: {name}")
        _write_rows(output_dir / name, rows)

    manifest = {
        "schema_version": 1,
        "sample_size_requested": sample_size,
        "sampling_seed": seed,
        "baseline_overlap_exclusion": {
            "ugtphon_unique_hangul_words": len(ugt_words),
            "sigmorphon_unique_hangul_words": len(sig_words),
            "baseline_unique_words": len(baseline_excluded),
        },
        "kspan": {
            **kspan_meta,
            "overlap_excluded_word_types": len(kspan_overlap),
            "eligible_word_types": len(kspan_modern_eligible),
            "sampled_modern_word_types": len(kspan_modern_sample),
            "sampled_conservative_word_types": len(kspan_conservative_sample),
        },
        "ipa_dict": ipa_meta,
        "seoul": seoul_meta,
        "tracks": {name: len(rows) for name, rows in outputs.items()},
        "limitations": [
            "K-SPAN is a lexical surface-phonetic database; modern and conservative references are separate tracks, not two independent datasets.",
            "IPA-Dict Korean is Wiktionary-derived and not an independent holdout from SIGMORPHON; exact orthographic overlap is excluded.",
            "Seoul Corpus gold is phonemic and word-aligned; it is not narrow phonetic gold and is CC BY-NC 2.0.",
            "This preparation does not score Ukrainian target orthography.",
        ],
    }
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--kspan-csv", type=Path, required=True)
    parser.add_argument("--nikl-zip", type=Path, required=True)
    parser.add_argument("--ipa-dict", type=Path, required=True)
    parser.add_argument("--ugtphon-json", type=Path, required=True)
    parser.add_argument("--sigmorphon-json", type=Path, required=True)
    parser.add_argument("--seoul-ipa-pairs", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--sample-size", type=int, default=1000)
    parser.add_argument("--seed", type=int, default=20261108)
    args = parser.parse_args()
    manifest = prepare(
        args.kspan_csv, args.nikl_zip, args.ipa_dict, args.ugtphon_json,
        args.sigmorphon_json, args.seoul_ipa_pairs, args.output_dir,
        args.sample_size, args.seed,
    )
    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
