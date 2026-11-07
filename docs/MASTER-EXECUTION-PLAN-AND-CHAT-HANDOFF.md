

## 2026-11-07 — durable replay fixture

The 370-row Broad-only input is now committed as `research/kozak-kim-370-broad-only-replay-input-2026-11-07.csv` (Git blob SHA `4335d6488a647f0e240dcc9f8aa24edc5f076a40`). It contains only occurrence/source IDs, token, Broad reference/prediction IPA and edit distance. An independent replay against the full 370-row context ledger also returned the exact 239-ID set (239/239; no missing or extra IDs). The Python test now replays all 370 rows from this committed fixture and asserts the exact 239 IDs, 111 source rows and 154 unique tokens. CI on the latest branch head remains pending.
