from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from compare_external_korean_ukrainian import (
    DIAGNOSTIC_INPUTS,
    SYSTEMS,
    build_report,
    collect_native_line,
    fetch_external,
    summarize_native,
    validate_external_payload,
)


def test_native_summary_separates_accepted_targets_from_provisional_candidates() -> None:
    lines = [
        {
            "source": "한글",
            "result": "Ханґиль",
            "accepted_result": "Ханґиль",
            "candidate_result": None,
            "target_status": "model-selected",
            "elapsed_ms": 1.0,
        },
        {
            "source": "같이",
            "result": "Каті",
            "accepted_result": None,
            "candidate_result": "Каті",
            "target_status": "unavailable",
            "elapsed_ms": 1.0,
        },
        {
            "source": "흙을",
            "result": "",
            "accepted_result": None,
            "candidate_result": None,
            "target_status": "unavailable",
            "elapsed_ms": 1.0,
        },
    ]

    summary = summarize_native(lines)

    assert summary["accepted_target_count"] == 1
    assert summary["provisional_candidate_count"] == 1
    assert summary["nonempty_display_candidate_count"] == 2
    assert summary["target_status_counts"] == {
        "model-selected": 1,
        "unavailable": 2,
    }


def test_native_line_never_promotes_candidate_to_accepted_output() -> None:
    def fake_transliterate(_source: str) -> dict[str, object]:
        return {
            "ukrainian_orthography": None,
            "candidate_orthography": "Каті",
            "target_status": "unavailable",
            "selection_status": "Ukrainian target unavailable: review required",
            "ipa": {"ipa": "ka.tɕʰi"},
        }

    line = collect_native_line("같이", transliterate=fake_transliterate)

    assert line["result"] == "Каті"
    assert line["accepted_result"] is None
    assert line["candidate_result"] == "Каті"
    assert line["target_status"] == "unavailable"
    assert line["ipa"] == "ka.tɕʰi"


def test_external_payload_requires_exact_count_and_source_order() -> None:
    items = ("한글", "같이")
    good = {
        "ok": True,
        "result": {
            "system": "Hikka",
            "lines": [
                {"source": "한글", "result": "Ханґиль"},
                {"source": "같이", "result": "Каті"},
            ],
        },
    }

    checked = validate_external_payload("hikka", 200, good, items, 12.5)
    assert checked["source_order_preserved"] is True
    assert checked["nonempty_output_count"] == 2
    assert checked["empty_output_count"] == 0

    bad_order = {
        "ok": True,
        "result": {
            "lines": [
                {"source": "같이", "result": "Каті"},
                {"source": "한글", "result": "Ханґиль"},
            ],
        },
    }
    with pytest.raises(RuntimeError, match="changed input order"):
        validate_external_payload("hikka", 200, bad_order, items, 12.5)

    with pytest.raises(RuntimeError, match="returned 1 lines"):
        validate_external_payload(
            "hikka",
            200,
            {"ok": True, "result": {"lines": [{"source": "한글", "result": "Ханґиль"}]}},
            items,
            12.5,
        )


def test_fetch_external_sends_only_fixed_diagnostic_inputs_and_checks_response() -> None:
    class FakeResponse:
        status = 200

        def __enter__(self) -> "FakeResponse":
            return self

        def __exit__(self, *_args: object) -> None:
            return None

        def read(self) -> bytes:
            return json.dumps(
                {
                    "ok": True,
                    "result": {
                        "system": "Hikka",
                        "lines": [
                            {"source": item, "result": "тест"}
                            for item in DIAGNOSTIC_INPUTS
                        ],
                    },
                },
                ensure_ascii=False,
            ).encode("utf-8")

    def fake_opener(request: object, timeout: float) -> FakeResponse:
        assert timeout == 20.0
        payload = json.loads(request.data.decode("utf-8"))
        assert payload == {
            "lang": "ko",
            "system": "hikka",
            "mode": "text",
            "items": list(DIAGNOSTIC_INPUTS),
        }
        return FakeResponse()

    result = fetch_external("hikka", DIAGNOSTIC_INPUTS, opener=fake_opener)

    assert result["input_count"] == len(DIAGNOSTIC_INPUTS)
    assert result["nonempty_output_count"] == len(DIAGNOSTIC_INPUTS)
    assert result["source_order_preserved"] is True


def test_report_labels_disagreements_as_raw_strings_not_accuracy() -> None:
    inputs = ("한글", "같이")
    native = [
        {
            "source": "한글",
            "result": "Ханґиль",
            "accepted_result": "Ханґиль",
            "candidate_result": None,
            "target_status": "model-selected",
            "selection_status": "licensed correspondence",
            "ipa": "han.ɡɯl",
        },
        {
            "source": "같이",
            "result": "Каті",
            "accepted_result": None,
            "candidate_result": "Каті",
            "target_status": "unavailable",
            "selection_status": "candidate requires review",
            "ipa": "ka.tɕʰi",
        },
    ]
    external = {
        "hikka": {
            "status": 200,
            "system": "Hikka",
            "input_count": 2,
            "lines": [
                {"source": "한글", "result": "Ханґиль"},
                {"source": "같이", "result": "Каті"},
            ],
            "nonempty_output_count": 2,
            "empty_output_count": 0,
            "elapsed_ms": 10.0,
            "latency_scope": "single batch",
            "source_order_preserved": True,
        },
        "shchegel": {
            "status": 200,
            "system": "Shchegel",
            "input_count": 2,
            "lines": [
                {"source": "한글", "result": "Ханґиль"},
                {"source": "같이", "result": "Ґаті"},
            ],
            "nonempty_output_count": 2,
            "empty_output_count": 0,
            "elapsed_ms": 11.0,
            "latency_scope": "single batch",
            "source_order_preserved": True,
        },
    }

    report = build_report(inputs, native, external)

    assert report["accuracy_claim"] is False
    assert report["production_recommendation"] is None
    assert report["summary"]["native_accepted_target_count"] == 1
    assert report["summary"]["native_provisional_candidate_count"] == 1
    assert report["summary"]["hikka_shchegel_raw_string_differences"] == 1
    assert report["summary"]["native_vs_hikka_raw_string_differences"] == 0
    assert report["summary"]["native_vs_shchegel_raw_string_differences"] == 1
    assert "not accuracy" in report["interpretation"]


def test_expected_system_portfolio_and_fixture_are_stable() -> None:
    assert SYSTEMS == ("hikka", "shchegel")
    assert len(DIAGNOSTIC_INPUTS) == 20
    assert len(set(DIAGNOSTIC_INPUTS)) == 20
