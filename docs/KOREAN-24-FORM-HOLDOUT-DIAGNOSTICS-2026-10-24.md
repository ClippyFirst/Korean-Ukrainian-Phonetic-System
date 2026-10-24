# ClippyFirst research diagnostic: 24 frozen Korean forms (2026-10-24)

**Status:** diagnostic integration added; exact-head execution pending. **Not gold, not a benchmark score, and not permitted for rule/normalizer tuning.**

## Research contract

The source manifest `data/korean/ipa_holdout_2026-10-24.json` remains unchanged and frozen. `scripts/diagnose-korean-ipa-holdout.py` runs the current native strict and soft research modes, the g2pK adapter when available, and the shared Ukrainian target path. It records source-rule traces, surface Hangul, provisional IPA, unresolved contexts, and target availability in a separate generated report. CI uploads that report as a 30-day artifact; it is not checked into the repository, so its input forms and engine outputs cannot silently contaminate local fixture/leakage scans.

Run locally when intentionally doing a quarantined research inspection:

```bash
python scripts/diagnose-korean-ipa-holdout.py --output /tmp/clippyfirst-korean-24-form-diagnostics.json
python -m pytest -q tests/test_korean_holdout_diagnostic.py
```

The report validates that the manifest is still frozen, exactly 24 cases, unique IDs, no IPA gold, and `tuningUseProhibited=true` for every item. It never writes to the manifest or changes a rule. Surface comparison removes the length marker and compares Hangul spellings only; it is a coarse rule diagnostic, **not** IPA evaluation. A matched surface spelling does not validate segmental IPA, lexical stress/prosody, or Ukrainian output.

## Source-grounded pattern inventory

| Cases | NIKL/source context | Diagnostic question | What may be concluded before IPA review |
|---|---|---|---|
| KUA-HO-001–003 | §10 commentary: 닭은, 흙은, 여덟은 | Complex coda representation, coda neutralization, liaison into vowel-initial ending | The same written complex coda cannot be handled as a generic one-character final; its split and the following morpheme boundary matter. The official Hangul spellings are surface evidence, not IPA. |
| KUA-HO-005, 018 | §11 commentary / dictionary-specific: 긁개, 여덟과 | ㄺ/ㄼ-family coda realization under different following segments | Coda choice is context-sensitive. Do not turn either example into a broad global replacement for every ㄺ/ㄼ. |
| KUA-HO-004, 006, 008–010, 013–016, 019 | §23, §§12–13, dictionary entries, §24, §28 | Fortition, neutralization, morphological conditioning, compounds | Several different licensing environments are represented. A surface fortis consonant alone does not identify whether §23, §24, §28, or a lexical entry licenses it; require the relevant boundary and source scope. |
| KUA-HO-007, 017 | §12 commentary / §13: 끓이다, 끝을 | ㅎ deletion and liaison across a vowel-initial ending | Preserve an explicit trace from the source coda to the surface onset/nucleus; do not treat the resulting Hangul sequence as a direct grapheme rewrite. |
| KUA-HO-011, 021 | §15 and §§4–5: 범위, 계산 | Vowel realization and accepted alternate readings | Variant generation must be typed and preserved as alternatives. The `계산` source explicitly permits two Hangul surface readings; neither is an IPA gold label. |
| KUA-HO-012 | §20: 절약 | Rule scope around the written ㅈ/ㄹ sequence | Use the cited rule and official reading as a scoped check, not as evidence for an unrelated global palatalization or liquid rule. |
| KUA-HO-020 | §29: 훗일 | Compound boundary, n-insertion, liquid/nasal sequence, length | The case is a compound-level interaction. Keep segmental process, length marking, and syllable boundaries independently inspectable. |
| KUA-HO-022–024 | §6 commentary: 간간, 영영, 시시비비 | Lexically conditioned vowel length | Length must survive as a distinct IPA feature through normalization and target adaptation; stripping `ː` can inflate apparent exactness and conceal a real contrast. |

## Hypotheses to test against the diagnostic artifact

1. **Rule interaction dominates simple grapheme mapping.** Several forms need multiple ordered operations (e.g. complex-coda handling plus liaison or neutralization plus fortition). Inspect rule traces in sequence, not only the final surface string.
2. **Boundary knowledge is a likely bottleneck.** Cases tied to §§23–28 or compound/dictionary-specific readings may be underdetermined by Hangul alone. The research engine should expose a blocked/uncertain state instead of widening a rule globally.
3. **Lexical specificity is unevenly distributed.** The source set intentionally mixes standard-rule commentary and NIKL Q&A/dictionary-specific forms. These are different evidence types and should remain separate in provenance; a Q&A attestation does not establish a productive rule.
4. **Length and vowel variants are orthogonal to consonant rules.** The §6 and §4/§5 cases are useful checks that the IPA layer preserves length and accepted variants rather than collapsing them during comparison.
5. **IPA and Ukrainian target readiness must be measured separately.** A source-comparator match only indicates a plausible Korean surface path. IPA remains provisional until two independent reviews and adjudication; Ukrainian output remains a heuristic target-layer result until a separately reviewed Ukrainian gold set exists.

## Acceptance and interpretation

- The generated artifact is the auditable place to inspect per-case native strict/soft traces, g2pK surface/IPA, and Ukrainian target availability.
- Compare engine surface Hangul to NIKL spellings only as a diagnostic proxy, accounting for listed alternatives. Do not report this as IPA accuracy, and do not infer an overall winner from 24 deliberately selected rule cases.
- No output in this report may be copied into the frozen manifest, lexical pronunciation CSV, rule licenses, normalization map, or regression gold. Any proposed implementation fix must be justified independently by an official rule/source and evaluated on non-holdout development data.
- Gold gate remains 0/24 independently adjudicated IPA items. The Ukrainian-target gold gate remains open. This work is research instrumentation, not release certification.

## CI

Workflow: `.github/workflows/korean-holdout-diagnostic.yml`. It runs the diagnostic-specific tests, creates the JSON in the runner temporary directory, and uploads `clippyfirst-korean-24-form-holdout-diagnostics` as a 30-day artifact. The exact-head workflow result is authoritative; do not call this complete until it passes.
