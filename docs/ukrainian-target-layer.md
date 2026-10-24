# Ukrainian target layer

The Korean repository does not copy the Ukrainian phoneme inventory. It consumes ClippyFirst/Ukrainian-Phonetic-Inventory as the authoritative Ukrainian phoneme, feature and orthographic target dataset.

The verified target contract is UPI 0.8.0. The adapter checks the runtime version, consumes the UPI feature vectors for candidate ranking, and retrieves grapheme realizations from UPI's machine-readable grapheme/transliteration exports.

Candidate score remains a heuristic cost, never a probability.

The adapter exposes external inventory availability, detected package version, source IPA, source features, ranked UPI candidates, mismatches, heuristic score and target grapheme when UPI supplies one.

A missing or incompatible UPI dependency is an explicit unavailable state rather than a silent fallback.

This is still not a complete Ukrainian orthographic grammar: sequence-level choices, palatalization/iotation, apostrophe, ь, я/ю/є/ї, дж/дз/щ and proper-name conventions require further target-layer integration.


## Runtime dependency availability (2026-10-24)

The target inventory is maintained in the separate private repository [ClippyFirst/Ukrainian-Phonetic-Inventory](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory), version 0.8.0. The Korean project's base `pyproject.toml` has no UPI dependency, and the package is not a public PyPI dependency. Consequently, a clean install of this repository does **not** make UPI available automatically. The adapter intentionally returns an unavailable status and the Korean→Ukrainian pipeline abstains rather than substituting an unreviewed local mapping.

For an authorized development checkout, install the target inventory from its source checkout in the same environment (editable installation is currently the verified source-tree path):

```sh
python -m pip install -e /path/to/Ukrainian-Phonetic-Inventory
```

The UPI repository currently has open, unmerged PRs #8 (v0.9.0) and #9 (v1.0.0); neither is treated as integrated. A separate packaging PR [#10](https://github.com/ClippyFirst/Ukrainian-Phonetic-Inventory/pull/10) is testing whether a built wheel can load the canonical CSV tables outside the source checkout. Until that packaging gate is observed green and the dependency is made installable for the intended runtime, clean-install target abstention is an expected integration limitation, not evidence that Korean IPA itself is unresolved.

Even when UPI loads, its current 18-row transliteration mapping table is only a partial correspondence inventory. Package availability and correspondence coverage are separate gates: installing UPI can resolve the dependency-unavailable state but cannot by itself justify missing IPA→Ukrainian mappings.
