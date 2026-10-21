# Repository-local agent skills for NIKL research

These skills live in .agents/skills/ and are intended for coding agents that support repository-local SKILL.md instructions.

## Skills

- [NIKL Norm Crawler](../.agents/skills/nikl-norm-crawler/SKILL.md) — collect official norms with provenance, hashes, respectful crawling, and reuse checks.
- [NIKL Rule Coverage and Regression](../.agents/skills/nikl-rule-coverage/SKILL.md) — reconcile the official article inventory with existing matrices, engine behavior, and regression tests.
- [NIKL Evidence and Lexical Audit](../.agents/skills/nikl-evidence-audit/SKILL.md) — distinguish direct official attestations from rule-derived candidates and hypotheses.

## Existing skills reviewed

- [yfe404/web-scraper](https://github.com/yfe404/web-scraper/blob/main/SKILL.md) — general-purpose web-scraping skill; its upstream repository declares MIT. Its reconnaissance-first approach informed the crawler workflow. The full upstream file and its linked references were not copied because they are broader than this project needs.
- [OMIXEC/web-scraper-skills](https://github.com/OMIXEC/web-scraper-skills) — useful website-specific skill/action-reference pattern.
- [GitHub documentation on adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) — describes repository-local .agents/skills/ support.

## Scope and limitations

These are workflow instructions, not proof that scraping or rule coverage has run. They contain no copied official rule text or bulk dictionary data. Adding them does not establish a live scrape, complete coverage, or linguistic validation. Crawler code, schema validation, source terms review, and execution evidence remain separate acceptance tasks.
