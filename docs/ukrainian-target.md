# Ukrainian target layer — current contract

This file previously described an external inventory as the production authority. That description is obsolete. The current detailed contract is maintained in [`docs/ukrainian-target-layer.md`](./ukrainian-target-layer.md); this short page remains as a compatibility pointer for older links.

## Production source of truth

The Korean project owns its practical Ukrainian target decisions. The IPA-mediated production route reads:

- `data/korean/canonical_correspondence.csv` — canonical Korean-to-IPA and project Ukrainian correspondence records;
- `data/korean/ipa_target_overrides.csv` — explicit IPA-sequence overrides;
- `src/korean_ukrainian/ipa_target_renderer.py` — Python IPA-only renderer;
- `src/app/ipa_target_data.js` — generated browser projection, checked by `scripts/generate_ipa_target_data.py --check`.

The separate RR-mediated route reads `data/korean/rr_ukrainian_correspondence.csv` and `data/korean/rr_ukrainian_context_rules.csv`. It is not derived from IPA and must retain separate provenance and uncertainty.

The optional `Ukrainian-Phonetic-Inventory` package (UPI 0.8.0) supplies target phoneme/feature metadata and candidate-analysis diagnostics only. Its heuristic ranking is not the production spelling authority and does not replace the repository's correspondence decisions. The core Python package has no mandatory UPI dependency.

## User-facing terminology

The owner selected **Ukrainian transliteration** as the product term for the existing author-developed practical Ukrainian-letter rendering guided by Korean pronunciation analysis and project research rules. It is not literal character-by-character Hangul substitution, translation, or the IPA representation itself. The service displays both the IPA-mediated and RR-mediated results together.

`model-selected` means an explicit project decision, not independent Ukrainian expert validation. `provisional` means a research candidate that must remain visibly uncertain. `unavailable` means the adapter must abstain rather than invent a result.

For mapping details, compatibility rules, fail-closed behavior, Python/browser parity and remaining scientific gates, see [`docs/ukrainian-target-layer.md`](./ukrainian-target-layer.md).
