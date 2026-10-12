# Soft-heuristic morphology — integration notes

Companion to `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md`.

## Files to add

| Path | Role |
|------|------|
| `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md` | Full design + acceptance criteria |
| `src/korean_ukrainian/soft_morphology.py` | Closed ending inventory + license injector |
| `tests/soft-heuristic-morphology-*.test.mjs` | Browser / Node regressions (see design §7) |
| Python pytest mirrors | Same fixtures |

## Minimal change to `rules.py`

1. Import:

```python
from .soft_morphology import soft_formal_licenses, merge_licenses, mark_heuristic_trace
```

2. Extend `apply_ordered_rules`:

```python
def apply_ordered_rules(
    items,
    rule_ids=None,
    *,
    boundary_mode="same_word",
    n_insertion_licensed=False,
    rule_licenses=None,
    morphology_mode="strict",   # NEW
):
    ids = rule_ids or [...]
    exact = list(rule_licenses or ())
    soft = soft_formal_licenses(items) if morphology_mode == "soft" else []
    merged = merge_licenses(exact, soft, morphology_mode=morphology_mode)
    exact_set = set(exact)

    traces = []
    for r in ids:
        tr = apply_rule(
            items, r,
            boundary_mode=boundary_mode,
            n_insertion_licensed=n_insertion_licensed,
            rule_licenses=merged,
        )
        # If the rule changed state and the enabling license was not exact → heuristic.
        soft_contributed = (
            morphology_mode == "soft"
            and tr.changed
            and tr.license_context
            and tr.license_context not in exact_set
            and not any(tr.license_context == e or e.endswith(":" + (tr.license_context or "").split(":")[-1]) for e in exact_set)
        )
        # Simpler reliable check: soft licenses are only those produced by soft_formal_licenses.
        soft_contributed = morphology_mode == "soft" and tr.changed and tr.license_context in set(soft)
        mark_heuristic_trace(tr, soft_contributed=soft_contributed)
        traces.append(tr)
    return items, traces
```

3. Public API (`api.py` / `pipeline.py`): thread `morphology_mode` through; default `"strict"`.

## Minimal change to `src/app/engine.js`

1. Add the same closed ending set and a `softFormalLicenses(units, sourceText)` helper that only looks at adjacent Hangul units with no intervening literal whitespace/punctuation.

2. In `applyContextualRules` (or the caller that currently withholds R002/R003/R007):

```js
function applyContextualRules(units, sourceText = '', { morphologyMode = 'strict' } = {}) {
  const softOn = morphologyMode === 'soft';
  // ... existing loops ...
  // Where today we set __complexLiaisonUnlicensed / __hDeletionUnlicensed /
  // __palatalizationUnlicensed, if softOn && right syllable is in SOFT_FORMAL_ENDINGS
  // and same-eojeol, apply the formal path and push
  // 'soft-heuristic-morphology' into the rule trace instead of unresolved.
}
```

3. `analyze(text, options)` must pass `morphologyMode` (default `'strict'`).

4. UI: checkbox on the service page, off by default, label e.g.  
   `М’яка морфологія (heuristic, низька впевненість)`  
   with a short note linking to the design doc.

## README one-liner (under Web runtime boundary)

```markdown
- Optional `morphology_mode=soft` may propose high-frequency formal-ending
  readings (이/을/어/았/고/…) with status `heuristic-low-confidence`.
  Default remains strict (exact evidence only).
  See [docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md](docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md).
```

## NIKL audit touch

In `docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md`, under the existing “Web runtime boundary” / integrity paragraph, add:

> An optional soft-heuristic morphology layer (opt-in, closed formal-ending inventory, same-eojeol only) may unlock R002 formal liaison, R003 ㅎ-deletion, and R007 palatalization with status `heuristic-low-confidence`. It does not select §15 substantive neutralization, does not license R009/R010–R016, and does not change the default strict path or the coverage-gate definition of `verified`. Full contract: `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md`.

## Safety checklist before enabling in CI

- [ ] All existing tests pass with `morphology_mode=strict`.
- [ ] Soft tests assert status string and that R016/R009 never soft-fire.
- [ ] Soft tests assert no cross-whitespace soft licenses.
- [ ] Soft never writes into lexical CSV.
- [ ] Browser UI default = off.
