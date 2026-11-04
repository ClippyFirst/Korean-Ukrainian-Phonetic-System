# Versioning policy — Python package and browser application

Date: 2026-11-04  
Status: documented project policy; version values unchanged.

## Decision

The Python distribution and browser application are **separate version streams**. They are not required to share a version number and must not be mechanically synchronized.

This is the most defensible interpretation of the repository's current packaging boundaries:

| Artifact | Current metadata | Distribution/runtime role | Version authority |
|---|---:|---|---|
| Browser application | `package.json` `1.0.0` | Private Vite application deployed as a static GitHub Pages service; `private: true`, not a published npm library | `package.json` |
| Python distribution | `pyproject.toml` `0.6.0` | Separately installable Python package `korean-ukrainian-phonetic-system` | `pyproject.toml` |

The numbers describe different artifacts and release lifecycles. Their numerical difference is not, by itself, a versioning defect. The current files support independent versioning as a coherent policy, but do **not** prove the historical intent of whoever first assigned these numbers. This document makes the policy explicit prospectively; it does not claim to reconstruct that undocumented historical intent.

## Bump rules

1. A browser-only UI, Vite, Pages, or browser-runtime change may bump `package.json` without changing the Python distribution version.
2. A Python API, CLI, package metadata, or Python-runtime change may bump `pyproject.toml` without changing the browser application version.
3. A change affecting both artifacts may bump both, but each bump must be justified against that artifact's compatibility and release impact; matching numbers are optional, not a goal.
4. A shared linguistic/data-contract change does not automatically imply equal version numbers. Update the affected artifact(s), generated outputs and compatibility notes explicitly.
5. Do not publish the private browser package to npm unless the `private` setting and publication policy are deliberately changed by the owner.
6. A future unified product release identifier, if needed for a coordinated public release, must be a separate documented release label rather than silently overloading either package version.

## Verification and constraints

- Observed in the audited branch: `package.json` is `1.0.0`, `private: true`, and defines the Vite/browser scripts.
- Observed: `pyproject.toml` is `0.6.0`, declares a Python package and CLI entry point.
- No version values were changed in this audit.
- No tag/release history or maintainer statement was found in the inspected project documentation that proves the original intent. The prospective independent-stream policy is therefore explicit, while the historical-intent question remains unprovable from current repository evidence.

## Release checklist

- [ ] Bump only the artifact(s) changed by the release.
- [ ] Confirm the correct package metadata file is changed.
- [ ] Run the corresponding package tests/build and cross-runtime checks where shared contracts changed.
- [ ] Record both artifact versions in a coordinated release note when both ship.
- [ ] Do not infer research or linguistic acceptance from software version numbers.

