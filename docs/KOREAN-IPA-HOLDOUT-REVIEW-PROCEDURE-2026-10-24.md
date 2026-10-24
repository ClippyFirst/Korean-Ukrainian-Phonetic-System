# Frozen Korean IPA holdout: independent review procedure

**Scope:** `data/korean/ipa_holdout_2026-10-24.json` only. This process does not modify the engine, the holdout, or the IPA contract.

## Generate two blinded packets

The frozen holdout is projected through the repository's existing reviewer-packet schema; no second annotation format is introduced.

From the repository root in Bash or Git Bash:

```bash
node scripts/build-korean-holdout-ipa-queue.mjs > /tmp/clippyfirst-holdout-queue.json
node scripts/build-ipa-review-packet.mjs --queue /tmp/clippyfirst-holdout-queue.json --reviewer A > /tmp/clippyfirst-holdout-review-A.json
node scripts/build-ipa-review-packet.mjs --queue /tmp/clippyfirst-holdout-queue.json --reviewer B > /tmp/clippyfirst-holdout-review-B.json
```

Provide packet A and packet B to different qualified Korean phonetics reviewers. Do not provide either reviewer engine outputs, the other packet, or candidate IPA. The packet contains Korean input, official NIKL source evidence, and a Hangul surface comparator only. The comparator is **not IPA**. The generator fails closed if the holdout is not frozen, case counts drift, a source is not an official NIKL HTTPS URL, an item has IPA gold, or engine outputs are marked as stored.

After each reviewer independently completes their packet, validate it against the *same generated queue*:

```bash
node scripts/validate-ipa-review-submission.mjs /path/to/review-A.json --reviewer A --queue /tmp/clippyfirst-holdout-queue.json
node scripts/validate-ipa-review-submission.mjs /path/to/review-B.json --reviewer B --queue /tmp/clippyfirst-holdout-queue.json
```

Validation checks schema, source-field integrity, queue hash, reviewer identity/qualification consistency, timestamps, completeness, and IPA/boundary/length fields. It does not certify linguistic correctness or reviewer independence. Keep submissions separate until both are complete; then record disagreement and adjudication in the canonical manifest through a reviewed change. **Do not use these 24 cases for engine or normalizer tuning.**

## Acceptance gates

- 24/24 cases receive independent IPA annotations from two qualified reviewers.
- Both submissions pass structural validation against the exact same queue hash.
- Differences are adjudicated by a third qualified reviewer or a documented reconciliation process.
- Only then may an explicitly reviewed commit populate `ipaGold`; Ukrainian-target review remains a separate acceptance gate.
