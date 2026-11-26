# Deterministic Korean G2P engine — design

**Date:** 2026-11-27  
**Status:** approved direction; implementation is incremental and evidence-gated.

## Intent

Build the Korean pronunciation engine as a deterministic, inspectable rule system. Neural G2P research may be used offline to discover candidate patterns, but the shipped engine must not execute neural networks or depend on model inference.

## Goals

- Identical normalized input, configuration, rule data and lexicon version produce identical IPA and trace.
- Phonological rules have a single canonical, versioned ordering and explicit source/scope metadata.
- Morphology-sensitive transformations require an exact or independently validated deterministic license; unsupported cases abstain.
- Rule execution is explainable: each applied rule exposes its ID, order, environment, before/after state and evidence.
- The IPA representation remains the boundary between Korean analysis and Ukrainian adaptation.
- Phonemic, Broad and Narrow are renderings of one shared analysis, not separate G2P engines.

## Non-goals

- No neural inference, model weights, embeddings, remote model APIs, sampling or probabilistic runtime ranking.
- No automatic promotion of neural-teacher disagreements into production rules.
- No benchmark-score optimization by changing transcription conventions.
- No unsupported categorical Narrow IPA or Ukrainian mappings.
- No change to ordinary production mode or target mappings in this first implementation increment.

## Approaches considered

1. Keep rule order duplicated in Python code and CSV. Rejected: the data table is already the documented rule-order source, so duplication can silently drift.
2. Load and validate the canonical rule catalogue and ordering at runtime, then execute the existing deterministic rule handlers in that order. **Selected:** smallest reversible step, no new dependencies, preserves established transformations while making order inspectable and testable.
3. Replace the full engine immediately with a general-purpose FST dependency. Deferred: current rule conditions include morphology licenses and token-specific source exceptions; a library migration without a verified formal rule inventory would add complexity without proving better linguistic coverage.

## Architecture

The runtime compiles data/korean/rules.csv and data/korean/rule_ordering.csv into an immutable ordered rule plan. apply_ordered_rules consumes that plan unless an explicit rule sequence is supplied for diagnostics. The existing rule handlers remain deterministic transformations over structured Syllable state. No inference or probability is introduced.

The next architectural increments are a typed per-segment IPA intermediate representation, explicit candidate/abstention semantics for genuinely variable cases, and a Python/browser shared contract. These must be implemented as separate testable increments; they are not silently claimed by this first slice.

## Constraints

- Python 3.11+; no new runtime dependencies.
- Existing exact-form licenses and fail-closed morphology behavior remain unchanged.
- CSV ordering must contain every declared rule exactly once, with unique positive integer positions and no unknown IDs.
- Missing or malformed canonical rule data is a hard error; never fall back to a second hard-coded ordering.
- Wheel installation must include the rule catalogue and ordering data.
- Teacher/model outputs are offline research evidence only; a candidate rule still needs primary linguistic evidence, convention review, negative controls and held-out development evaluation before manual acceptance.