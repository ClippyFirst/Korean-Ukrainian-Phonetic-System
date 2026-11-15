#!/usr/bin/env python3
"""Python/browser IPA parity audit (intermediate IPA, not final Ukrainian).

Builds a deterministic input set (official NIKL bracket examples from the local
norms file, every lexical key, and left-word x right-trigger phrase combinations),
runs the Python runtime (boundary_mode=phrase, the browser's whitespace proxy) and
the browser runtime, and classifies every discrepancy. Writes a JSON report.

Classification (rule-based, never silently forced to agree):
  equal                       identical IPA
  abstention-representation   one side withholds IPA/typed-unresolved, other side
                              exposes diagnostic IPA (documented contract)
  length-mark                 differ only by the length mark ː
  unreleased-mark             differ only by the unreleased diacritic ̚
  other                       needs manual classification (a candidate bug)
"""
from __future__ import annotations
import argparse, html, json, re, subprocess, sys, tempfile
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from korean_ukrainian.pipeline import LEXICAL_PRONUNCIATIONS, phoneticize_korean  # noqa: E402

HANGUL = re.compile(r"^[가-힣]+(?: [가-힣]+){0,2}$")
RIGHT_TRIGGERS = ["나무", "마을", "리본", "먹다", "가다"]


def official_examples() -> list[tuple[str, str]]:
    raw = (ROOT / "한국어 어문 규범.htm").read_text(encoding="utf8", errors="ignore")
    text = re.sub(r"<script.*?</script>|<style.*?</style>", "", raw, flags=re.S)
    text = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", text)))
    found = []
    for source, bracket in re.findall(r"([가-힣]+(?: [가-힣]+){0,2})\[([가-힣ː/]+)\]", text):
        if all(len(w) <= 6 for w in source.split(" ")):
            found.append((source, bracket.replace("ː", "")))
    return sorted(set(found))


def build_inputs() -> dict[str, list[str]]:
    official = [s for s, _ in official_examples()]
    lexical = [k for k in LEXICAL_PRONUNCIATIONS if HANGUL.match(k)]
    single = [k for k in lexical if " " not in k]
    combos = [f"{w} {r}" for w in single for r in RIGHT_TRIGGERS]
    return {"official": official, "lexicon": lexical, "phrase_combinations": combos}


def python_result(text: str) -> dict:
    r = phoneticize_korean(text, boundary_mode="phrase")
    return {"surface": r["surface_hangul"].replace(" ", ""), "ipa": r["ipa"]["ipa"],
            "status": r["ipa"]["status"], "unresolved": bool(r["unresolved_contexts"])}


def classify(py: dict, js: dict) -> str:
    if "error" in js:
        return "other"
    if py["ipa"] == js["ipa"]:
        return "equal"
    if py["unresolved"] or js["status"] == "unresolved" or not js["ipa"].strip():
        return "abstention-representation"
    strip = lambda s, ch: s.replace(ch, "")
    if strip(py["ipa"], "ː") == strip(js["ipa"], "ː"):
        return "length-mark"
    if strip(py["ipa"], "\u031a") == strip(js["ipa"], "\u031a"):
        return "unreleased-mark"
    return "other"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "reports" / "runtime-ipa-parity.json"))
    args = ap.parse_args()
    groups = build_inputs()
    every = sorted({t for g in groups.values() for t in g})
    with tempfile.TemporaryDirectory() as tmp:
        inp, outp = Path(tmp, "in.json"), Path(tmp, "out.json")
        inp.write_text(json.dumps(every, ensure_ascii=False), encoding="utf8")
        subprocess.run(["node", "--experimental-strip-types",
                        str(ROOT / "scripts/audit_runtime_ipa_parity.mjs"), str(inp), str(outp)], check=True)
        browser = json.loads(outp.read_text(encoding="utf8"))
    report = {"schema": "runtime-ipa-parity-v1", "python_boundary_mode": "phrase",
              "browser_mode": "strict", "groups": {}, "discrepancies": []}
    for name, items in groups.items():
        counts = Counter()
        for text in items:
            py, js = python_result(text), browser[text]
            kind = classify(py, js)
            counts[kind] += 1
            if kind != "equal":
                report["discrepancies"].append({"group": name, "input": text, "class": kind,
                                                "python": py, "browser": js})
        report["groups"][name] = {"inputs": len(items), "classes": dict(counts)}
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf8")
    print(json.dumps(report["groups"], ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
