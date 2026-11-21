#!/usr/bin/env python3
"""Evaluate Python (and optionally browser) surface against curated NIKL gold.

Internal gold from the norm; not independent validation.
"""
from __future__ import annotations
import argparse, json, re, sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]

def load_gold(path: Path):
    data = json.loads(path.read_text(encoding="utf8"))
    return [r for r in data if r.get("curation", {}).get("status") == "curated"]

def surface_match(got: str, forms: list[str]) -> bool:
    if not got: return False
    g = got.replace("ː", "").replace(" ", "")
    return any(g == f.replace("ː", "").replace(" ", "") for f in forms)

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--gold", default=str(HERE / "data/korean/nikl_gold_curated_priority.json"))
    ap.add_argument("--out")
    args = ap.parse_args()
    sys.path.insert(0, str(HERE / "src"))
    from korean_ukrainian.pipeline import phoneticize_korean

    gold = load_gold(Path(args.gold))
    by_art = defaultdict(lambda: {"n":0, "resolved":0, "abstained":0, "exact":0, "permitted_ok":0})
    mismatches = []
    for rec in gold:
        art = rec["article"]
        src = rec["source"]
        forms = [b["form"] for b in rec["bracket_forms"]]
        permitted = any(b["permitted"] for b in rec["bracket_forms"])
        by_art[art]["n"] += 1
        try:
            r = phoneticize_korean(src, boundary_mode="phrase")
            ipa = r.get("ipa")
            if isinstance(ipa, dict):
                ipa = ipa.get("ipa")
            status = r.get("pronunciation_status") or r.get("status") or ""
            # Prefer surface if available
            surface = r.get("surface_hangul") or ""
            if not surface and isinstance(r.get("surface_syllables"), list):
                surface = "".join(r["surface_syllables"])
        except Exception as e:
            surface, status, ipa = "", f"error:{e}", None
        if status and "unresolved" in str(status).lower():
            by_art[art]["abstained"] += 1
            continue
        by_art[art]["resolved"] += 1
        ok = surface_match(surface, forms)
        if ok:
            by_art[art]["exact"] += 1
            if permitted: by_art[art]["permitted_ok"] += 1
        else:
            mismatches.append({"article": art, "source": src, "expected": forms, "got_surface": surface, "ipa": ipa, "status": status})

    report = {"articles": {}, "total_n": 0, "total_resolved": 0, "total_exact": 0, "mismatches": mismatches}
    for art in sorted(by_art):
        s = by_art[art]
        cov = s["resolved"] / s["n"] if s["n"] else 0
        prec = s["exact"] / s["resolved"] if s["resolved"] else 0
        report["articles"][str(art)] = {**s, "coverage": round(cov,4), "precision_at_resolved": round(prec,4)}
        report["total_n"] += s["n"]
        report["total_resolved"] += s["resolved"]
        report["total_exact"] += s["exact"]
    if report["total_resolved"]:
        report["overall_precision_at_resolved"] = round(report["total_exact"] / report["total_resolved"], 4)
    print(json.dumps({k:v for k,v in report.items() if k != "mismatches"}, ensure_ascii=False, indent=1))
    if args.out:
        Path(args.out).write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf8")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
