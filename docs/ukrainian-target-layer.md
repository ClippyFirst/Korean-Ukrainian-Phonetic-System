# Ukrainian target layer

The Korean repository does not copy the Ukrainian phoneme inventory. It consumes ClippyFirst/Ukrainian-Phonetic-Inventory as the authoritative Ukrainian phoneme, feature and orthographic target dataset.

The verified target contract is UPI 0.8.0. The adapter checks the runtime version, consumes the UPI feature vectors for candidate ranking, and retrieves grapheme realizations from UPI's machine-readable grapheme/transliteration exports.

Candidate score remains a heuristic cost, never a probability.

The adapter exposes external inventory availability, detected package version, source IPA, source features, ranked UPI candidates, mismatches, heuristic score and target grapheme when UPI supplies one.

A missing or incompatible UPI dependency is an explicit unavailable state rather than a silent fallback.

This is still not a complete Ukrainian orthographic grammar: sequence-level choices, palatalization/iotation, apostrophe, ь, я/ю/є/ї, дж/дз/щ and proper-name conventions require further target-layer integration.
