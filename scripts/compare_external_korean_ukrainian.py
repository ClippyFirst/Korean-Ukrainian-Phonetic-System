from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any, Callable

ENDPOINT = "https://api.mikai.me/public/v1/translit"
SYSTEMS = ("hikka", "shchegel")
DIAGNOSTIC_INPUTS = (
    "한글",
    "안녕하세요",
    "독립문",
    "신라",
    "국립",
    "같이",
    "맞히다",
    "민주주의의 의의",
    "현대",
    "김치",
    "흙을",
    "밟으며",
    "낡은",
    "놓인",
    "맑은",
    "햇빛이",
    "젊은",
    "설날",
    "종로",
    "서울",
)


def _ipa_value(result: dict[str, Any]) -> str | None:
    value = result.get("ipa")
    if isinstance(value, dict):
        value = value.get("ipa")
    return value if isinstance(value, str) else None


def collect_native_line(
    source: str,
    transliterate: Callable[[str], dict[str, Any]] | None = None,
) -> dict[str, Any]:
    if transliterate is None:
        from korean_ukrainian.pipeline import transliterate_korean

        transliterate = transliterate_korean

    started = time.perf_counter()
    try:
        result = transliterate(source)
    except Exception as exc:  # surfaced in the report and made fatal by main()
        return {
            "source": source,
            "result": "",
            "accepted_result": None,
            "candidate_result": None,
            "target_status": "error",
            "selection_status": None,
            "ipa": None,
            "elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
            "error": f"{type(exc).__name__}: {exc}",
        }

    accepted = result.get("ukrainian_orthography")
    candidate = result.get("candidate_orthography")
    if not isinstance(accepted, str) or not accepted:
        accepted = None
    if not isinstance(candidate, str) or not candidate:
        candidate = None
    target_status = result.get("target_status") or "unknown"

    return {
        "source": source,
        # This display value may be a candidate; target_status and the two
        # explicit fields above must always accompany it.
        "result": accepted or candidate or "",
        "accepted_result": accepted,
        "candidate_result": candidate,
        "target_status": target_status,
        "selection_status": result.get("selection_status"),
        "ipa": _ipa_value(result),
        "elapsed_ms": round((time.perf_counter() - started) * 1000, 3),
    }


def summarize_native(lines: list[dict[str, Any]]) -> dict[str, Any]:
    statuses = Counter(str(line.get("target_status") or "unknown") for line in lines)
    accepted = sum(
        line.get("target_status") == "model-selected"
        and bool(line.get("accepted_result"))
        for line in lines
    )
    provisional = sum(
        bool(line.get("candidate_result"))
        and not (
            line.get("target_status") == "model-selected"
            and bool(line.get("accepted_result"))
        )
        for line in lines
    )
    errors = sum(line.get("target_status") == "error" for line in lines)
    return {
        "input_count": len(lines),
        "accepted_target_count": accepted,
        "provisional_candidate_count": provisional,
        "nonempty_display_candidate_count": sum(bool(line.get("result")) for line in lines),
        "error_count": errors,
        "target_status_counts": dict(sorted(statuses.items())),
        "total_native_elapsed_ms": round(
            sum(float(line.get("elapsed_ms") or 0) for line in lines), 3
        ),
        "latency_scope": "sum of in-process per-item timings; not comparable with external batch wall time",
    }


def validate_external_payload(
    system: str,
    status: int,
    body: dict[str, Any],
    inputs: tuple[str, ...] | list[str],
    elapsed_ms: float,
) -> dict[str, Any]:
    if status != 200 or body.get("ok") is not True:
        raise RuntimeError(f"{system} API returned status={status}, ok={body.get('ok')!r}")

    result = body.get("result")
    if not isinstance(result, dict):
        raise RuntimeError(f"{system} API response has no result object")
    lines = result.get("lines")
    if not isinstance(lines, list) or len(lines) != len(inputs):
        count = len(lines) if isinstance(lines, list) else "no"
        raise RuntimeError(f"{system} returned {count} lines for {len(inputs)} inputs")
    if [line.get("source") for line in lines if isinstance(line, dict)] != list(inputs):
        raise RuntimeError(f"{system} changed input order or source strings")
    if any(not isinstance(line, dict) or not isinstance(line.get("result"), str) for line in lines):
        raise RuntimeError(f"{system} returned a malformed output line")

    nonempty = sum(bool(line["result"]) for line in lines)
    return {
        "status": status,
        "system": result.get("system") or system,
        "elapsed_ms": round(elapsed_ms, 3),
        "latency_scope": "single HTTP batch wall time; not a per-item or stable p50/p95 measurement",
        "input_count": len(inputs),
        "lines": lines,
        "nonempty_output_count": nonempty,
        "empty_output_count": len(inputs) - nonempty,
        "source_order_preserved": True,
    }


def fetch_external(
    system: str,
    inputs: tuple[str, ...] | list[str],
    endpoint: str = ENDPOINT,
    timeout: float = 20.0,
    opener: Callable[..., Any] = urllib.request.urlopen,
) -> dict[str, Any]:
    payload = json.dumps(
        {"lang": "ko", "system": system, "mode": "text", "items": list(inputs)},
        ensure_ascii=False,
    ).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "ClippyFirst-KoreanUkrainianBenchmark/0.2 (fixed public diagnostic corpus)",
        },
        method="POST",
    )
    started = time.perf_counter()
    try:
        with opener(request, timeout=timeout) as response:
            status = response.status
            body = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"{system} API request failed: {type(exc).__name__}: {exc}") from exc
    elapsed_ms = (time.perf_counter() - started) * 1000
    return validate_external_payload(system, status, body, inputs, elapsed_ms)


def build_report(
    inputs: tuple[str, ...] | list[str],
    native_lines: list[dict[str, Any]],
    external: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    inputs = list(inputs)
    if [line.get("source") for line in native_lines] != inputs:
        raise ValueError("native results do not preserve the diagnostic input order")
    if set(external) != set(SYSTEMS):
        raise ValueError(f"expected external systems {SYSTEMS!r}, got {tuple(external)!r}")

    for system in SYSTEMS:
        lines = external[system].get("lines", [])
        if [line.get("source") for line in lines] != inputs:
            raise ValueError(f"{system} results do not preserve the diagnostic input order")

    native_by_source = {line["source"]: line for line in native_lines}
    external_by_source = {
        system: {line["source"]: line for line in external[system]["lines"]}
        for system in SYSTEMS
    }

    hikka_shchegel = []
    native_vs_external = {"hikka": [], "shchegel": []}
    for source in inputs:
        hikka = external_by_source["hikka"][source].get("result", "")
        shchegel = external_by_source["shchegel"][source].get("result", "")
        native = native_by_source[source]
        native_display = native.get("result", "")
        if hikka != shchegel:
            hikka_shchegel.append(
                {"source": source, "hikka": hikka, "shchegel": shchegel}
            )
        for system, external_value in (("hikka", hikka), ("shchegel", shchegel)):
            if native_display != external_value:
                native_vs_external[system].append(
                    {
                        "source": source,
                        "native_display_candidate": native_display,
                        "native_target_status": native.get("target_status"),
                        "native_selection_status": native.get("selection_status"),
                        system: external_value,
                    }
                )

    native_summary = summarize_native(native_lines)
    external_summary = {
        system: {
            "status": external[system].get("status"),
            "system": external[system].get("system"),
            "input_count": external[system].get("input_count"),
            "nonempty_output_count": external[system].get("nonempty_output_count"),
            "empty_output_count": external[system].get("empty_output_count"),
            "elapsed_ms": external[system].get("elapsed_ms"),
            "latency_scope": external[system].get("latency_scope"),
            "source_order_preserved": external[system].get("source_order_preserved"),
        }
        for system in SYSTEMS
    }

    return {
        "purpose": (
            "Fixed-input public API availability and raw-string disagreement smoke only; "
            "no adjudicated Ukrainian gold and no accuracy ranking."
        ),
        "accuracy_claim": False,
        "production_recommendation": None,
        "endpoint": ENDPOINT,
        "privacy": "Only the fixed public diagnostic phrases in this report are sent; no user-supplied text is transmitted.",
        "inputs": inputs,
        "systems": {
            "clippyfirst_native": {
                "system": "ClippyFirst native IPA-first research pipeline",
                "lines": native_lines,
                **native_summary,
            },
            **external,
        },
        "summary": {
            "input_count": len(inputs),
            "native_accepted_target_count": native_summary["accepted_target_count"],
            "native_provisional_candidate_count": native_summary["provisional_candidate_count"],
            "native_target_status_counts": native_summary["target_status_counts"],
            "hikka_nonempty_outputs": external_summary["hikka"]["nonempty_output_count"],
            "shchegel_nonempty_outputs": external_summary["shchegel"]["nonempty_output_count"],
            "hikka_shchegel_raw_string_differences": len(hikka_shchegel),
            "native_vs_hikka_raw_string_differences": len(native_vs_external["hikka"]),
            "native_vs_shchegel_raw_string_differences": len(native_vs_external["shchegel"]),
        },
        "external_summary": external_summary,
        "raw_string_differences": {
            "hikka_vs_shchegel": hikka_shchegel,
            "native_vs_hikka": native_vs_external["hikka"],
            "native_vs_shchegel": native_vs_external["shchegel"],
        },
        "interpretation": (
            "Raw string disagreement is not accuracy. Hikka and Shchegel do not expose "
            "IPA or a source-to-target trace in this API response. Native display strings "
            "may be provisional candidates when target_status is unavailable. Do not "
            "select a winner or promote an external output without independently "
            "adjudicated Ukrainian gold and an accepted-variant policy."
        ),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Compare fixed Korean diagnostic inputs with Hikka and Shchegel; no accuracy claim."
    )
    parser.add_argument("--output", required=True, help="Path for the JSON smoke report")
    args = parser.parse_args(argv)

    native_lines = [collect_native_line(item) for item in DIAGNOSTIC_INPUTS]
    external = {
        system: fetch_external(system, DIAGNOSTIC_INPUTS)
        for system in SYSTEMS
    }
    report = build_report(DIAGNOSTIC_INPUTS, native_lines, external)
    Path(args.output).write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    summary = report["summary"]
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))
    if summary["native_target_status_counts"].get("error", 0):
        raise SystemExit("native pipeline raised errors on fixed diagnostic inputs")
    if summary["hikka_nonempty_outputs"] != len(DIAGNOSTIC_INPUTS):
        raise SystemExit("Hikka returned one or more empty outputs")
    if summary["shchegel_nonempty_outputs"] != len(DIAGNOSTIC_INPUTS):
        raise SystemExit("Shchegel returned one or more empty outputs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
