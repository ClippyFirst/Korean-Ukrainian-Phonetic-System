# Agent-skill integration for phonetic engineering — 2026-11-01

## Decision

Add one repository-specific skill, .agents/skills/phonetic-engineering/SKILL.md, rather than copying several overlapping generic skills into the project. The existing NIKL evidence-audit, norm-crawler, and rule-coverage skills remain authoritative for official Korean evidence and rule inventory. The new skill adds cross-cutting discipline for adversarial whole-sentence tests, engine benchmarking, and service-level verification.

## Selected upstream practices

The following public skill repositories were inspected at the pinned upstream revisions below. Their repository licenses are MIT. No upstream skill text or code is copied into this repository; the new skill is an original, domain-specific integration. Links are pinned so later upstream changes do not silently change this project's process.

| Source | Selected skill | Why it fits | Pinned upstream revision |
|---|---|---|---|
| obra/superpowers | test-driven-development | Require a test that fails for the intended defect before implementation; keep the fix minimal. | [2ce8aa1](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/test-driven-development) |
| obra/superpowers | systematic-debugging | Trace root cause and full data flow instead of patching symptoms in a multi-stage phonetic pipeline. | [2ce8aa1](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/systematic-debugging) |
| obra/superpowers | verification-before-completion | Require fresh exact-head test/build evidence before reporting completion. | [2ce8aa1](https://github.com/obra/superpowers/tree/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/verification-before-completion) |
| mattpocock/skills | code-review | Separate specification compliance from engineering-standard review. | [4ae2317](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/code-review) |
| mattpocock/skills | research | Trace claims to primary sources and store evidence in the repository. | [4ae2317](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/research) |
| DietrichGebert/ponytail | ponytail-audit | Audit the whole repository and real data flow for correctness, risk, load, tests, and unnecessary complexity. | [96608e0](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail-audit) |
| DietrichGebert/ponytail | ponytail-review | Review changed code together with callers, tests, and runtime path; prioritize correctness and lean design. | [96608e0](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail-review) |

## Deliberate exclusions

- Matt Pocock's TDD skill overlaps with Superpowers TDD; retain one canonical red/green loop rather than competing prescriptions.
- Matt Pocock's diagnosing-bugs skill overlaps with systematic debugging; its tight-feedback-loop idea is incorporated into the domain skill.
- Ponytail's gain/scoreboard skill is excluded: its published measurements describe Ponytail's own benchmark setup and are not evidence about Korean G2P quality.
- No neural G2P engine or remote service is added merely because a skill repository recommends a workflow. Engine inclusion is gated by independent benchmark evidence, legal rights, reproducibility, and deployability.

## Domain-specific additions

The new skill adds requirements generic software skills do not supply:
- preserve Hangul → structure/morphology → Korean phonology → IPA/typed uncertainty → Ukrainian adaptation;
- keep RR and Hanja as separate side layers;
- distinguish official attestations, rule derivations, independent adjudications, corpus annotations, and synthetic adversarial stimuli;
- construct balanced Korean positive/negative/interaction/phrase-boundary/morphology/whole-sentence tests;
- test mixed scripts, whitespace, punctuation, unsupported spans, and trace provenance through the public service;
- compare engines on identical frozen splits, publishing exact-match/CER/PER, coverage, abstentions, paired errors, latency, versions, and legal provenance;
- prohibit synthetic fixtures or model outputs from becoming gold labels without independent adjudication.

## Verification contract

A structural contract test verifies the skill metadata and critical safeguards. It is not a linguistic-accuracy test. The skill is process guidance; it does not change runtime phonology, IPA, Ukrainian mappings, RR output, Hanja data, or service behavior.
