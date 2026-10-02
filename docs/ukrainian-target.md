# Ukrainian target-layer contract

The Ukrainian target layer is intentionally **not duplicated** in this repository.

## Source of truth

The reference target package is `ukrainian-phonetic-inventory` version `0.8.0`.

The adapter imports the package, checks the exact expected version, loads the target phoneme inventory and feature vectors, loads target grapheme realizations, loads documented IPA-to-target mappings and their context/phonotactic/orthographic penalties, ranks candidates with an explicit heuristic cost, and returns the provenance of any mapping used.

An unavailable or incompatible UPI installation is represented as an unavailable target layer. The Korean repository does not silently substitute a second Ukrainian inventory.

## Ranking contract

For candidate c:

`total_cost = feature_cost + context_penalty + phonotactic_penalty + orthographic_penalty`

This is a **heuristic ranking cost**, not a probability and not a claim that the lowest-cost candidate is universally linguistically correct.

The feature component is calculated by comparing explicit source/target feature values. Target-side penalties are consumed from the UPI mapping dataset when a documented mapping exists.

## Orthographic boundary

The adapter can return segment-level Ukrainian grapheme candidates. Full sequence-level Ukrainian orthography remains owned by UPI. This prevents the Korean project from reimplementing rules for palatalization/softness, `я/ю/є/ї`, `ь` and apostrophe, `дж/дз/щ`, sequence-level phonotactics, and Ukrainian orthographic context.

Therefore a segmentwise candidate is not presented as a publication-final Ukrainian spelling without the target repository's sequence-level orthographic layer.

## Compatibility

The expected target version is versioned in code and checked at runtime. A target-layer API change that alters feature semantics, phoneme IDs or grapheme contracts must cause an explicit compatibility failure rather than silently changing Korean outputs.
