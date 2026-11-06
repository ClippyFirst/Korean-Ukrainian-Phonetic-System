---
name: change-review
description: Use when reviewing a branch, commit range, pull request or working diff for specification compliance, correctness, security, tests, maintainability and scope.
---

# Change Review

## Purpose

Review the change against both the request and the repository's engineering standards. A passing test suite is necessary evidence for some claims, not a substitute for reading the diff.

## 1. Pin the review

- Resolve the exact base commit/ref and head commit. Prefer the PR base/head and merge base; never review an unspecified or moving diff.
- Read the originating issue/request/spec and list its acceptance criteria.
- Inspect the complete diff, commit list and changed-file list.
- Read surrounding code, all affected callers, relevant tests/fixtures, data schemas, generated files, workflows and docs.
- Check current CI for the exact head. Distinguish successful, failed, cancelled, in-progress and skipped jobs.
- Search open and recently closed PRs when overlap or a prior attempt could affect the review.

If no spec exists, say so and review only against the explicit request and repository contracts. Do not invent requirements.

## 2. Review two separate axes

### Specification and evidence

- Is every requested outcome implemented?
- Is behavior missing, partial, or different from the requested contract?
- Did the change add unrequested behavior or broaden scope?
- Are linguistic, data, benchmark, rights or research claims supported by the correct evidence class?
- Are uncertain cases kept uncertain rather than silently normalized?
- Does documentation describe the actual final code and data?

### Engineering quality

- Correctness: concrete failures, edge cases, ordering, error paths and caller compatibility.
- Safety: trust boundaries, input validation, secrets, privacy, data loss and permissions.
- Tests: would the assertion fail if the defect returned? Are positive, negative and boundary controls present?
- Integration: generated artifacts, schemas, browser/Python parity, build/deploy and public interfaces.
- Maintainability: unnecessary abstractions, duplication, dead paths, hidden coupling and avoidable complexity.
- Performance: only measured or workload-relevant concerns; no speculative optimization.
- Documentation: navigation, ownership, source links, version/branch/commit accuracy and stale claims.

## 3. Validate findings

Each finding must identify:
- severity: `MUST_FIX`, `SHOULD_FIX` or `NICE_TO_HAVE`;
- exact file/line or input and the observed behavior;
- why it violates the request or a documented project contract;
- the smallest safe correction;
- a concrete acceptance check.

Re-read the cited code and reproduce important findings where feasible. Do not report style preferences as defects. Do not treat a skipped workflow, stale CI run, synthetic fixture or model agreement as proof of linguistic correctness.

## 4. Review outcome

Start with one of:
- `REQUEST_CHANGES` — at least one MUST_FIX issue.
- `COMMENT` — material concerns or evidence gaps, but no demonstrated blocker.
- `APPROVE` — no material issue found within the inspected scope.

Then list specification findings separately from engineering findings, followed by:
- checks actually observed and their exact head SHA;
- checks not run, skipped or blocked;
- scope not inspected;
- residual risk and any external acceptance gate.

Do not approve a change because it is documentation-only or because the author reports that tests passed. Do not merge, close or retarget a PR as part of a review unless explicitly asked.
