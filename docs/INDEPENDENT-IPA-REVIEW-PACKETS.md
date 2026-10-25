# Independent broad-IPA review packets

The repository keeps Korean surface evidence, engine output, IPA adjudication, and Ukrainian-target review as separate layers. A reviewer packet must not leak the surface comparator or source citation: those are evidence for the coordinator's later reconciliation, not inputs to the first-pass IPA annotation.

## Generate two source- and candidate-blind packets

From the repository root:

```bash
npm run ipa:review-packet -- --reviewer A > /tmp/ipa-review-A.json
npm run ipa:review-packet -- --reviewer B > /tmp/ipa-review-B.json
```

For a source-scoped R002/R003 triage queue, pass the exact queue path:

```bash
npm run ipa:review-packet -- --reviewer A --queue research/r002-r003-source-adjudication-2026-10-24.json > /tmp/ipa-review-A.json
npm run ipa:review-packet -- --reviewer B --queue research/r002-r003-source-adjudication-2026-10-24.json > /tmp/ipa-review-B.json
```

Provide each packet to a different qualified Korean phonetics reviewer. Do not give reviewers the canonical queue, source URLs, Korean surface comparators, engine outputs, other reviewer submissions, or reconciliation decisions. The packet contains only opaque IDs (`BLIND-001`, etc.), the Hangul input, a reviewer slot, and empty review fields. The source queue remains with the coordinator.

The packet hash binds it to the exact queue bytes. Do not reformat or regenerate the queue between packet creation and validation.

## Validate a completed submission

```bash
npm run ipa:validate-submission -- /tmp/ipa-review-A.json --reviewer A
npm run ipa:validate-submission -- /tmp/ipa-review-B.json --reviewer B
```

If a non-default queue was used, pass that same file with `--queue`:

```bash
npm run ipa:validate-submission -- /tmp/ipa-review-A.json --reviewer A --queue research/r002-r003-source-adjudication-2026-10-24.json
```

Validation checks exact queue hash, anonymous case IDs and order, unchanged Hangul inputs, fixed protocol instructions, reviewer identity/qualification consistency, timestamp format, IPA, syllable boundaries, and vowel-length assessment. It rejects source metadata or candidate fields added to a submission. It does **not** certify IPA correctness, reviewer qualifications, independence, or Ukrainian adaptation.

## After the independent pass

1. Keep reviewer submissions separate until both are complete.
2. The coordinator maps opaque IDs back to the canonical queue.
3. Compare the independent IPA submissions with each other and only then reveal official Korean surface evidence for reconciliation.
4. Record disagreement and the reason for any decision. Unresolved cases stay unresolved.
5. Review the Ukrainian target separately from IPA. A Korean surface citation is not IPA gold; IPA gold is not Ukrainian-target gold.

Do not use a frozen holdout for engine or normalization tuning. Source access failures remain blockers; this workflow does not crawl, bypass access controls, or make licensing assumptions.
