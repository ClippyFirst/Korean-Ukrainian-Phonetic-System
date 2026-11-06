UGTPHON Korean subset — source and licence notice

The 236-case review extracts case-level material from the pinned UGTPHON Korean test split:

- Dataset path: `UGTPHON/ko/test.json`
- Dataset commit: `ef0d5a09c2ea1874c7206020f875cbd9cfea2f54`
- Dataset blob: `59380491d5a797308c475f7d0007dcf6c4be00af`

The upstream `ko/LICENSE` at that revision states:

> The Korean subset of UGTPHON is derived from KoMultiText (partly via MultiLexNorm++, partly directly from the KoMultiText DC Inside comments).

It declares the Korean subset licensed under the Apache License, Version 2.0, and cites:

- Choi et al. (2023), KoMultiText, NeurIPS SoLaR workshop: https://arxiv.org/abs/2310.04313
- Buaphet et al. (2026), MultiLexNorm++: https://arxiv.org/abs/2601.16623

Upstream licence file: https://github.com/naver-ai/UGTPHON/blob/ef0d5a09c2ea1874c7206020f875cbd9cfea2f54/ko/LICENSE

The review packet contains only 236 case-level excerpts (raw token, canonical input token, and raw sentence context). It does not contain the full UGTPHON dataset, source phoneme annotations, IPA-Dict lexicon/data, usernames, engine outputs, comparator IPA, candidate clusters, or previous case rationales.

The UGTPHON Korean-subset licence declaration is the documented basis for this limited reviewer distribution. This notice is not a legal opinion or an independent warranty that every upstream third-party post was contributed by a person authorised to license it. Apache-2.0 section 7 disclaims warranties including title and non-infringement; recipients should review the accompanying full licence.

No separate `ko/NOTICE` file was present at the pinned UGTPHON revision when checked. Preserve this notice and the complete Apache-2.0 licence with both reviewer packets.
