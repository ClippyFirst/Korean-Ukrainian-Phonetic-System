#!/usr/bin/env python3
"""Error-pattern analysis of the Python engine against the pinned UGTPHON Korean test split.

Diagnostic only. UGTPHON's reference is a narrower phonetic transcription than the
project's broad profile, so most mismatches are notation differences, not
phonological errors. This script separates them with an EXPLICIT, conservative
equivalence table and reports (a) segment confusions on raw mismatches and (b) the
residual after the table is applied. The table is an analysis choice, not a claim
that the pairs are phonologically identical, and aspiration on stops is never
relaxed (it is phonemic in Korean).

Usage: PYTHONPATH=src python scripts/analyze_ugtphon_ko_errors.py --corpus ko-test.json
The corpus is Apache-2.0 (naver-ai/UGTPHON) and is deliberately not stored in this repository.
"""
from __future__ import annotations
import argparse, json, re, sys, unicodedata
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import benchmark_ugtphon_ko as B  # noqa: E402

# Reference-only allophonic or notation variants mapped onto the broad profile.
EQUIVALENT_SYMBOLS = {
    "ɭ": "l", "ʎ": "l",                   # lateral allophones
    "ɦ": "h", "ç": "h", "ʝ": "h", "β": "h", "x": "h", "ɸ": "h",  # h-region allophones
    "ɲ": "n", "ɕ": "s",                   # palatalized before [i]/[j]
    "ʷ": "", "ˈ": "",                     # labialization / stress marks not in the broad profile
    "ɥ": "y",                             # ㅟ as diphthong vs monophthong (both permitted, NIKL §4)
}


def relax_reference_conventions(value: str) -> str:
    value = unicodedata.normalize("NFC", value)
    value = re.sub(r"([kptc])[xç]", lambda m: m.group(1) + "ʰ", value)  # fricative-released aspiration
    # Weak aspiration after a fricative only; never after the affricate [tɕʰ] (ㅊ).
    value = re.sub(r"(?<!t)([sɕ])ʰ", r"\1", value)
    return "".join(EQUIVALENT_SYMBOLS.get(ch, ch) for ch in value)


def align(a: str, b: str) -> list[tuple[str, str]]:
    n, m = len(a), len(b)
    d = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1): d[i][0] = i
    for j in range(m + 1): d[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            d[i][j] = min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] != b[j-1]))
    i, j, ops = n, m, []
    while i or j:
        if i and j and d[i][j] == d[i-1][j-1] + (a[i-1] != b[j-1]):
            if a[i-1] != b[j-1]: ops.append((a[i-1], b[j-1]))
            i -= 1; j -= 1
        elif i and d[i][j] == d[i-1][j] + 1:
            ops.append((a[i-1], "∅")); i -= 1
        else:
            ops.append(("∅", b[j-1])); j -= 1
    return ops


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--top", type=int, default=15)
    args = ap.parse_args()
    from korean_ukrainian.pipeline import phoneticize_korean
    rows = B.load_corpus(Path(args.corpus))
    scored = mismatched = 0
    raw, residual, residual_tokens = Counter(), Counter(), []
    for row in rows:
        for token in row["tokens"]:
            text = token.get("canonical", "")
            if not B._HANGUL_TOKEN.fullmatch(text) or not str(token.get("phoneme", "")).strip():
                continue
            result = phoneticize_korean(text)
            if result.get("pronunciation_status") == "unresolved":
                continue
            predicted = B.normalize_ipa(result["ipa"]["ipa"])
            golds = [B.normalize_ipa(x) for x in token["phoneme"].split(",") if x.strip()]
            if not golds:
                continue
            scored += 1
            best = min(golds, key=lambda g: B.edit_distance(predicted, g))
            if predicted == best:
                continue
            mismatched += 1
            raw.update(align(predicted, best))
            rp, rg = relax_reference_conventions(predicted), relax_reference_conventions(best)
            if rp != rg:
                residual.update(align(rp, rg)); residual_tokens.append((text, predicted, best))
    print(json.dumps({"scored_tokens": scored, "raw_mismatched_tokens": mismatched,
                      "residual_after_documented_equivalences": len(residual_tokens)}, ensure_ascii=False))
    print("raw top confusions (pred -> gold):", raw.most_common(args.top))
    print("residual top confusions:", residual.most_common(args.top))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
