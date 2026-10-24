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


## Case-by-case research questions (all 24)

| ID | Source-attested Hangul reading | Specific diagnostic question |
|---|---|---|
| KUA-HO-001 | 닭은 → 달근 | Does the engine split ㄺ as coda ㄹ plus resyllabified ㄱ before the vowel-initial ending, rather than treating ㄺ as an indivisible coda? |
| KUA-HO-002 | 흙은 → 흘근 | Same coda family as 001 in a second lexical item: does the trace show the same licensed structural operation, with no item-specific hack? |
| KUA-HO-003 | 여덟은 → 여덜븐 | Does ㄼ retain ㄹ in the source syllable while ㅂ surfaces as the next onset before a vowel? |
| KUA-HO-004 | 보잘것없지만 → 보잘꺼덥찌만 | Can the trace explain the compound/ending sequence through ordered, separately licensed changes rather than a full-word spelling replacement? |
| KUA-HO-005 | 긁개 → 글깨 | Is the ㄺ-before-ㄱ exception applied in its narrow environment, and is the resulting fortis onset traceable to its own rule? |
| KUA-HO-006 | 젖살 → 젇쌀 | Are final neutralization and following ㅅ fortition represented as distinct ordered events? |
| KUA-HO-007 | 끓이다 → 끄리다 | Does the ㄹㅎ coda lose ㅎ while ㄹ is linked to the following vowel, with an explicit source-rule trace? |
| KUA-HO-008 | 국보급 → 국뽀끕 | Is this Q&A/dictionary-specific reading kept distinct from a productive rule inferred merely from the spelling 국보급? |
| KUA-HO-009 | 비교급 → 비ː교끕 | Are the long vowel and the dictionary-attested fortis onset both preserved as independent features? |
| KUA-HO-010 | 수준급 → 수준끕 | Does the engine avoid copying the fortition decision from 008/009 without evidence that the environment is the same? |
| KUA-HO-011 | 범위 → 버뮈 | Is the source's vowel realization represented through the pronunciation layer, not by a direct Ukrainian mapping from Hangul? |
| KUA-HO-012 | 절약 → 저략 | Can the exact §20 source scope be identified in the trace? Treat this as a rule-scope probe, not as evidence for a generalized liquid rule. |
| KUA-HO-013 | 찜닭 → 찜닥 | Is the dictionary-specific realization of the complex coda distinguished from the vowel-initial liaison contexts in 001–003? |
| KUA-HO-014 | 신기다 → 신기다 | Negative/contrastive control: does the engine refrain from applying fortition simply because §24 is named in the source metadata? |
| KUA-HO-015 | 싶었던 → 시펃떤 | Can the trace keep the cited §13/§9/§23 sequence explicit without collapsing the compound environment into a single opaque rewrite? |
| KUA-HO-016 | 발걸음 → 발꺼름 | Is compound fortition applied with the relevant boundary/license, not as a universal rule after any coda? |
| KUA-HO-017 | 끝을 → 끄틀 | Is the coda ㅌ re-associated with the vowel-initial particle through the normal liaison pathway? |
| KUA-HO-018 | 여덟과 → 여덜과 | Contrast with 003: before a consonant, does the engine retain the licensed ㄹ realization rather than incorrectly moving ㅂ into the following onset? |
| KUA-HO-019 | 팔심 → 팔씸 | Is fortition at the compound boundary distinguished from stem-plus-ending fortition? |
| KUA-HO-020 | 훗일 → 훈ː닐 | Are compound-triggered n-insertion, subsequent nasal/liquid behavior, and length tracked separately rather than merged into one opaque outcome? |
| KUA-HO-021 | 계산 → 계ː산 ~ 게ː산 | Are both source-attested vowel readings retained as variants, with length preserved on each appropriate reading? |
| KUA-HO-022 | 간간 → 간ː간 | Does lexical vowel length survive IPA serialization and any downstream normalization? |
| KUA-HO-023 | 영영 → 영ː영 | Same length-preservation probe with a different vowel/consonant context; avoid a one-word length patch. |
| KUA-HO-024 | 시시비비 → 시ː시비비 | Does the length-bearing first syllable remain distinguishable in multi-syllabic output and through the IPA-to-Ukrainian boundary? |

## Strongest contrasts in the set

- **Same coda, different following environment:** 003 (`여덟은`) versus 018 (`여덟과`) is the clearest control against a context-free ㄼ replacement. The vowel-initial case can redistribute the second component; the consonant-initial case must not be handled by that same liaison path.
- **Rule versus lexical evidence:** 008–010, 013 and 018 explicitly carry dictionary/Q&A provenance. They should diagnose whether source-backed exceptions are represented; they do not independently justify adding a general rule.
- **Positive and negative morphology probe:** 014 is explicitly attested as unchanged under a §24-labelled source context, while 004/015/016/019 involve other fortition-related environments. The implementation must respect each rule's licensing conditions rather than learn “fortition everywhere.”
- **Length and variant controls:** 009, 020–024 collectively test whether `ː` survives as a feature and whether allowed alternatives remain alternatives. A normalized string that deletes length may be useful for a narrow segmental comparison but cannot certify a full IPA match.
- **Multi-rule interactions:** 004, 006, 007, 015 and 020 should be read as trace-level cases. A final Hangul match without an inspectable ordered trace is insufficient to conclude that the engine implemented the right phonological analysis.

## Hypotheses to test against the diagnostic artifact

1. **Rule interaction dominates simple grapheme mapping.** Several forms need multiple ordered operations (e.g. complex-coda handling plus liaison or neutralization plus fortition). Inspect rule traces in sequence, not only the final surface string.
2. **Boundary knowledge is a likely bottleneck.** Cases tied to §§23–28 or compound/dictionary-specific readings may be underdetermined by Hangul alone. The research engine should expose a blocked/uncertain state instead of widening a rule globally.
3. **Lexical specificity is unevenly distributed.** The source set intentionally mixes standard-rule commentary and NIKL Q&A/dictionary-specific forms. These are different evidence types and should remain separate in provenance; a Q&A attestation does not establish a productive rule.
4. **Length and vowel variants are orthogonal to consonant rules.** The §6 and §4/§5 cases are useful checks that the IPA layer preserves length and accepted variants rather than collapsing them during comparison.
5. **IPA and Ukrainian target readiness must be measured separately.** A source-comparator match only indicates a plausible Korean surface path. IPA remains provisional until two independent reviews and adjudication; Ukrainian output remains a heuristic target-layer result until a separately reviewed Ukrainian gold set exists.

## Important linguistic qualification: vowel length is dialect- and speech-style-sensitive

The official NIKL length mark is a normative source annotation, but it should not be mistaken for a guarantee that every contemporary speaker realizes a stable phonemic duration contrast. Research on Seoul Korean reports substantial weakening/merger among younger speakers; corpus work also reports lexical-frequency effects ([Kang et al., *Frequency Effects on the Vowel Length Contrast Merger in Seoul Korean*](https://www.degruyterbrill.com/document/doi/10.1515/lp-2015-0014/html)). Experimental work finds that read-aloud and spontaneous/map-task speech can differ: length differences were small but significant in read speech and absent in the spontaneous task for the study sample ([Lee & Shin 2016](https://doi.org/10.13064/KSSS.2016.8.1.037)).

**Implication for ClippyFirst:** cases 009 and 020–024 should test whether the system preserves the source's length annotation in the declared broad-IPA contract, not prove that every current speaker will produce that duration. The reviewer protocol should state the target variety (e.g. standard Seoul Korean), source type (normative/dictionary vs recorded speech), and transcription convention. If the project is transcribing an actual speaker, audio and speech style may override a dictionary length mark; if it is rendering normative dictionary pronunciation, retain the mark with provenance. Do not remove `ː` just to increase normalized benchmark exact match.

## Acceptance and interpretation

- The generated artifact is the auditable place to inspect per-case native strict/soft traces, g2pK surface/IPA, and Ukrainian target availability.
- Compare engine surface Hangul to NIKL spellings only as a diagnostic proxy, accounting for listed alternatives. Do not report this as IPA accuracy, and do not infer an overall winner from 24 deliberately selected rule cases.
- No output in this report may be copied into the frozen manifest, lexical pronunciation CSV, rule licenses, normalization map, or regression gold. Any proposed implementation fix must be justified independently by an official rule/source and evaluated on non-holdout development data.
- Gold gate remains 0/24 independently adjudicated IPA items. The Ukrainian-target gold gate remains open. This work is research instrumentation, not release certification.

## CI

Workflow integration: `.github/workflows/test.yml` runs the diagnostic-specific tests within the normal Python matrix, then Python 3.12 creates the JSON in the runner temporary directory and uploads `clippyfirst-korean-24-form-holdout-diagnostics` as a 30-day artifact. This uses the repository's existing PR-triggered workflow rather than introducing a duplicate workflow that would not be available from the base branch. The exact-head result is authoritative; do not call this complete until it passes.
