# Ukrainian target-layer review — 2026-10-10

## Scope and decision

This is a first independent *internal consistency* review of the Ukrainian target layer in `data/korean/lexical_pronunciations.csv`, cross-checked against `data/korean/canonical_correspondence.csv` and the project's declared model decisions.

It is **not** a native-speaker validation and does not claim to prove that a target is wrong merely because it is an approximation. No target strings were silently rewritten in this pass. The existing data correctly distinguish a sourced Korean pronunciation from a provisional Ukrainian rendering; this review preserves that distinction.

## Findings: policy decisions that must be made explicit

### 1. Length is represented in IPA but generally not in Ukrainian output

Examples include `밤윷` (`paːm|ɲut̚` → `пам|ньут`), `툇마루` (`tʰøːn|ma|ɾu` → `твен|ма|ру`), and `대팻밥` (`tɛː|pʰɛ|p͈ap̚` → `те|пе|пап`). The IPA preserves a length mark, while the Ukrainian target does not.

**Review decision needed:** is vowel length intentionally omitted from the practical Ukrainian spelling, or should a separate phonetic/annotated mode expose it? Do not encode length ad hoc in a few words. If it is omitted, state that as a system-wide policy and test it.

### 2. Aspiration and fortisness are often neutralized in Ukrainian spelling

The canonical table explicitly maps aspirated/fortis consonants to ordinary Ukrainian letters in many contexts, so this is a known model trade-off, not automatically a row-level bug. Examples: `콧등` (`kʰo|t͈ɯŋ` → `ко|тин`), `깃발` (`ki|p͈al` → `кі|пал`), and `대팻밥` (`tɛː|pʰɛ|p͈ap̚` → `те|пе|пап`).

**Review decision needed:** keep the compact practical spelling, add an optional phonetic cue, or expose IPA as the only place these contrasts remain explicit. This is a system-level choice and should not be inconsistently “fixed” in isolated lexical entries.

### 3. Korean vowels without direct Ukrainian equivalents need a documented ranking policy

The canonical table selects approximations such as `ㅓ /ʌ/ → о`, `ㅡ /ɯ/ → и`, `ㅚ /ø/ → ве`, `ㅟ /y/ → ві`, and contextual `ㅢ` without one universal Ukrainian output. The lexical records `툇마루` (`tʰøːn` → `твен`) and `뒷윷` (`tyːn` → `твін`) are consistent with those stated correspondences, but the closeness and readability of the choices remain unvalidated.

**Review decision needed:** define an explicit ranking objective (perceptual similarity, Ukrainian readability, reversibility, or a weighted combination) and evaluate competing spellings with Ukrainian readers who can hear Korean contrasts. Do not treat the current canonical choices as empirically optimal.

### 4. Velar nasal /ŋ/ is deliberately written as н in coda position

Examples: `송별연` (`soːŋ|bjʌ|ɾjʌn` → `сон|бйо|рйон`), `국물` (`kuŋ|mul` → `кун|мул`), and `등용문` (`tɯŋ|joŋ|mun` → `тин|йон|мун`). The canonical table says the Korean velar nasal has no direct Ukrainian phoneme and uses н as a graphemic approximation.

**Review decision needed:** keep н in the primary practical target, or compare a marked/alternate convention. Any alternative must be tested for readability and for whether users mistakenly pronounce it as a Ukrainian alveolar [n]. Do not substitute ґ/г: those letters denote stops/fricatives, not a nasal.

### 5. Liquid /ɾ/ and coda /l/ use context-sensitive Ukrainian р/л

Examples: `송별연` uses `рйон` for `ɾjʌn`, while `서울역` uses `со|ул|лйок` for a surface form with a liquid sequence. The target layer must keep onset liquid, coda lateral, and adjacent-liquid contexts distinct enough to remain readable.

**Review decision needed:** document when the model writes р, л, or doubled л, and add minimal pairs/contrastive fixtures for intervocalic onset /ɾ/, coda /l/, and adjacent liquids. A visual double letter should not be interpreted as a claim of gemination unless that is the intended convention.

### 6. The syllable separator is an analysis aid, not Ukrainian orthography

Fields such as `ко|ґе|чіт` for `고갯짓` and `са|міл|чол` for `3·1절` use vertical bars to align target units with IPA/surface units. The joined output removes these bars. This is useful for auditability but means the segmented CSV target is not itself the final user-facing spelling.

**Review decision needed:** keep alignment bars in source data, but test both segmented and joined forms. Document whether joined output may create misleading Ukrainian letter sequences across unit boundaries.

## Row-level review queue (not confirmed errors)

| Entry | Current target | Question for review |
|---|---|---|
| `의견란` | `ий|ґйон|нан` | Is `ий` the most readable Ukrainian approximation of the sourced `ɰiː`, and how should length be handled? |
| `툇마루` | `твен|ма|ру` | Does `ве` provide the preferred practical approximation of `ø` for Ukrainian readers? |
| `뒷윷` | `твін|ньут` | Is the chosen `y → ві` approximation readable when followed by another syllable beginning with н? |
| `밤윷` | `пам|ньут` | Should the IPA length mark remain absent from the practical spelling by policy? |
| `송별연` | `сон|бйо|рйон` | Is the treatment of /ŋ/ and /ɾj/ transparent to a Ukrainian reader without misleading word-like segmentation? |
| `3·1절` | `са|міл|чол` | Validate joined form `самілчол` against the spoken Korean surface, especially the fortis affricate approximation. |
| `콧등` | `ко|тин` | The target intentionally neutralizes aspiration/fortisness; test whether this is acceptable for the intended practical use. |
| `깃발` | `кі|пал` | Same contrast-loss question for fortis /p͈/; not a proven row-specific error. |
| `서울역` | `со|ул|лйок` | Check the adjacent liquid rendering and joined-form readability. |
| `의` / `ㅢ` contexts | varies | Do not assign one fixed Ukrainian output; retain context-sensitive handling and add more contrastive examples. |

## Recommended validation protocol

1. **Freeze the current outputs as a baseline.** Keep the source-backed Korean surface form and IPA separate from the Ukrainian candidate.
2. **Build contrast sets, not isolated words.** Include plain/aspirated/fortis onsets; /ʌ/ vs /o/; /ɯ/ vs /u/; /ø/ and /y/; /ŋ/ vs /n/; onset /ɾ/ vs coda /l/; and short/long vowels where the normative source marks length.
3. **Blind Ukrainian-reader test.** Give several candidate renderings plus the same audio samples, without showing the IPA first. Ask for pronunciation guess, perceived similarity, ease of reading, and confidence.
4. **Native Korean validation of the audio labels.** Confirm each source recording matches the normative standard surface form; dialect and speech rate must be controlled.
5. **Record decisions with evidence.** Every changed mapping should cite the tested contrast, not just intuition. Store alternatives and a rationale; keep a versioned record of rejected candidates.
6. **Separate metrics.** Track source reliability, Korean surface-form confidence, IPA-analysis confidence, and Ukrainian-target confidence separately. A high-confidence Korean source must not imply a high-confidence Ukrainian target.
7. **Do not optimize only for reversibility.** This is practical phonetic transcription, not transliteration. Evaluate perceptual fidelity and Ukrainian readability explicitly; report trade-offs.

## Current conclusion

The review has found **system-level decisions requiring empirical evaluation**, not a sufficient basis to declare the listed rows definitively wrong. The most defensible next change is a small, reproducible reader-study corpus and an explicit target policy—not bulk edits to hundreds of provisional strings based only on internal intuition.

## Sources and project artifacts

- [NIKL Standard Pronunciation Rules](https://www.korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002) — authoritative Korean standard pronunciation baseline; it does not validate Ukrainian renderings.
- `data/korean/canonical_correspondence.csv` — current project-selected correspondence decisions and documented trade-offs.
- `data/korean/lexical_pronunciations.csv` — source-backed lexical readings and provisional Ukrainian targets.
- [Project README and limitations](../README.md) — describes the pipeline and explicitly states that Ukrainian correspondences are model decisions, not an official national standard.
