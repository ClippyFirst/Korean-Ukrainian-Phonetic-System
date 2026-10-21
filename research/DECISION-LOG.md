# Decision Log

Record consequential linguistic, data, architecture, testing, licensing, and release decisions. Keep entries append-only. If a decision changes, add a superseding entry rather than erasing history.

## Entry template
### DEC-YYYY-NNN — Short title
- Date:
- Status: proposed / accepted / rejected / superseded
- Context/problem:
- Evidence and sources:
- Options considered:
- Decision:
- Consequences and trade-offs:
- Affected files/rule IDs/runtimes:
- Validation/tests:
- Revisit when:

---

## DEC-2026-001 — Preserve IPA-first architecture
- **Date:** 2026-10-15
- **Status:** accepted as a project invariant; verify actual compliance during Phase 0.
- **Context:** Parallel Hangul-to-Ukrainian substitution can diverge from pronunciation analysis and makes output difficult to explain and validate.
- **Evidence:** Existing project architecture and master directive; Phase 0 must verify all execution paths.
- **Options:** Direct orthographic substitution; independent Ukrainian conversion; conversion through pronunciation representation and IPA.
- **Decision:** Keep the canonical path pronunciation analysis → IPA → Ukrainian rendering. No independent Hangul-to-Ukrainian shortcut may bypass it.
- **Consequences:** Clearer diagnostics and layer-specific tests; IPA representation and mapping must be explicit and well tested.
- **Validation:** Add architecture/contract tests after runtime entry points are inventoried.
- **Revisit when:** Only if evidence requires a formally equivalent representation that preserves the IPA-first contract.

## DEC-2026-002 — Keep heuristic morphology explicitly lower-confidence
- **Date:** 2026-10-15
- **Status:** accepted as a transparency invariant; implementation must be verified.
- **Context:** Surface-form heuristics can license alternations without sufficient lexical or morphological evidence.
- **Evidence:** Existing soft morphology design documentation; exact current code and behavior remain to be audited.
- **Options:** Apply heuristics silently; disable all uncertain cases; provide opt-in, marked, fail-closed heuristic output.
- **Decision:** Heuristic results must remain explicitly labelled and must not be presented as official normative certainty. Strict behavior remains the default unless the audited product contract says otherwise.
- **Consequences:** Some cases remain unresolved, but users are not given unsupported confidence.
- **Validation:** Verify confidence/status propagation, strict-mode defaults, and that heuristics cannot license excluded rule classes.
- **Revisit when:** A validated lexical/morphological analyzer and independent evaluation justify a revised policy.

## DEC-2026-003 — Practical browser mode is strict to the pinned JavaScript port
- **Date:** 2026-10-21
- **Status:** accepted and merged to main in PR #167.
- **Context/problem:** Research lexical corrections after G2P made the public practical mode cease to reproduce the chosen upstream JavaScript port.
- **Evidence:** Direct adapter-vs-port regression gate over 18 fixed cases; exact-head CI runs 39597726122, 39597726175, 39597726128, and 39597726141; merged implementation commit fde3113fe97a34582228abcd870e64a690cf9d09.
- **Options considered:** silently correct upstream output; keep port output and document divergences; route practical mode through the native research engine.
- **Decision:** Practical mode preserves pinned port output, then maps that surface through the IPA adapter. Research mode remains separate. No lexical override may rewrite the practical surface or IPA.
- **Consequences and trade-offs:** Exact behavioral parity is reproducible, but upstream output is not treated as normative gold. Known divergences include 값어치 (port 갑써치; NIKL 가버치), 넓죽하다 (port 널쭈카다; NIKL 넙쭈카다), and 읽고 (port 익꼬; NIKL 일꼬).
- **Affected files/rule IDs/runtimes:** src/app/g2pk_web.js; src/main.js; tests/g2pk-browser-parity-gate.test.mjs; tests/fixtures/g2pk-surface-regression.json; public browser runtime.
- **Validation/tests:** All four exact-head CI groups passed before merge; main deployment workflow passed on merge commit.
- **Revisit when:** The user explicitly changes the practical-mode contract or a versioned port upgrade is proposed with a new parity corpus.

## DEC-2026-004 — Ukrainian target output remains an explicitly provisional project policy
- **Date:** 2026-10-21
- **Status:** accepted as a documentation/claim boundary; empirical validation remains open.
- **Context/problem:** Ukrainian transcription scholarship reviewed by the project addresses mainly proper names and includes disagreements; it does not establish one universal mapping for all Korean vocabulary.
- **Evidence:** docs/ukrainian-target-review-2026-10-10.md; research/UKRAINIAN-TARGET-LAYER-COMPARISON-2026-10-16.md; mechanical IPA-to-target consistency test; source register entries for Shchehel (2009) and Kovalchuk (2011).
- **Options considered:** claim one mapping is authoritative; silently adopt one proper-name proposal for all words; preserve current mapping as a project policy and label it provisional.
- **Decision:** Preserve the inspectable IPA layer and the existing explicit IPA-to-Ukrainian mapping as a practical project approximation. Do not call it an official Ukrainian standard, an empirically optimal mapping, or a validated universal proper-name policy. Do not rewrite individual lexical targets without evidence.
- **Consequences and trade-offs:** Mechanical consistency can be tested now, while perceptual quality and policy preferences remain unresolved. A reader study and independent review are required before stronger claims.
- **Affected files/rule IDs/runtimes:** data/korean/canonical_correspondence.csv; src/app/engine_ipa.js; src/korean_ukrainian/ukrainian_adapter.py; README.md; index.html.
- **Validation/tests:** Existing model-wide IPA/target consistency tests validate reproducibility only, not target optimality.
- **Revisit when:** At least two independent Korean/Ukrainian reviewers and reader-evaluation evidence are available.

## DEC-2026-005 — Soft morphology must fail closed on ambiguous liaison and keep cross-runtime status parity
- **Date:** 2026-10-21
- **Status:** implementation added on branch fix/soft-morphology-parity-and-release-gates-2026-10-21; CI pending.
- **Context/problem:** Python soft_formal_licenses could emit a generic R002 formal license for ambiguous 어/아 sequences such as 값어치, while the browser layer deliberately refuses to guess §15-sensitive liaison.
- **Evidence:** Existing browser negative controls in tests/soft-heuristic-morphology-formal-endings.test.mjs; shared fixture tests/fixtures/soft-morphology-parity.json added in this branch.
- **Options considered:** loosen the browser guard; let Python guess; align Python with the browser fail-closed boundary and test both.
- **Decision:** Python soft mode no longer emits generic R002 licenses for 어/아, for ㅎ clusters handled by R003, or for simple-coda §15-sensitive environments. A shared fixture checks positive low-confidence cases and negative ambiguity/boundary cases in Python and JavaScript.
- **Consequences and trade-offs:** Some forms remain unresolved rather than guessed; this is intentional. This decision is not complete until exact-head CI passes.
- **Affected files/rule IDs/runtimes:** src/korean_ukrainian/soft_morphology.py; tests/test_soft_morphology_parity.py; src/app/soft_morphology.js; tests/soft-morphology-parity.test.mjs.
- **Validation/tests:** Pending branch CI; local execution unavailable in the API-only environment.
- **Revisit when:** A source-backed morphological analyzer or independent evidence supports a narrower rule for a previously blocked form.
