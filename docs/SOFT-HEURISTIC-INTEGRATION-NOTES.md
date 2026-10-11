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

2. Extend `apply_ordered_rules` with `morphology_mode="strict"|"soft"` (default strict).
   Soft injects ephemeral formal-ending licenses for R002/R003/R007 only.

3. Public API (`api.py` / `pipeline.py`): thread `morphology_mode` through; default `"strict"`.

## Minimal change to `src/app/engine.js`

1. Import from `./soft_morphology.js`.
2. `applyContextualRules(units, sourceText, { morphologyMode: 'strict' })` — soft path for formal endings.
3. `convert(text, { morphologyMode })` options plumbing.
4. UI checkbox off by default.

## Safety checklist before enabling in CI

- [ ] All existing tests pass with `morphology_mode=strict`.
- [ ] Soft tests assert status string and that R016/R009 never soft-fire.
- [ ] Soft tests assert no cross-whitespace soft licenses.
- [ ] Soft never writes into lexical CSV.
- [ ] Browser UI default = off.

Full contract: `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md`.
