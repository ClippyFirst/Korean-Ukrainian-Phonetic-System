#!/usr/bin/env python3
"""Surface-form accuracy of both runtimes on the official NIKL bracket examples.

Gold = the bracketed pronunciations printed in the local 한국어 어문 규범.htm
(official attestations of the standard-pronunciation rules). This measures the
engines' surface pronunciation against those attestations; it is NOT an
independent IPA gold and says nothing about IPA symbols. Examples whose bracket
lists alternatives ('/') accept any listed form. Length marks and spaces are
ignored because the norm prints length (ː) inconsistently and the runtimes keep
spaces in different positions.

LIMITATION: the gold is extracted from running text by pattern, not curated per
article. Spot checks show some bracketed forms belong to a different rule context
than the bare input (e.g. spelling-contrast examples), so the absolute exact-match
counts are NOT an accuracy claim. The script is valid as a before/after
differential (items fixed / regressed between two checkouts), which does not
depend on gold quality.

--root selects the source tree (default: this repository) so the same script
can be run on a baseline checkout for a before/after comparison.
"""
from __future__ import annotations
import argparse, html, json, re, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
BRACKET = re.compile(r"([가-힣]+(?:[- ][가-힣]+){0,2})\[([가-힣ː/]+)\]")


def official(root: Path):
    raw = (root / "한국어 어문 규범.htm").read_text(encoding="utf8", errors="ignore")
    text = re.sub(r"<script.*?</script>|<style.*?</style>", "", raw, flags=re.S)
    text = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", text)))
    seen, out = set(), []
    for source, bracket in BRACKET.findall(text):
        # A hyphen marks a compound boundary in the norm; the input is unhyphenated.
        source = source.replace("-", "")
        if any(len(w) > 6 for w in source.split(" ")):
            continue
        golds = tuple(sorted({g.replace("ː", "") for g in bracket.split("/") if g}))
        if (source, golds) not in seen:
            seen.add((source, golds)); out.append((source, golds))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=str(HERE))
    ap.add_argument("--out")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    sys.path.insert(0, str(root / "src"))
    from korean_ukrainian.pipeline import phoneticize_korean
    items = official(root)
    inputs = sorted({s for s, _ in items})
    with tempfile.TemporaryDirectory() as tmp:
        inp, outp = Path(tmp, "i.json"), Path(tmp, "o.json")
        inp.write_text(json.dumps(inputs, ensure_ascii=False), encoding="utf8")
        # The browser half is the audit helper from the same tree when present.
        helper = root / "scripts" / "audit_runtime_ipa_parity.mjs"
        if not helper.exists():
            helper = HERE / "scripts" / "audit_runtime_ipa_parity.mjs"
        subprocess.run(["node", "--experimental-strip-types", str(helper), str(inp), str(outp)],
                       check=True, cwd=root)
        js = json.loads(outp.read_text(encoding="utf8"))
    rows, tally = [], {"python": 0, "browser": 0, "both": 0}
    for source, golds in items:
        py = phoneticize_korean(source, boundary_mode="phrase")["surface_hangul"].replace(" ", "")
        b = (js[source].get("surface") or source).replace(" ", "")
        okp, okb = py in golds, b in golds
        tally["python"] += okp; tally["browser"] += okb; tally["both"] += okp and okb
        if not (okp and okb):
            rows.append({"input": source, "gold": list(golds), "python": py, "browser": b,
                         "python_ok": okp, "browser_ok": okb})
    report = {"examples": len(items), "python_exact": tally["python"], "browser_exact": tally["browser"],
              "both_exact": tally["both"], "mismatches": rows}
    if args.out:
        Path(args.out).write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf8")
    print(json.dumps({k: v for k, v in report.items() if k != "mismatches"}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
