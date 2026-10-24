# Ukrainian target layer

## Contract

The intended pipeline is:

`Korean orthography → structural and morphophonological analysis → Korean surface IPA → ClippyFirst IPA correspondence → Ukrainian practical orthography`.

The production target renderer is `src/korean_ukrainian/ipa_target_renderer.py`. It accepts IPA only; it does not accept Hangul or Jamo as mapping inputs. It reads `data/korean/canonical_correspondence.csv` plus explicit sequence overrides in `data/korean/ipa_target_overrides.csv`, applies longest-match tokenization, and returns a per-segment trace with mapping ID, status, provenance, word/syllable indices and length-marker handling.

## Runtime ownership and optional dependency

The ClippyFirst engine owns the Korean-specific IPA→Ukrainian practical mapping. The separate `ClippyFirst/Ukrainian-Phonetic-Inventory` package (UPI 0.8.0) is optional and is used only for target phoneme/feature metadata and candidate-analysis diagnostics. UPI's feature similarity and heuristic ranking never select the production practical output. Missing UPI therefore makes its diagnostics unavailable, not the IPA-derived target output.

The Python native and G2P adapters share the same target renderer. The unresolved-Korean-phonology gate remains upstream: IPA marked `diagnostic_only_unresolved_pronunciation` is inspectable for research but must not produce Ukrainian orthography. Unknown IPA, conflicting mappings, empty IPA and unmapped sequences fail closed; no nearest-feature fallback or Hangul-keyed Ukrainian fallback is allowed.

The contract is recorded in `data/correspondence/target_contract.csv`:
- `ukrainian_inventory`: optional external UPI metadata/candidate diagnostics.
- `korean_ipa_to_ukrainian`: local ClippyFirst practical output from canonical correspondences and explicit overrides.

## Status semantics

- `model-selected`: the repository contains an explicit mapping decision. It is not a normative Ukrainian standard and is not independently adjudicated gold.
- `provisional`: at least one mapping in the output remains a research hypothesis/review item.
- `unavailable`: input is empty/invalid, an IPA sequence is unmapped, mappings conflict, or the upstream pronunciation is diagnostic-only.

The score type for practical output is `explicit_correspondence_not_probability`. The optional UPI score type is `heuristic_cost`; it is diagnostic and must never be reported as a probability or used as the output authority.

## Verification and scientific limits

The regression suite checks:
- longest-match tokenization and trace/output consistency;
- explicit sequence overrides and mapping provenance;
- retention of source IPA length markers without inventing a Ukrainian length sign;
- fail-closed behavior for unknown or ambiguous IPA;
- reproducibility of the 643 declared lexical rows and 45 declared alternate readings;
- provisional status for `ɰi → ий`, `ø → ве`, `y → ві`, and `kʰjʌ → кхьо` where those mappings are used.

The lexical reproduction checks are internal consistency tests: they prove that declared project data reproduces itself, not that the declared Ukrainian forms are independently correct.

The original frozen 24-form holdout has **not** been recovered from a verifiable source in the reviewed mainline history. This PR intentionally does not add the unverified candidate reconstruction or treat it as gold. Acceptance of the original holdout requires a source artifact/run input or historical revision establishing exact membership and order, plus a separate evidence record.

## Remaining gates

1. Recover and verify the original 24-form fixture; preserve its membership and order and record an immutable source locator/hash.
2. Reconcile the historical 7 phonology / 17 target blocker report against the exact same input list and blocker taxonomy.
3. Obtain independent Korean phonology/IPA adjudication for unresolved cases. NIKL surface Hangul evidence is not automatically IPA gold.
4. Review Ukrainian practical mappings independently on a frozen IPA input set; keep source pronunciation and target adaptation as separate decisions.
5. Continue auditing rule exceptions, morphology licensing, variants and Python/browser parity. Passing CI does not establish exhaustive normative coverage.

**Release classification:** research preview / partial prototype, not release-ready.
