# Korean → Ukrainian Phonetic System — Comparative Master Table

## Status

**Version: v0.9.1 — comparative master-table draft**

This document is the comparative control layer for the Korean → Ukrainian system. It puts the approved Ukrainian-phonetics-first target next to Russian, Czech, Polish, Slovak, Bulgarian, Serbian and Slovenian comparator traditions.

**Important scientific qualification:** the table is not a claim that every Slavic column is an official national one-to-one Jamo table. Several traditions are represented through documented practical examples, normalized phonetic tendencies, or proposals. The evidence status therefore remains explicit.

## Core target principle

The production pipeline is:

**Korean orthography → Korean phonology → Korean contextual processing → Korean surface IPA → Ukrainian target selection → Ukrainian orthographic realization**

The priority order is:

1. Korean surface phonetics
2. Ukrainian Phonetic Inventory
3. Ukrainian phonotactics and orthography
4. documented Ukrainian Koreanist precedent
5. cross-Slavic comparative evidence

Foreign Slavic systems are **comparators and stress tests**, not templates for Ukrainian.

## Primary Ukrainian practical mode

The approved practical mode deliberately does **not** encode every Korean phonological contrast in a separate Ukrainian grapheme.

### Aspiration

| Korean | Korean IPA | Primary Ukrainian | Contrastive research mode |
|---|---|---|---|
| ㅋ | [kʰ] | **к** | кх |
| ㅌ | [tʰ] | **т** | тх |
| ㅍ | [pʰ] | **п** | пх |
| ㅊ | [tɕʰ] | **ч** | чх |

Thus aspiration remains visible to the researcher in the Korean/IPA layers, but is neutralized in ordinary Ukrainian practical output.

This is why **평양** should be evaluated toward **Пйон'ян**, rather than mechanically producing *Пхьон'ян*. The final treatment of /j/, softness and apostrophe belongs to the sequence/orthographic layer.

### Fortis

Fortis is retained as a Korean feature in the analytical model. Primary Ukrainian practical output does not force initial doubled consonants:

- ㄲ → к
- ㄸ → т
- ㅃ → п
- ㅆ → с
- ㅉ → ч

A secondary contrastive representation may expose doubling where useful, but it is not the default.

### Lenis stops

- ㄱ → к or ґ after Korean surface realization is resolved
- ㄷ → т or д
- ㅂ → п or б

The choice is not a fixed Jamo substitution.

### ㅅ / ㅆ

Basic ㅅ is targeted as **с**, while its [ɕ]-like realization before /i,j/-like vowels is evaluated against Ukrainian **ш**. This is a particularly important Ukrainian-specific decision and should be validated against the Ukrainian Phonetic Inventory and adversarial corpus.

### ㄹ

- onset [ɾ]-type → **р**
- coda [l] → **л**

Do not collapse ㄹ to a single Ukrainian letter.

### ㅇ

- onset → structural zero
- coda [ŋ] → distinct analytical target, with **нґ** available where the research layer must expose the velar nasal

A later user-facing simplification may differ, but the underlying data must not erase the Korean distinction.

## Vowel policy

The target vowel is an approximation in Ukrainian space, not a claim of phonemic identity. In particular:

- ㅓ → о is a practical target approximation;
- ㅡ → и is a practical target approximation;
- ㅐ and ㅔ remain distinct Korean inputs but normally converge to Ukrainian е;
- ㅢ is context-sensitive and must not receive one unconditional Ukrainian output.

## Comparative reading

### Russian

Russian Kontsevich is the strongest historical comparator and an important negative control. It demonstrates that aspiration, positional voicing, fortis and Korean-specific contrasts can be represented differently in Cyrillic. The Ukrainian system should not simply “Ukrainianize” Kontsevich.

### Ukrainian

O. M. Shchehel (2009) is the strongest direct Ukrainian precedent. Particularly valuable hypotheses include practical transcription based on Korean pronunciation and **ш** for ㅅ in /i,j/-type environments. These are evidence to re-test, not immutable rules.

### Czech

The 2023 Stanjurová thesis treats Czech Korean transcription as a historical and phonetic compatibility problem. This makes Czech a methodological comparator: it is useful not only for individual symbols but for asking whether the receiving-language phonology is respected. citeturn0search9

### Polish

Kim & Pietrow document how Korean toponyms are adapted in Polish through competing Korean romanization systems and subsequent Polish phonetic assimilation. Their examples include **Pjongjang, Pjongczang, Kjongdżu, Czongyp, Tedżon, Kesong**. This is strong evidence that a receiving-language transcription can be an explicit phonological compromise rather than a mechanical source-script substitution. citeturn0search0turn0search51

### Slovak

The Slovak tradition is useful particularly for the receiving-language treatment of Korean consonants and for testing whether /s/ + /i,j/ should be adapted to a receiving-language postalveolar category. Its exact institutional status should remain distinct from a fully codified national standard.

### Bulgarian

Bulgarian literature explicitly discusses the long-standing lack of a sufficiently ordered Korean-to-Bulgarian transcription system and the later effort to develop systematic approaches for Bulgarian Korean studies. This makes Bulgarian particularly valuable as a Cyrillic target-script comparator. citeturn0search50

### Serbian

Angelina Galjević's 2023 policy brief explicitly argues for a Korean Hangul ↔ Serbian Cyrillic transcription and therefore upgrades Serbian from a mere usage comparator to a documented proposal. It remains a **proposal**, not an established official standard. citeturn0search49

### Slovenian

Slovenian material is useful as a phonetic/orthographic comparator, but should not be presented as an equally consolidated Korean-specific national standard without stronger evidence.

## Master correspondence table

The machine-readable CSV accompanying this document is the full Jamo-level master table. It contains:

- Korean unit
- broad Korean IPA basis
- Ukrainian phonetic target
- primary Ukrainian practical output
- optional contrastive output
- Russian comparator
- Czech comparator
- Polish comparator
- Slovak comparator
- Bulgarian comparator
- Serbian comparator
- Slovenian comparator
- evidence status
- notes

The CSV is intentionally conservative about scientific status: **comparative summary is not the same thing as a national official rule**.

## Sequence-level layer

This table must not absorb Korean cross-syllable rules. Those remain in the sequence/word layer.

Minimum adversarial corpus:

- 평양 — aspiration neutralization and /j/ treatment
- 현대 — contextual voicing and target selection
- 국밥 — fortition
- 넋이 — complex-coda liaison
- 닭을 — complex-coda liaison
- 한여름 — licensed n-insertion
- ㅢ environments — context-dependent pronunciation
- ㅅ/ㅆ + ㅣ/j — [ɕ]-type target
- ㄹ + ㅎ — contextual liquid/ㅎ interaction

## Publication gate

Before calling this table publication-final:

1. attach a source ID to every non-derived Slavic cell;
2. distinguish exact source mapping from normalized summary;
3. add source quotations/page locators where a national mapping is asserted;
4. add sequence-level comparative examples;
5. validate Ukrainian candidates against the Ukrainian Phonetic Inventory;
6. run the adversarial corpus;
7. only then promote selected rows into `data/korean/canonical_correspondence.csv`.

**Current status: research master-table draft, not publication-final.**
