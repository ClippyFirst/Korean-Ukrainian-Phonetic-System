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