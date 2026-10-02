# CLI, batch processing and JSON API

The application layer wraps the research pipeline; it does not implement a second phonological engine.

## Install

Core package:

    pip install -e .

Batch Excel support:

    pip install -e ".[cli]"

JSON API:

    pip install -e ".[api]"

Both:

    pip install -e ".[cli,api]"

## Single input

    korean-ua analyze "한국어"

Pretty JSON is printed to stdout. Use `--mode decompose` to inspect Hangul decomposition.

## TXT batch

One Korean item per non-empty line:

    korean-ua batch input.txt -o output.jsonl

For a human-readable text-only output:

    korean-ua batch input.txt -o output.txt

## CSV batch

Input:

    text
    한국어
    서울

Command:

    korean-ua batch input.csv -o output.csv --column text

The output preserves input columns and appends `ukrainian_orthography`, `ipa`, `analysis_status`, and `result_json`.

## Excel batch

    korean-ua batch input.xlsx -o output.xlsx --column text --sheet Sheet1

If `--sheet` is omitted, the first worksheet is used. Legacy `.xls` is deliberately rejected; use modern `.xlsx`.

## JSON API

Run:

    uvicorn korean_ukrainian.api:app --host 127.0.0.1 --port 8000

Health:

    curl http://127.0.0.1:8000/health

Analyze:

    curl -X POST http://127.0.0.1:8000/v1/analyze -H "Content-Type: application/json" -d "{\"text\":\"한국어\",\"mode\":\"transliterate\"}"

The response preserves the research layers: Korean orthography/decomposition, phonology, rule trace, IPA, Ukrainian candidates, selected heuristic candidate, and sources.

## API contract

Request:

    {"text":"한국어","mode":"transliterate"}

Response is the same structured object returned by `transliterate_korean()`; it is not reduced to a single opaque string.

The API intentionally has no authentication, rate limiting, persistence, or public deployment configuration. It is a local reference API. Add those controls before exposing it to the internet.
