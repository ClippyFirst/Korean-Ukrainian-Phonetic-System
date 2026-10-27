# Independent IPA review pair comparison

The repository already creates source- and candidate-blind packets and validates each submission against the exact queue hash. This companion command compares two completed submissions without picking an IPA winner.

```bash
npm run ipa:compare-review-pair -- /tmp/ipa-review-A.json /tmp/ipa-review-B.json
```

For a non-default queue, pass the exact queue used to create both packets:

```bash
npm run ipa:compare-review-pair -- /tmp/ipa-review-A.json /tmp/ipa-review-B.json --queue research/r002-r003-source-adjudication-2026-10-24.json
```

The command verifies both submissions structurally, requires slots A/B and different declared reviewer IDs, checks the queue hash, and reports per-case agreement on IPA, syllable boundaries, and vowel-length assessment. Any disagreement is marked `DISAGREEMENT_REQUIRES_ADJUDICATION`. Even unanimous agreement is only `AGREEMENT_PENDING_COORDINATOR_REVIEW`: it is not proof of correctness, qualifications, or independence. The coordinator must verify reviewer provenance and reconcile against the official surface evidence after the blind pass. Ukrainian target review remains separate.
