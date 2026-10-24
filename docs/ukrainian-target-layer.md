# Ukrainian target layer

## Contract: separate target inventory from Korean-specific correspondence

The pipeline is:

`Korean orthography → structural/phonological analysis → source IPA → Korean-specific IPA correspondence → Ukrainian practical orthography`.

The Ukrainian Phonetic Inventory (UPI) remains the external source of truth for Ukrainian phoneme/features/grapheme metadata and candidate-analysis diagnostics. The source-language-specific Korean→Ukrainian mapping policy belongs in this repository, downstream of the target inventory. UPI's generic mapping export is not treated as a complete Korean-to-Ukrainian correspondence table.

The contract is recorded in `data/correspondence/target_contract.csv`:

- `ukrainian_inventory`: UPI 0.8.0; target phoneme, feature and grapheme metadata, plus optional candidate analysis.
- `korean_ipa_to_ukrainian`: local contract 0.1.0; IPA sequence mappings from `data/korean/canonical_correspondence.csv` plus explicit, traceable exceptions in `data/korean/ipa_target_overrides.csv`.

## Runtime output

`src/korean_ukrainian/ipa_target_renderer.py` is the practical-output renderer. It accepts **IPA only**; it does not accept Hangul or Jamo as mapping inputs. It uses longest-match IPA sequence mappings, records a mapping ID and provenance for each emitted target segment, preserves syllable boundaries in the trace, and withholds the complete orthographic result if any source IPA fragment lacks a licensed mapping.

The production Python pipeline uses this renderer for both native and G2P-derived IPA. UPI candidate analysis remains available under `target_inventory_analysis`, but is explicitly diagnostic and is not the source of `ukrainian_orthography`. Therefore, an absent private UPI installation no longer suppresses a locally licensed IPA-derived result; it still leaves target-inventory diagnostics unavailable. This does **not** mean every IPA string is covered or that the resulting Ukrainian form is independently validated.

Length markers remain in the source IPA and are recorded in the target trace, but are not emitted as Ukrainian orthographic characters. IPA marked diagnostic-only because Korean phonology is unresolved is still blocked before target rendering. In particular, the mapping `ɰi → ий` does not override the native engine's diagnostic-only gate for unresolved readings of ㅢ.

## Mapping status and evidence boundary

- `model-selected` means the project has an explicit mapping decision, not that it is a normative Ukrainian transcription standard or an independently measured accuracy result.
- `provisional` marks a mapping requiring further review; a result containing one is returned with provisional status.
- The renderer reports the first unmapped IPA fragment and does not guess a nearest Ukrainian grapheme.
- The UPI heuristic candidate score remains a heuristic cost, never a probability, and does not determine the practical output.
- The 643-row lexical corpus and 45 licensed alternate readings are software consistency fixtures: a passing mapping-reproduction test establishes reproducibility of declared project outputs, not independent phonetic/orthographic gold accuracy.

## Dependency and remaining research blockers

UPI 0.8.0 is maintained in the separate private repository [ClippyFirst/Ukrainian-Phonetic-Inventory](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory). The base Korean project install does not automatically install it, so clean-install target-inventory analysis remains unavailable unless an authorized checkout is installed in the same environment. UPI PR [#10](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory/pull/10) addresses wheel data packaging, but its Actions run currently exposes no job steps/logs; it is left open and unverified.

The IPA renderer does not resolve upstream phonology. Seven native strict cases remain blocked by unresolved Korean pronunciation; these must stay withheld. The input-only 24-form fixture is now tracked at `data/korean/benchmarks/target-renderer-holdout-24.csv`, and `scripts/audit_target_renderer_holdout_24.py` records native/G2P IPA, output status, abstention reasons and mapping IDs. The original source manifest was not found, and the fixture contains no IPA or Ukrainian gold labels; the report is diagnostic only and does not establish target accuracy.

The mapping table is a project research decision surface. New target mappings require a source reference, scope, explicit status and a regression; do not add speculative mappings solely to improve a benchmark count.


### Holdout diagnostic result — 2026-10-24

The input-only candidate fixture is labelled `reconstructed_unverified`; its original source manifest and independent membership record remain unavailable. The successful optional g2pK workflow [run 40129831527](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40129831527) generated reports for Python 3.11 ([artifact 12573827559](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40129831527/artifacts/12573827559)) and Python 3.12 ([artifact 12574198636](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40129831527/artifacts/12574198636)). The fixture SHA-256 is `bd2dd4e28f40345a8aed50ec3ec24021efeaa9101bef7f943bed917a50ddaeeb`; neither IPA nor Ukrainian gold labels are available.

- Native strict: **19/24 candidate outputs**; 5 forms withheld as `unresolved_korean_phonology`: `닭은`, `흙은`, `여덟은`, `긁개`, `끓이다`.
- g2pK: **24/24 candidate outputs**. All 24 source IPA records are typed `ipa-derived-from-g2pk-surface-form`; target output statuses are 23 `model-selected` and 1 `provisional`. These are candidate outputs, not gold.
- `뒷일` illustrates the distinction: primary IPA `ty.sil` yields `твісіл` provisionally; the explicit alternate IPA `twi.sil` yields the same target as a model-selected sequence mapping.
- This candidate fixture's 5/19 split does **not** reconcile with the earlier 7-unresolved/17-target-inventory summary. The evidence cannot establish whether the discrepancy comes from input membership, engine state, or blocker taxonomy. Do not force counts or promote G2P output to normative truth. Full per-form evidence and provenance are in [`docs/HOLDOUT-24-PROVENANCE-AUDIT-2026-10-24.md`](HOLDOUT-24-PROVENANCE-AUDIT-2026-10-24.md).
