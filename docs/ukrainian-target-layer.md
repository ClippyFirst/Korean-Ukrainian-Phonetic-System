# Ukrainian target layer

## Contract

The intended pipeline is:

`Korean orthography → structural and morphophonological analysis → Korean surface IPA → ClippyFirst IPA correspondence → Ukrainian practical orthography`.

Terminology boundary: this target renderer is not the Korean surface-to-IPA module in src/korean_ukrainian/ipa.py. That upstream module's realize_syllables() function derives broad IPA from an already determined Korean surface Hangul form. The g2pK comparison adapter uses it to convert g2pK's Hangul pronunciation spelling to IPA; the Native path shares the same IPA realization layer. Neither that adapter nor the IPA-to-Ukrainian target renderer should be described as the other.

The production target renderer is `src/korean_ukrainian/ipa_target_renderer.py`. It accepts IPA only; it does not accept Hangul or Jamo as mapping inputs. It reads `data/korean/canonical_correspondence.csv` plus explicit sequence overrides in `data/korean/ipa_target_overrides.csv`, applies longest-match tokenization, and returns a per-segment trace with mapping ID, status, provenance, word/syllable indices and length-marker handling.

## Runtime ownership and optional dependency

The ClippyFirst engine owns the Korean-specific IPA→Ukrainian practical mapping. The separate `ClippyFirst/Ukrainian-Phonetic-Inventory` package (UPI 0.8.0) is optional and is used only for target phoneme/feature metadata and candidate-analysis diagnostics. UPI's feature similarity and heuristic ranking never select the production practical output. Missing UPI therefore makes its diagnostics unavailable, not the IPA-derived target output.

The Python native and G2P adapters share the same target renderer. The unresolved-Korean-phonology gate remains upstream: IPA marked `diagnostic_only_unresolved_pronunciation` is inspectable for research but must not be promoted to accepted Ukrainian orthography. Unknown IPA, conflicting mappings, empty IPA and unmapped sequences fail closed. One explicit exception is the opt-in Browser Super-soft research mode described below: it may construct a typed, low-confidence IPA candidate from the repository's grapheme correspondence table, then pass that IPA through the same IPA→Ukrainian renderer. It is never a silent or accepted pronunciation.

The browser's `src/app/ipa_target_data.js` is a generated projection of these same CSVs, produced by `scripts/generate_ipa_target_data.py`; the Python suite runs the generator with `--check` to detect drift. Browser and Python target traces should agree on target text, mapping IDs and status for the same IPA.

The contract is recorded in `data/correspondence/target_contract.csv`:
- `ukrainian_inventory`: optional external UPI metadata/candidate diagnostics.
- `korean_ipa_to_ukrainian`: local ClippyFirst practical output from canonical correspondences and explicit overrides.

## Mapping status and project decisions

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
- provisional status for `ɰi → ий`, `ø → ве`, `y → ві`, and `kʰjʌ → к'хьо` where those mappings are used.

The lexical reproduction checks are internal consistency tests: they prove that declared project data reproduces itself, not that the declared Ukrainian forms are independently correct.

The original frozen 24-form holdout has **not** been recovered from a verifiable source in the reviewed mainline history. This PR intentionally does not add the unverified candidate reconstruction or treat it as gold. Acceptance of the original holdout requires a source artifact/run input or historical revision establishing exact membership and order, plus a separate evidence record.

## Remaining gates

1. Recover and verify the original 24-form fixture; preserve its membership and order and record an immutable source locator/hash.
2. Reconcile the historical 7 phonology / 17 target blocker report against the exact same input list and blocker taxonomy.
3. Obtain independent Korean phonology/IPA adjudication for unresolved cases. NIKL surface Hangul evidence is not automatically IPA gold.
4. Review Ukrainian practical mappings independently on a frozen IPA input set; keep source pronunciation and target adaptation as separate decisions.
5. Continue auditing rule exceptions, morphology licensing, variants and Python/browser parity. Passing CI does not establish exhaustive normative coverage.

**Release classification:** research preview / partial prototype, not release-ready.


## Production acceptance gate for provisional target correspondences

The strict Python API `render_ipa_sequence_to_ukrainian(ipa)` and browser source adapter `ipaTargetForSource(source, ipa)` withhold final Ukrainian orthography whenever any matched IPA→Ukrainian correspondence is `provisional`. They return an unavailable result, an explicit `provisional_mapping_requires_review` reason, and a separate `candidate_orthography`/`candidateText` for inspection. Research-only candidate rendering is explicit: Python `allow_provisional=True`; browser `{ allowProvisional: true }`. The interactive research pipeline opts in to display a candidate, but preserves `provisional` status and trace metadata in its result. This is a research-preview usability choice, not a claim of adjudicated correctness.

This gate is deliberately conservative: a candidate such as `ɰi → ий`, `ø → ве`, `y → ві`, or `kʰjʌ → кхьо` is not asserted to be correct merely because a project row exists. Existing model-selected mappings remain explicit project decisions rather than independently adjudicated gold. To promote any provisional row, add independent linguistic/target review evidence and regression cases first.


## Unavailable browser IPA results are not empty-string successes

The public `ipaTargetForSource` adapter returns `text: null` when IPA is empty, contains an unmapped segment, or does not align with the Hangul syllable count. In these cases it also withholds partial syllable output and partial mapping traces from the result. This distinguishes a genuine empty string (not a valid Korean transcription) from a failed target rendering and mirrors the Python renderer's `ukrainian_orthography: null` contract.


### Reject IPA with no renderable segments

A sequence made only of syllable delimiters, word-boundary markers, or vowel-length marks (for example `.`, `#`, or `ː`) is not a valid successful target rendering. Both Python and browser adapters now return an unavailable result with `no_renderable_ipa_segments`; they do not return an empty Ukrainian spelling or mark modifier-only IPA as `model-selected`.


The browser labels `model-selected` output as a project-defined correspondence that has not been independently validated. This is not a claim that the output is wrong; it accurately distinguishes deterministic application of the author's system from independent target-language adjudication.

## Korean aspiration and fortis output convention (2026-10-29)

- Aspirated onsets use an apostrophe immediately after the Ukrainian consonant: /kʰ/ → к', /tʰ/ → т', /pʰ/ → п', /tɕʰ/ → ч'. Thus /kʰjʌ/ → к'хьо, preserving the existing /jʌ/ target while marking aspiration.
- Fortis onsets preserve doubling: /k͈/ → кк, /t͈/ → тт, /p͈/ → пп, /s͈/ → сс, /tɕ͈/ → чч.
- IPA remains the only input to the target adapter; these are IPA-to-Ukrainian correspondence decisions, not direct Hangul substitutions.
- These are project-specific practical orthography choices, not a claim about a national Ukrainian standard.


## Explicit grapheme-table fallback for unresolved cases

The user-approved fallback policy is implemented in the Browser **Super-soft** research mode. When a morphophonological context cannot be resolved under the strict rules, this mode may use the per-grapheme entries in `data/korean/canonical_correspondence.csv` to construct an approximate, explicitly typed IPA candidate. That candidate is then sent through the same IPA target renderer and correspondence trace as ordinary IPA; the implementation does not directly substitute Hangul/Jamo with Ukrainian letters.

The fallback contract is deliberately narrow:

- `phoneticResultType: orthographic-phonemic-fallback`;
- `status: super-soft-orthographic-fallback`;
- `confidence: low`, with the unresolved morphology flags retained;
- output remains in the candidate channel, never the accepted `ukrainian` field;
- the fallback is excluded from source-resolved IPA Exact/CER scoring and must be counted separately;
- unknown IPA or a missing target correspondence still fails closed rather than inventing a Ukrainian letter;
- Strict and Soft behavior are unchanged.

The table is the repository's **project practical correspondence table**, not a government-issued or independently certified Ukrainian standard. Its current rows are marked `model-selected`; this means the project has made an explicit mapping decision, not that an external authority has approved it. The 11,172-syllable Super-soft test proves structural candidate availability from this table, not pronunciation accuracy or target-language correctness.

A relevant scholarly background source is O. M. Shchehel, “Практична транскрипція корейських імен українською мовою: порівняння, проблеми і пропозиції”, *Мовознавство* 1 (2009), pp. 76–87: https://movoznavstvo.org.ua/vsi-nomera-zhurnalu/statti/2009-1-sichen-lyutij/shchegel-o-m-praktichna-transkriptsiya-korejskikh-imen-ukrajinskoyu-movoyu-porivnyannya-problemi-i-propozitsiji. The article proposes practical transcription decisions for Korean names; it does not establish a current state-approved Ukrainian standard or supply a complete authoritative IPA-to-Ukrainian grapheme table. Accordingly, the repository labels its own table as a project convention rather than misattributing official normativity to that article.

The Python native/G2P API currently keeps its strict/soft unresolved gate and does not yet expose this Browser Super-soft fallback as a cross-runtime mode. This is intentional until a Python implementation can preserve identical provenance, trace statuses and candidate-only semantics with parity tests.
