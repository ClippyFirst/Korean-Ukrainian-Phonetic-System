---
name: repository-audit
description: Use when asked to audit the whole repository or a subsystem for correctness, security, data flow, maintainability, documentation structure, tests, performance, deployment or release risk.
---

# Repository Audit

## Mission

Find concrete risks in the repository the owner actually has, rank them by consequence, and distinguish verified defects from uncertainty and optional cleanup. An audit is evidence gathering, not permission to redesign the system.

## 1. Map before judging

For the requested scope, inspect:
- README, project metadata, dependency manifests and license/third-party notices;
- default branch, recent commits, branches, open/recent PRs and exact-head CI;
- entry points, public interfaces, build/deploy configuration and GitHub workflows;
- canonical data, schemas, generated artifacts and their generators;
- tests and fixtures relevant to high-risk flows;
- existing architecture, research, audit, acceptance and handoff documents.

Trace critical flows from input to output and identify ownership at each stage. For a Korean phonetic flow, follow Hangul input through structural/morphological analysis, Korean surface phonology, IPA/typed uncertainty, Ukrainian adaptation and final orthography. Keep browser, Python, g2pK baseline, Kozak Kim and research-only paths separate.

State the load and deployment assumptions used. Do not infer concurrency, traffic or security exposure without evidence. On a large repository, prioritize areas where an error causes wrong linguistic output, data corruption/loss, privacy/security exposure, broken public service or invalid research claims. Name significant areas not inspected.

## 2. Look for evidence-backed findings

Check, where relevant:
1. Incorrect output, crashes, boundary cases, broken callers and inconsistent behavior across runtimes.
2. Security, privacy, input validation, secret handling, data loss and unsafe writes.
3. Scale against the documented workload: repeated expensive work, unbounded data, avoidable N+1 operations or shared-state assumptions.
4. Missing tests for consequential logic and tests that cannot fail for the defect they claim to cover.
5. Stale generated artifacts, undocumented generation steps, schema drift and broken links/navigation.
6. Duplicate sources of truth, duplicated transformations, dead code and abstractions without a demonstrated use.
7. Dependency, license, provenance and deployment risks.
8. Documentation that contradicts the actual code, tests, workflows or current research status.

Do not turn style preference, hypothetical race conditions or speculative threats into MUST-fix findings. Explain likelihood and consequence. Prefer the smallest effective repair; do not silently expand the task into a redesign.

## 3. Validate every finding

Before reporting a finding:
- point to the exact file, symbol, line or reproducible input;
- inspect the caller and full relevant data flow;
- reproduce the behavior or identify the precise source evidence;
- check whether a test, documented constraint or intentional shortcut already covers it;
- state the smallest fix and what happens if it is not made.

Do not call code unused until searching the whole repository, including tests, fixtures, workflows and dynamic references. Do not label a source “unlicensed” when its rights are merely unverified; use the exact status.

## 4. Prioritize and report

Use at most 20 findings, grouped by urgency:

- **MUST_FIX** — demonstrated correctness, security, data-loss or service failure.
- **SHOULD_FIX** — material untested risk, stale evidence, meaningful duplication, maintainability or performance issue.
- **NICE_TO_HAVE** — low-risk navigation or simplification with a clear benefit.

Each finding includes:
- **Finding:** concise, concrete title and location.
- **Evidence:** exact code/data/workflow/test or reproducible scenario.
- **Impact:** who or what is affected and likely consequence.
- **Fix:** smallest actionable correction.
- **Acceptance:** test, command, source or manual check that will prove the fix.
- **Confidence:** verified, probable or evidence-limited.

Then provide:
- **Repository purpose and inspected scope.**
- **Task ledger:** `DONE_VERIFIED`, `PARTIAL`, `TODO`, `BLOCKED`, `DEFERRED`.
- **Healthy boundaries to preserve.**
- **Not inspected / unavailable checks.**
- **Verdict:** what should be fixed first and whether release/research readiness is supported.

A report-only audit changes no code unless the user also requested implementation. If implementation is requested, move to the engineering-change workflow and verify the resulting changes.
