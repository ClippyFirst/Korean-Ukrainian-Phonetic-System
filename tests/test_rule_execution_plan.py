from __future__ import annotations

import csv
from pathlib import Path

import pytest

from korean_ukrainian.phonology import parse_syllables
from korean_ukrainian.rules import apply_ordered_rules
from korean_ukrainian.rule_plan import default_rule_ids, load_rule_execution_plan


EXPECTED_RULE_IDS = (
    "R009", "R003", "R002", "R004", "R006", "R005", "R007",
    "R010", "R011", "R012", "R013", "R014", "R015", "R016",
    "R008", "R001",
)


def _write_catalogue(directory: Path, rules: list[dict], ordering: list[dict]) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    with (directory / "rules.csv").open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=["rule_id", "name", "source_id", "status"])
        writer.writeheader()
        writer.writerows(rules)
    with (directory / "rule_ordering.csv").open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=["rule_id", "preferred_order", "analysis_status"])
        writer.writeheader()
        writer.writerows(ordering)


def test_default_rule_plan_matches_canonical_preferred_order():
    plan = load_rule_execution_plan()
    assert plan.rule_ids == EXPECTED_RULE_IDS
    assert default_rule_ids() == EXPECTED_RULE_IDS


def test_rule_plan_sorts_by_preferred_order_not_csv_row_order(tmp_path: Path):
    _write_catalogue(
        tmp_path,
        [
            {"rule_id": "R001", "name": "first", "source_id": "S1", "status": "established"},
            {"rule_id": "R002", "name": "second", "source_id": "S2", "status": "conditional"},
        ],
        [
            {"rule_id": "R002", "preferred_order": "2", "analysis_status": "primary"},
            {"rule_id": "R001", "preferred_order": "1", "analysis_status": "primary"},
        ],
    )
    assert load_rule_execution_plan(tmp_path).rule_ids == ("R001", "R002")


def test_rule_plan_rejects_a_rule_missing_from_ordering(tmp_path: Path):
    _write_catalogue(
        tmp_path,
        [{"rule_id": "R001", "name": "first", "source_id": "S1", "status": "established"}],
        [],
    )
    with pytest.raises(ValueError, match="missing from rule_ordering.csv"):
        load_rule_execution_plan(tmp_path)


def test_rule_plan_rejects_unknown_rule_id_in_ordering(tmp_path: Path):
    _write_catalogue(
        tmp_path,
        [{"rule_id": "R001", "name": "first", "source_id": "S1", "status": "established"}],
        [
            {"rule_id": "R001", "preferred_order": "1", "analysis_status": "primary"},
            {"rule_id": "R999", "preferred_order": "2", "analysis_status": "primary"},
        ],
    )
    with pytest.raises(ValueError, match="unknown rule IDs"):
        load_rule_execution_plan(tmp_path)


def test_rule_plan_rejects_duplicate_preferred_order(tmp_path: Path):
    _write_catalogue(
        tmp_path,
        [
            {"rule_id": "R001", "name": "first", "source_id": "S1", "status": "established"},
            {"rule_id": "R002", "name": "second", "source_id": "S2", "status": "established"},
        ],
        [
            {"rule_id": "R001", "preferred_order": "1", "analysis_status": "primary"},
            {"rule_id": "R002", "preferred_order": "1", "analysis_status": "primary"},
        ],
    )
    with pytest.raises(ValueError, match="preferred_order values must be unique"):
        load_rule_execution_plan(tmp_path)


def test_rule_plan_rejects_non_positive_or_non_integer_order(tmp_path: Path):
    _write_catalogue(
        tmp_path,
        [{"rule_id": "R001", "name": "first", "source_id": "S1", "status": "established"}],
        [{"rule_id": "R001", "preferred_order": "zero", "analysis_status": "primary"}],
    )
    with pytest.raises(ValueError, match="positive integer"):
        load_rule_execution_plan(tmp_path)


def test_runtime_default_execution_uses_canonical_rule_order():
    _, traces = apply_ordered_rules(parse_syllables("가나다"))
    assert tuple(trace.rule_id for trace in traces) == EXPECTED_RULE_IDS


def test_explicit_rule_sequence_keeps_caller_order():
    _, traces = apply_ordered_rules(parse_syllables("낫"), ["R001", "R009"])
    assert tuple(trace.rule_id for trace in traces) == ("R001", "R009")

def test_core_runtime_has_no_neural_inference_dependency_or_import():
    import ast
    import tomllib

    repository = Path(__file__).resolve().parents[1]
    project = tomllib.loads((repository / "pyproject.toml").read_text(encoding="utf-8"))["project"]
    assert project.get("dependencies", []) == []

    forbidden = {"torch", "tensorflow", "transformers", "onnxruntime", "keras", "jax"}
    runtime_modules = (
        "pipeline.py", "rules.py", "rule_plan.py", "phonology.py", "ipa.py",
        "ipa_profiles.py",
    )
    for filename in runtime_modules:
        tree = ast.parse((
            repository / "src" / "korean_ukrainian" / filename
        ).read_text(encoding="utf-8"))
        imported = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name.split(".", 1)[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module.split(".", 1)[0])
        assert not (imported & forbidden), f"{filename} imports an ML inference package"