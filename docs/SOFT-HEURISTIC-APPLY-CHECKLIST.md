# Soft-heuristic morphology — apply checklist

Copy these files into the repo root (branch `test/block-standard-rule-coverage-gate-2026-10-11` or a new feature branch).

## Files to add (as-is)

| Artifact path | Repo path |
|---------------|-----------|
| `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md` | `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md` |
| `docs/SOFT-HEURISTIC-INTEGRATION-NOTES.md` | `docs/SOFT-HEURISTIC-INTEGRATION-NOTES.md` |
| `src/korean_ukrainian/soft_morphology.py` | `src/korean_ukrainian/soft_morphology.py` |
| `src/app/soft_morphology.js` | `src/app/soft_morphology.js` |
| `tests/test_soft_morphology.py` | `tests/test_soft_morphology.py` (or under package tests) |
| `tests/soft-heuristic-morphology-formal-endings.test.mjs` | `tests/soft-heuristic-morphology-formal-endings.test.mjs` |

## Patches to apply manually

Follow the detailed instructions in:

1. `patches/rules.py.patch.md` → `src/korean_ukrainian/rules.py`
2. `patches/pipeline.py.patch.md` → `src/korean_ukrainian/pipeline.py`
3. `patches/engine.js.patch.md` → `src/app/engine.js`
4. `patches/main.js.patch.md` → `src/main.js` + `index.html` + CSS
5. `patches/README-and-docs-snippets.md` → README, NIKL audit, architecture, user guide

## Verification order

```bash
# 1. Existing suite must still pass with default strict
npm test
pytest

# 2. New Python soft tests
pytest tests/test_soft_morphology.py -q

# 3. Wire Node soft tests to engine, then:
npm test -- soft-heuristic

# 4. Manual UI
npm run dev
# — toggle off: known unresolved cases stay unresolved
# — toggle on: 굳이 / 넋이 / 좋아 show heuristic-low-confidence, not blank unresolved
# — "값 이" (with space) must NOT soft-fire
```

## Acceptance (from design doc §9)

- [ ] `morphology_mode` defaults to `strict`
- [ ] Soft only injects for closed ending inventory
- [ ] Soft never selects §15 substantive
- [ ] Soft never licenses R009 / R010–R016 / R015
- [ ] Soft applications visible as `heuristic-low-confidence`
- [ ] Existing npm + pytest pass with soft off
- [ ] New soft tests pass
- [ ] Coverage-gate / NIKL audit wording still accurate
