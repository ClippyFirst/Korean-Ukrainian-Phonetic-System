"""Validated deterministic execution order for the Korean phonology rules.

The canonical rule catalogue and ordering live in data/korean/*.csv. This
module validates their one-to-one relationship and exposes an immutable plan;
it does not implement phonological transformations or infer morphology.
"""
from __future__ import annotations

import csv
import sysconfig
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True, slots=True)
class RulePlanEntry:
    rule_id: str
    name: str
    source_id: str
    status: str
    preferred_order: int
    analysis_status: str


@dataclass(frozen=True, slots=True)
class RuleExecutionPlan:
    entries: tuple[RulePlanEntry, ...]

    @property
    def rule_ids(self) -> tuple[str, ...]:
        return tuple(entry.rule_id for entry in self.entries)


def _resolve_data_dir(data_dir: Path | None) -> Path:
    if data_dir is not None:
        return Path(data_dir)

    checkout = Path(__file__).resolve().parents[2] / "data" / "korean"
    if (checkout / "rules.csv").is_file() and (checkout / "rule_ordering.csv").is_file():
        return checkout

    installed = (
        Path(sysconfig.get_path("data"))
        / "share"
        / "korean-ukrainian-phonetic-system"
    )
    if (installed / "rules.csv").is_file() and (installed / "rule_ordering.csv").is_file():
        return installed

    raise FileNotFoundError(
        "canonical Korean rule data not found in the source checkout or installed data directory"
    )


def _read_rows(path: Path, required_fields: set[str]) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        fields = set(reader.fieldnames or ())
        missing = required_fields - fields
        if missing:
            raise ValueError(
                f"{path.name} is missing required columns: {', '.join(sorted(missing))}"
            )
        return list(reader)


def _unique_by_rule_id(rows: Iterable[dict[str, str]], source_name: str) -> dict[str, dict[str, str]]:
    indexed: dict[str, dict[str, str]] = {}
    for line_number, row in enumerate(rows, start=2):
        if not any((value or "").strip() for value in row.values()):
            continue
        rule_id = (row.get("rule_id") or "").strip()
        if not rule_id:
            raise ValueError(f"{source_name}:{line_number} has an empty rule_id")
        if rule_id in indexed:
            raise ValueError(f"{source_name} contains duplicate rule_id {rule_id!r}")
        indexed[rule_id] = row
    if not indexed:
        raise ValueError(f"{source_name} contains no rule rows")
    return indexed


def load_rule_execution_plan(data_dir: Path | None = None) -> RuleExecutionPlan:
    """Load and validate the canonical rule catalogue and execution order.

    Every rule must occur exactly once in each CSV. preferred_order must be a
    unique positive integer. Any data drift raises instead of falling back to
    a second ordering embedded in Python source.
    """
    directory = _resolve_data_dir(data_dir)
    rules_path = directory / "rules.csv"
    ordering_path = directory / "rule_ordering.csv"
    if not rules_path.is_file():
        raise FileNotFoundError(rules_path)
    if not ordering_path.is_file():
        raise FileNotFoundError(ordering_path)

    rules = _unique_by_rule_id(
        _read_rows(rules_path, {"rule_id", "name", "source_id", "status"}),
        "rules.csv",
    )
    ordering = _unique_by_rule_id(
        _read_rows(ordering_path, {"rule_id", "preferred_order", "analysis_status"}),
        "rule_ordering.csv",
    )

    rule_ids = set(rules)
    ordered_ids = set(ordering)
    missing = sorted(rule_ids - ordered_ids)
    unknown = sorted(ordered_ids - rule_ids)
    if missing:
        raise ValueError(
            "rules missing from rule_ordering.csv: " + ", ".join(missing)
        )
    if unknown:
        raise ValueError(
            "rule_ordering.csv has unknown rule IDs: " + ", ".join(unknown)
        )

    order_by_id: dict[str, int] = {}
    for rule_id, row in ordering.items():
        raw_order = (row.get("preferred_order") or "").strip()
        try:
            preferred_order = int(raw_order)
        except (TypeError, ValueError) as exc:
            raise ValueError(
                f"rule_ordering.csv preferred_order for {rule_id} must be a positive integer"
            ) from exc
        if preferred_order <= 0:
            raise ValueError(
                f"rule_ordering.csv preferred_order for {rule_id} must be a positive integer"
            )
        order_by_id[rule_id] = preferred_order

    if len(set(order_by_id.values())) != len(order_by_id):
        raise ValueError("rule_ordering.csv preferred_order values must be unique")

    entries = tuple(
        RulePlanEntry(
            rule_id=rule_id,
            name=(rules[rule_id].get("name") or "").strip(),
            source_id=(rules[rule_id].get("source_id") or "").strip(),
            status=(rules[rule_id].get("status") or "").strip(),
            preferred_order=order_by_id[rule_id],
            analysis_status=(ordering[rule_id].get("analysis_status") or "").strip(),
        )
        for rule_id in sorted(rule_ids, key=order_by_id.__getitem__)
    )
    return RuleExecutionPlan(entries=entries)


@lru_cache(maxsize=1)
def _default_plan() -> RuleExecutionPlan:
    return load_rule_execution_plan()


def default_rule_ids() -> tuple[str, ...]:
    """Return the cached canonical rule order used by the default runtime."""
    return _default_plan().rule_ids
