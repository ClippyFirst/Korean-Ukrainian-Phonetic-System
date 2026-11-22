# Korean output contract

## Strictness levels

The browser exposes three distinct inclusion policies:

- **Strict** — source rules with the repository's strongest evidence gates; unsupported or unresolved target mappings do not become a confirmed result.
- **Soft** — adds explicit morphology/practical heuristics and typed IPA fallbacks. Broader coverage is not equivalent to higher confidence.
- **Super-soft** — grapheme-level Hangul decomposition → IPA fallback → Ukrainian adapter. It maximizes inspectable candidate coverage while retaining the lowest confidence and must remain clearly labeled as research output.

These names are shared with other repositories, but the Korean inclusion rules remain Korean-specific. The levels are not accuracy grades or interchangeable phonological profiles.

## Confirmed result and research candidate

The primary Ukrainian result and research candidate are separate UI states. A candidate must never silently replace the confirmed result. Candidate-only results remain labelled as such, with uncertainty brackets retained in the candidate display.

## Unresolved final result

When no confirmed Ukrainian target result is available, the user-facing result field displays `???`. This is a display placeholder, not IPA and not a literal pronunciation.

The Python API and internal renderer remain typed: unavailable mappings return `text: null` (Python `None`) together with `status: unavailable`, `reason`, and any mapping trace. Do not replace structured nulls with a string marker in the API contract. The browser translates that typed unavailable state into the visible `???` placeholder.

## Diagnostics

Keep the source form, surface form, IPA, IPA-token → Ukrainian mapping IDs, mapping status, rule trace, candidate status and uncertainty notes available in the analysis view. A provisional target correspondence stays a candidate and is not copied into the confirmed result channel.
