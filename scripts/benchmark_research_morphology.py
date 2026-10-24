#!/usr/bin/env python3
"""Run optional Korean morphological analyzers over a UTF-8 line corpus.

Input: one Korean sentence/eojeol per line. Output is diagnostic JSON only:
token count, unknown/unscored status, spans and elapsed time. This is NOT an
accuracy benchmark because it contains no independently adjudicated gold
segmentation. Each engine is isolated so a missing dependency is reported
without preventing the other engine from running.
"""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from korean_ukrainian.research_morphology import analyzer_by_name


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("corpus", type=Path, help="UTF-8 file, one Korean input per line")
    parser.add_argument("--engines", nargs="+", default=["kiwi", "mecab-ko"],
                        choices=["kiwi", "mecab-ko"])
    parser.add_argument("--output", type=Path, default=Path("morphology-benchmark.jsonl"))
    args = parser.parse_args()

    lines = [line.strip() for line in args.corpus.read_text(encoding="utf-8").splitlines()
             if line.strip()]
    with args.output.open("w", encoding="utf-8") as stream:
        for name in args.engines:
            try:
                analyzer = analyzer_by_name(name)
            except Exception as exc:
                stream.write(json.dumps({
                    "analyzer": name, "status": "blocked_dependency",
                    "error_type": type(exc).__name__, "error": str(exc),
                }, ensure_ascii=False) + "\n")
                continue
            started = time.perf_counter()
            rows = []
            error = None
            for text in lines:
                try:
                    rows.append(analyzer.analyze(text).to_dict())
                except Exception as exc:
                    error = {"type": type(exc).__name__, "message": str(exc)}
                    break
            elapsed = time.perf_counter() - started
            stream.write(json.dumps({
                "analyzer": name,
                "status": "completed_diagnostic" if error is None else "failed",
                "inputs": len(lines), "elapsed_seconds": round(elapsed, 6),
                "tokens": sum(len(row["morphemes"]) for row in rows),
                "results": rows, "error": error,
                "accuracy_claim": "none_no_gold_segmentation",
            }, ensure_ascii=False) + "\n")
    print(f"Wrote diagnostic results for {len(lines)} inputs to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
