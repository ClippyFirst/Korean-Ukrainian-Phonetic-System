# Hanja research layer: engine selection and integration contract — 2026-10-29

## Decision

Treat Hanja conversion as a separate, optional Korean-language research module. Do not change the existing output order or pipeline:

1. Revised Romanization (RR)
2. Korean IPA
3. Ukrainian practical transcription
4. Hanja annotation (optional mixed Hangul–Hanja rendering)

Hanja output is orthographic/lexical annotation, not transliteration, pronunciation, or translation. It must never feed the IPA or Ukrainian target adapter.

## Candidate review

### A. Evsio0n/hanja-wsd — first candidate for contextual quality

- Repository: https://github.com/Evsio0n/hanja-wsd
- Model card: https://huggingface.co/LinkinShan/hanja-wsd-base
- Direction matches the requirement: plain Hangul → context-selected mixed Hangul–Hanja.
- The described approach uses dictionary candidates plus an XLM-R cross-encoder; Korean particles, endings, and native Korean words are retained in Hangul.
- The project is explicitly a non-commercial research preview. The model card/repository terms must be reviewed separately for code, checkpoint weights, lexicon, priors, and training/evaluation data before bundling or redistribution.
- It is a Python/PyTorch model with separately downloaded assets, not a small browser-only library. Do not put its weights into the static Pages bundle or add a remote inference call without a separately reviewed service, security policy, and deployment budget.
- The published evaluation includes caveats about gold coverage and preview checkpoints. Reproduce a task-specific evaluation before claiming production accuracy.

**Disposition:** best candidate for an isolated local research adapter, subject to license audit and reproducibility. No model weights or external code are vendored by this change.

### B. Kyubyong/h2h_converter — lightweight historical baseline

- Repository: https://github.com/Kyubyong/h2h_converter
- The upstream README declares MIT and describes Hangul → Hanja conversion trained on a public-domain Korean Revised Version Bible-derived corpus.
- It depends on TensorFlow 1.3 and an older bidirectional-GRU implementation. Its domain and age make it a baseline, not the default integration.
- Inspect the actual license file, data transformation provenance, and current runtime compatibility before execution or reuse.

**Disposition:** optional reproducibility baseline only; do not select as the public service engine without a maintained port and modern-domain evaluation.

### C. UTagger

- Project information: https://klplab.ulsan.ac.kr/doku.php?id=start
- Relevant Korean morphological analysis and word-sense disambiguation capabilities are documented, but some libraries/API/data are subject to technology-transfer terms; research access and commercial use terms differ.
- The exact artifact, current availability, and terms applicable to this project have not been verified.

**Disposition:** BLOCKED pending confirmation of a specific downloadable artifact and written applicable license/terms. Do not assume that research intent automatically grants access or redistribution rights.

### D. Hanjaro

- Service: https://hanjaro.juntong.or.kr/
- It is a useful reference for contextual Hangul–Hanja conversion and presentation. A public web service is not an integration license or stable API contract.

**Disposition:** UX/reference comparator only unless an official reusable API and its terms are verified.

### E. Gukhanmun

- Repository: https://github.com/dahlia/gukhanmun
- JavaScript/WebAssembly and Rust support are attractive for the static site, but the direction is Hanja/mixed-script → Hangul, not Hangul → Hanja.
- GPL-3.0 applies to its code and packaged dictionary artifacts as described upstream.

**Disposition:** not the conversion engine for this feature. Revisit only if accepting Hanja input and displaying Hangul readings becomes a separate requirement.

## Product and architecture contract

- Preserve the current result sequence and existing output behavior.
- Add Hanja as a separately labelled, opt-in fourth output. It must not replace the original Hangul input or any of the existing three results.
- Preferred display is mixed script, e.g. `政府는 經濟 發展을 위해 공사를 시작했다.`; this is an illustrative format example, not a verified model output.
- Preserve particles, endings, native Korean vocabulary, punctuation, whitespace, and non-Korean spans. Do not blindly replace every Hangul syllable with a same-sound Hanja character.
- Surface candidate uncertainty and abstain on unsupported/low-confidence spans rather than fabricating a reading.
- Clearly label the result as contextual Hanja annotation, not a Korean translation, not Chinese text, and not a pronunciation output.
- The existing static page has a restrictive Content Security Policy (`connect-src 'none'`). A remote model API must not be added by weakening that policy casually. Any hosted inference must be an explicit architecture/security decision.
- Do not load a large neural checkpoint on each browser page load. The first prototype should use an isolated local model adapter or a separately deployed, explicitly configured service. If no acceptable service exists, keep the feature research-only until the engine can be packaged responsibly.

## Evaluation gate

Before enabling this output by default, prepare a source-attributed held-out set containing:
- homographs whose Hanja depends on sentence context (including noun senses and verbal/adjectival uses);
- Sino-Korean vocabulary with multiple candidate spellings;
- native Korean words that must remain Hangul;
- particles, endings, names, numbers, punctuation, and mixed-language text;
- rare/unknown terms where abstention is the correct result.

Report sentence-level exact match, Hanja-span precision/recall/F1, incorrect-conversion rate on spans that should remain Hangul, abstention/coverage, and latency on declared hardware. Split by source/document to reduce leakage. Do not use the same examples for prompt/rule tuning and final evaluation. Publish denominators, normalization rules, and dataset licenses.

## Task ledger

| Task | Status | Acceptance evidence |
|---|---|---|
| Identify a direction-matching Hangul → Hanja engine | DONE_VERIFIED (discovery only) | Public repo and model card identify contextual Hangul → mixed-script conversion. This is not validation of accuracy. |
| Identify candidate licensing constraints | PARTIAL | Non-commercial research terms are visible for hanja-wsd; code/weights/data and downstream distribution still require separate review. |
| Verify a reusable production-compatible artifact | TODO | Pin exact code/model/data revisions; inspect every applicable license and redistribution condition. |
| Build held-out Hanja evaluation corpus | TODO | Provenance and licensing registry, source-separated split, manually reviewed target spans, and reproducible scorer. |
| Implement isolated adapter and uncertainty contract | TODO | Unit tests for mixed-script preservation, confidence/abstention, errors, and deterministic behavior. |
| Integrate optional fourth output into the browser UI | TODO | UX tests prove existing RR/IPA/Ukrainian output order and values remain unchanged; no unexpected network requests. |
| Run end-to-end evaluation and build | TODO | Exact-head CI passes; model/data downloads are pinned and reproducible; measured quality/latency and limitations documented. |
| Commercial reuse rights | DEFERRED | Not required for the currently stated non-commercial research scope, but must be revisited before any commercial deployment or monetization. |

## Current blocker

The browser service is static GitHub Pages and the current CSP prohibits outbound connections. The strongest candidate is a separately installed Python/PyTorch model, not a small browser module. A correct implementation therefore needs a reproducible local research adapter or an explicitly configured service; wiring the static page to an unverified third-party endpoint is not acceptable. The research intent supports considering non-commercial licenses, but does not waive their conditions.

## Sources checked

- https://github.com/Evsio0n/hanja-wsd
- https://huggingface.co/LinkinShan/hanja-wsd-base
- https://huggingface.co/LinkinShan/hanja-wsd-large
- https://github.com/Kyubyong/h2h_converter
- https://klplab.ulsan.ac.kr/doku.php?id=start
- https://hanjaro.juntong.or.kr/
- https://github.com/dahlia/gukhanmun
