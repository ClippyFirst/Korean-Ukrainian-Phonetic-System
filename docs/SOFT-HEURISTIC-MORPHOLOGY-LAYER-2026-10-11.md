# Soft-heuristic morphology layer

**Date:** 2026-10-11  
**Status:** Design + implementation specification (opt-in, fail-closed by default)  
**Authority boundary:** Does **not** replace NIKL-backed exact licenses. Does **not** claim productive morphological analysis.

## 1. Problem

Several NIKL Standard Pronunciation Rules are morphology-conditioned:

| Rule | NIKL | Why morphology is required |
|------|------|----------------------------|
| R002 | §§13–15 | Formal vs substantive morpheme changes complex-coda and representative-coda liaison |
| R003 | §12(4) | ㅎ/ㄶ/ㅀ deletion only before vowel-initial **endings/suffixes** |
| R007 | §17 | Palatalization of ㄷ/ㅌ/ㄾ only before ㅣ-initial **formal** morphemes (and ㄷ+히) |
| R009 | §29 | ㄴ-insertion is lexical / optional / pair-specific |
| R010–R016, R015 | §§11, 24–28, 30 | Stem class, Sino-Korean, adnominal, compound, saisiot |

The research layer and browser engine correctly refuse to infer these boundaries from Hangul adjacency alone. Unknown candidates are marked `unresolved` / `conditional-disabled`.

That integrity is correct. It is also incomplete for practical service use: many high-frequency endings (`-이`, `-을`, `-어`, `-았/었`, `-고`, `-다` …) are orthographically obvious and attested thousands of times.

## 2. Design principle

```
exact lexical / pair license  >  soft heuristic  >  unresolved
```

- **Default path (browser + Python API):** exact evidence only. Heuristic **off**.
- **Optional path:** `morphology_mode="soft"` (or UI toggle). Heuristic may propose a candidate.
- Heuristic output is **never** silently promoted to normative status.
- Every heuristic application is traced with:
  - `status: "heuristic-low-confidence"`
  - `source: "soft-heuristic-morphology"`
  - the pattern that fired
  - a residual `unresolved` alternative remains available in the result object

Ukrainian targets derived from a heuristic Korean surface remain **provisional**.

## 3. Scope of the soft layer (v1)

### 3.1 Formal-ending inventory (high-frequency, closed list)

Only the following **right-hand** syllables may trigger a soft formal-morpheme hypothesis when they immediately follow a coda-bearing Hangul block **inside the same eojeol** (no whitespace, no punctuation):

| Ending orthography | Typical function | Soft license emitted |
|--------------------|------------------|----------------------|
| 이 | nominative / subject particle; also some derivational | `soft:formal_i` |
| 을 / 를 | object particle | `soft:formal_ul_lul` |
| 에 | locative / dative particle | `soft:formal_e` |
| 어 / 아 | connective / imperative / informal | `soft:vowel_ending` |
| 았 / 었 / 였 | past tense stem extension | `soft:past_extension` |
| 고 | connective | `soft:go` |
| 다 | declarative citation / sentence end | `soft:da` |
| 은 / 는 | topic particle | `soft:topic` |
| 인 | adnominal / “who is” | `soft:in` |
| 히 | adverbial / passive-causative suffix (only after ㄷ for §17 chain) | `soft:hi_suffix` |

**Not** in v1 (remain exact-license only):

- Cross-word / phrase boundaries (whitespace)
- Compound-internal boundaries without written space
- Sino-Korean class detection
- Adnominal `-(으)ㄹ` fortition (§27)
- Saisiot compounds (§30)
- Optional / lexical ㄴ-insertion (§29) except the already-licensed phrase map
- Any ending longer than one Hangul block unless listed above as a fixed digraph (았/었/였)

### 3.2 Which rules soft mode may unlock

| Rule | Soft behaviour |
|------|----------------|
| **R002** (liaison) | If right syllable ∈ formal-ending inventory → treat as **formal** (§§13–14): complex coda moves second member; simple coda transfers written form. **Never** auto-select §15 substantive neutralization. |
| **R003** (ㅎ deletion) | If right syllable ∈ {이, 어, 아, 았, 었, 였, 은, 는, 을, 를, 에, 고, 다, 인} → allow ㅎ/ㄶ/ㅀ deletion. |
| **R007** (palatalization) | If left coda ∈ {ㄷ, ㅌ, ㄾ} and right is exactly `이` → allow §17 formal-morpheme palatalization. If right is `히` after ㄷ (post-aspiration intermediate) → allow ㄷ+히 → 치 chain. |
| **R016** | **Never** soft-licensed. Verb-stem ㄺ-before-ㄱ stays exact-only. |
| **R009, R010–R015** | **Never** soft-licensed in v1. |

### 3.3 Confidence and status vocabulary

| Status | Meaning |
|--------|---------|
| `established` | Rule applied from generic phonology or exact NIKL license |
| `lexical-review` | Exact lexical entry; Ukrainian target provisional |
| `heuristic-low-confidence` | Soft morphology hypothesis applied |
| `conditional-disabled` | Morphology required; no exact license and soft mode off / pattern missed |
| `unresolved` | Browser withheld surface change |

Trace fields added by soft layer:

```json
{
  "rule_id": "R002",
  "status": "heuristic-low-confidence",
  "source": "soft-heuristic-morphology",
  "license_context": "soft:formal_i:값이:값>이",
  "heuristic_pattern": "formal_ending:이",
  "confidence": "low"
}
```

## 4. API / runtime contract

### Python (`src/korean_ukrainian`)

```python
apply_ordered_rules(
    items,
    boundary_mode="same_word",          # existing
    rule_licenses=None,                 # existing exact licenses
    morphology_mode="strict",           # NEW: "strict" | "soft"
)
```

- `morphology_mode="strict"` (default): current behaviour. No change.
- `morphology_mode="soft"`: before each morphology-gated rule, the soft layer may inject **ephemeral** licenses of the form  
  `R002:formal:{full_form}:{pair}` / `R003:ending_or_suffix_h_deletion:{full_form}:{pair}` / `R007:formal_morpheme_i:{full_form}:{pair}`  
  **only** when the right-hand syllable matches the closed ending inventory and the left-hand context matches the rule’s segmental precondition.
- Ephemeral licenses are **not** written back into the lexical CSV. They exist only for the current call.
- Result object exposes:
  - `surface` / `ipa` from the applied path
  - `heuristic_applied: bool`
  - `unresolved_alternative: ... | null` — the strict-mode residual for the same input when heuristic fired

### Browser (`src/app/engine.js`)

```js
analyze(text, { morphologyMode: 'strict' | 'soft' })
```

- Default `strict`.
- UI: checkbox / toggle **«М’яка морфологія (низька впевненість)»** on the service page, off by default.
- When soft fires, the inspectable trace shows a distinct badge `heuristic` and the normative Korean line (if any) is **not** replaced by the heuristic reading unless the user explicitly selects it.

## 5. Algorithm (soft formal-ending detector)

```
function soft_formal_licenses(syllables, full_form):
    licenses = []
    for i in 0 .. len(syllables)-2:
        a, b = syllables[i], syllables[i+1]
        if a.boundary_after == "word": continue          # no cross-word soft
        if not a.coda: continue
        if b.onset != "ㅇ" and not (b.text == "히"): continue

        ending = b.text
        pattern = ENDING_TO_PATTERN.get(ending)          # closed map §3.1
        if pattern is None: continue

        pair = f"{a.text}>{b.text}"

        # R002 formal liaison candidate
        if b.onset == "ㅇ":
            licenses.append(f"R002:formal:{full_form}:{pair}")

        # R003 h-deletion candidate
        if a.coda in {"ㅎ", "ㄶ", "ㅀ"} and b.onset == "ㅇ":
            licenses.append(f"R003:ending_or_suffix_h_deletion:{full_form}:{pair}")

        # R007 palatalization candidate
        if a.coda in {"ㄷ", "ㅌ", "ㄾ"} and ending == "이":
            licenses.append(f"R007:formal_morpheme_i:{full_form}:{pair}")
        if ending == "히" and a.coda == "ㄷ":             # after R004 intermediate
            licenses.append(f"R007:dh_suffix_hi:{full_form}:{pair}")

    return licenses
```

Call order:

1. Build exact `rule_licenses` from lexical data (unchanged).
2. If `morphology_mode == "soft"`: `rule_licenses = exact ∪ soft_formal_licenses(...)`.
3. Run `apply_ordered_rules` as today.
4. Any rule that used a soft-prefixed license must set `status = "heuristic-low-confidence"` and `source = "soft-heuristic-morphology"`.

## 6. Explicit non-goals (v1)

- No POS tagger, no lemma dictionary, no dependency parse.
- No automatic compound splitting.
- No cross-whitespace soft licenses.
- No promotion of heuristic readings into the normative lexical CSV.
- No change to coverage-gate semantics: `verified` still means “official listed examples + exact licenses”.
- Soft mode must not make any existing strict-mode regression fail.

## 7. Tests required before merge

| Test file (proposed) | Assertions |
|----------------------|------------|
| `tests/soft-heuristic-morphology-strict-default.test.mjs` | Default path unchanged; known unresolved cases stay unresolved |
| `tests/soft-heuristic-morphology-formal-endings.test.mjs` | Soft mode unlocks R002/R003/R007 for closed ending list; status is `heuristic-low-confidence` |
| `tests/soft-heuristic-morphology-negative-controls.test.mjs` | Soft does **not** fire across whitespace; does **not** license R016 / R009 / §15 substantive; does **not** treat arbitrary 이-looking syllables outside the inventory |
| `tests/soft-heuristic-morphology-parity.test.mjs` | Python and browser soft results agree on surface + status for a shared fixture set |

Python mirror under `tests/` or `pytest` suite with the same fixtures.

## 8. Documentation touch-points

When implementing, update:

1. **This file** — source of truth for the layer.
2. `docs/NIKL-STANDARD-PRONUNCIATION-AUDIT-2026-10-09.md` — short subsection under “Web runtime boundary” / “Release gate” pointing here; reaffirm that soft mode is opt-in and non-normative.
3. `README.md` — one bullet under “Web runtime boundary”:
   > Optional `morphology_mode=soft` may propose high-frequency formal-ending readings with `heuristic-low-confidence` status. Default remains strict (exact evidence only). See `docs/SOFT-HEURISTIC-MORPHOLOGY-LAYER-2026-10-11.md`.
4. `docs/WEB-SERVICE-USER-GUIDE.md` — UI toggle description and warning that soft readings are not NIKL-certified.
5. `docs/architecture.md` — one line in the pipeline diagram: optional soft morphology injection before ordered rules.

## 9. Acceptance criteria

- [ ] `morphology_mode` defaults to `strict` in Python API and browser.
- [ ] Soft mode only injects licenses for the closed ending inventory in §3.1.
- [ ] Soft mode never selects §15 substantive neutralization.
- [ ] Soft mode never licenses R009 / R010–R016 / R015.
- [ ] Every soft application is visible in the rule trace with `heuristic-low-confidence`.
- [ ] All existing npm and pytest suites pass with soft **off**.
- [ ] New soft-mode tests pass.
- [ ] Coverage-gate ledger and NIKL audit wording remain accurate (no claim of productive morphology).

## 10. Future (out of scope for v1)

- Soft digraph / multi-syllable ending patterns (`-으니까`, `-습니다`, …) with explicit allow-list.
- Frequency-ranked ending lexicon derived from a public corpus (still heuristic, still low-confidence).
- User-reported “promote this heuristic to exact license” workflow feeding the lexical CSV review queue.

---

**Summary for implementers:** keep the fail-closed core. Add an opt-in, closed-list, same-eojeol formal-ending detector that can temporarily unlock R002 (formal only), R003, and R007. Trace every soft decision. Document the boundary so soft is never mistaken for a general morphological parser.
