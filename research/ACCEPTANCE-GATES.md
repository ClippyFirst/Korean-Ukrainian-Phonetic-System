# Release Acceptance Gates

A release is not accepted merely because the build succeeds or documentation describes intended behavior. Each gate requires recorded evidence. Mark each gate not_assessed, pass, fail, or blocked; link the relevant commit, report, CI run, corpus version, or deployment check.

## Gate 0 — Repository integrity
- [ ] Default branch and commit SHA recorded.
- [ ] Branches, PRs, and relevant issues inventoried; pagination limitations noted.
- [ ] Valuable unmerged work reviewed and assigned a disposition.
- [ ] No destructive cleanup without preserving useful history.

## Gate 1 — Source and licensing
- [ ] Normative claims point to exact official source passages and article identifiers.
- [ ] Source conflicts are recorded and resolved with rationale or left explicitly unresolved.
- [ ] Third-party code/data versions and licenses are recorded.
- [ ] Attribution, redistribution, and derivative-work obligations are satisfied.
- [ ] No unsupported source-completeness claim is made.

## Gate 2 — Rule and data integrity
- [ ] Every in-scope rule has a stable identifier.
- [ ] Conditions, exclusions, ordering dependencies, and exceptions are documented.
- [ ] Canonical data is identified; generated artifacts are reproducible.
- [ ] Duplicate/conflicting rules are detected and dispositioned.
- [ ] Uncertain cases remain explicitly uncertain.

## Gate 3 — Independent evaluation corpus
- [ ] Gold examples have source/provenance metadata.
- [ ] Expected values are independently reviewed or directly sourced.
- [ ] Positive, negative, boundary, interaction, and regression cases exist.
- [ ] Holdout separation and leakage risks are documented where relevant.
- [ ] Corpus coverage and blind spots are reported.

## Gate 4 — Runtime correctness
- [ ] Relevant automated tests pass with exact commands and environment recorded.
- [ ] Korean surface pronunciation and IPA are evaluated separately from Ukrainian rendering.
- [ ] Browser, Python, CLI, and API are tested independently where supported.
- [ ] Cross-runtime differences are measured and documented.
- [ ] Error handling, unsupported input, and fallback behavior are tested.
- [ ] No silent engine substitution or confidence-status loss occurs.

## Gate 5 — Product quality
- [ ] Public interface reflects the reviewed source revision.
- [ ] IPA and Ukrainian output match the documented contract.
- [ ] User-facing uncertainty and limitations are visible.
- [ ] Accessibility, responsive layout, performance, and failure states are checked.
- [ ] Documentation and examples match released behavior.

## Gate 6 — Release and independent review
- [ ] CI/build evidence is tied to the release commit.
- [ ] Deployment is verified from the public URL or equivalent evidence.
- [ ] Relevant branch changes are integrated or explicitly deferred with reasons.
- [ ] Independent review challenges source coverage, corpus quality, architecture, and completion claims.
- [ ] Remaining defects and risks are published.
- [ ] Release decision and reviewer evidence are recorded.

## Release report template
- Release/version:
- Commit SHA:
- Date:
- Gate statuses:
- Test commands and results:
- Evaluation corpus/version and metrics:
- Cross-runtime differences:
- Deployment evidence:
- Known limitations:
- Deferred issues and rationale:
- Reviewer:
- Decision: accepted / rejected / conditional