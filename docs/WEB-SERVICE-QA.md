# Web service QA

## Automated tests

npm test covers modern Hangul decomposition, CV/CVC mapping, ㅅ before ㅣ, ㄹ onset/coda, ㅇ onset/coda, simple and complex-coda liaison (including ㄶ/ㅀ and ㅆ liaison), ㅎ deletion/aspiration including complex-coda retention, nasal and liquid assimilation, palatalization, practical tensification, contextual voicing, context-sensitive ㅢ, non-Korean preservation, CSV quoting, deterministic conversion, preservation of original Hangul decomposition, IPA/analysis whitespace, and the public two-page/UI/CSP contract.

## Build

npm run build is the release build gate.

## Browser acceptance

Check desktop and narrow mobile widths: empty state; example flow; conversion; analytical panels; trace; copy; two-way navigation; visible keyboard focus; and reduced-motion behaviour.

## Research correctness

### Adversarial pronunciation cases

The regression suite now deliberately probes cases where a naive grapheme-to-grapheme converter is likely to fail:

- **신라 → [실라]**: ㄴ+ㄹ liquid assimilation, with the second ㄹ realized as surface [l], not onset [ɾ].
- **칼날 → [칼랄]**: ㄹ+ㄴ liquid assimilation.
- **밟는 → [밤는]**: lexical ㄼ exception in 밟- ([ㅂ] before consonants), followed by nasal assimilation.
- **넓죽하다 → [넙쭈카다]**: lexical ㄼ exception + tensification + ㅎ aspiration.
- **많아 / 싫어**: ㄶ/ㅀ must not invent an [h] onset during liaison.
- **넋이 / 곬이 / 값이**: the ㅅ component of ㄳ/ㄽ/ㅄ is carried as fortis ㅆ in the liaison environment.

- **앞문 → [암문]**: aspirated ㅍ is neutralized to the ㅂ representative before nasal assimilation, then surfaces as ㅁ.
- **많다 → [만타], 싫다 → [실타]**: aspiration from the ㅎ component of ㄶ/ㅀ retains the nasal/liquid component.
- **표준**: broad surface IPA records intervocalic ㅈ as [dʑ], not [tɕ].
- **읽히다 / 앉히다 / 넓히다**: aspiration from ㅎ combines with the second member of a complex coda while retaining its first member: [일키다], [안치다], [널피다].
- **옷하고**: aspiration after a coda must consult final neutralization; the rule cannot be triggered only by an exact written-coda lookup.
- **희망**: ㅢ in a syllable with a consonant onset is realized as [i]. By contrast, ㅇ+ㅢ uses normative [ɰi] as the primary output; optional [i]/[e] readings are documented but not guessed without lexical/morphological context.
- **§17 palatalization**: sourced entries cover 같이, 굳이, 곧이듣다, 미닫이, 땀받이, 벼훑이, 굳히다, 닫히다, 묻히다, and 밭이. The Python research rule requires an explicit formal-morpheme/suffix license; an unknown browser candidate is withheld with a warning rather than automatically palatalized.
- **Negative control 밭에 → [바테]**: the following vowel is ㅔ, not the licensed ㅣ environment; do not apply §17.
- **서울역 → [서울력]**: §29's ㄹ + inserted ㄴ → ㄹ rule is handled with a sourced exact-form entry rather than generic liaison.\n- **국립 / 협력 / 독립문**: §19 changes ㄹ → ㄴ before §18 nasalizes the preceding ㄱ/ㅂ coda; the Python research rule order matches the browser result.
- **한여름 / 가여름**: licensed n-insertion is permitted after a coda in the configured environment, but is not blindly inserted after an open syllable.
- **발음**: the structural panel must retain the written decomposition of 음 as ㅇ+ㅡ+ㅁ even though liaison changes its surface onset.
- **가 나 / 가, 나**: IPA and structural output preserve literal whitespace and punctuation without injecting extra separators.
- Complex codas are decomposed into component jamo for underlying/phonemic analysis; surface neutralization remains a separate step.

These are standard-pronunciation edge cases, not merely arbitrary test strings. NIKL's Standard Pronunciation Rules and Online Q&A explicitly document the relevant exceptions and assimilation patterns.

The following remain explicit: the optional [i]/[e] readings of ㅇ+ㅢ are context-dependent while the primary output defaults to [ɰi]; n-insertion and compound tensification are variable rather than universally categorical; 11,172 Hangul blocks are not a lexical corpus; contextual examples are not automatically universal rules; Russian and other Slavic systems are comparative evidence; the service is not translation.

## Release rule

A UI build is not by itself scientific validation. The web layer is complete only when its implementation boundary is documented and output remains traceable to the research repository.


## Lexical edge-case layer (2026-10-09 follow-up)

- Shared browser/Python lexical data: `data/korean/lexical_pronunciations.csv`.
- Exact entries: 값없다 [가법따], 의견란 [의ː견난], 읽고/읽다/읽어/읽는/읽지, 맑게/맑고/맑다, 밝기, 닭고기, and sourced §17 palatalization examples.
- Confirm each entry has an official source URL, surface Hangul form, IPA sequence, Ukrainian target syllables, and a confidence distinction.
- `의견란` has a normative pronunciation entry, but its Ukrainian `ийґйоннан` rendering is explicitly provisional and must not be treated as a normative Ukrainian transcription.
- Negative controls: `닭이` remains `달기` and `값이` remains `갑씨`; the lexical ㄺ exceptions must not spread to noun `닭-` or all words with coda `ㅄ`.
- Run `npm test`, `pytest`, `npm run build`, and inspect the latest GitHub Pages deployment before claiming the public service reflects the latest data.
