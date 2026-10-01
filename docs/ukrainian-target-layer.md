# Ukrainian target layer

The Korean repository does not copy the Ukrainian inventory. It consumes ClippyFirst/Ukrainian-Phonetic-Inventory as the authoritative Ukrainian phoneme and feature dataset.

The current verified target contract is UPI 0.8.0. Its Python package exposes load_inventory(), returning Standard Ukrainian phonemes and feature vectors. The Korean adapter converts Korean surface IPA segments into the UPI feature ontology, ranks UPI candidates, and then applies a thin adapter-level orthographic realization.

The orthographic mapping in this repository is an adapter, not a second Ukrainian inventory. It is not an exhaustive Ukrainian orthographic grammar.

Candidate score remains a heuristic cost, never a probability.

The adapter exposes external inventory availability, detected package version, source IPA, source features, ranked UPI candidates, mismatches, heuristic score and adapter-level Ukrainian grapheme rendering.

A missing or incompatible UPI dependency is an explicit unavailable state rather than a silent fallback.
