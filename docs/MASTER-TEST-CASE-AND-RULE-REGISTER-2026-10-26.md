# Master test-case and rule-evidence register — 2026-10-26

## Purpose and change-control rule

This is the canonical evidence index to use **before further production-rule edits** in the Korean → Ukrainian ClippyFirst engine. The task is not merely to list rule names: preserve every concrete source form, counterexample, variant, phrase, unresolved case, expected Korean surface, IPA, Ukrainian output, and the exact test/run that exposed or checked it.

**Status: PARTIAL INVENTORY — NOT YET COMPLETE.** This initial commit establishes the structure, source index, and representative cases directly inspected in this pass. It must not be described as “all examples captured” yet. The next work is to extract every case from every test/fixture/data row and historical CI artifact, deduplicate without losing test provenance, then validate counts. Until that completeness gate passes, do not mine new generalized rules from this document and do not make further rule changes merely to improve a benchmark.

## Case record contract

An individual case is one exact input under one explicit test context. The same Hangul input in two tests retains both provenance links. Each machine-readable row must preserve:

- exact input string, including spaces, punctuation, mixed script and context;
- test file, test title, line number when available;
- mode: generic/no lexicon, lexical dictionary, strict morphology, research morphology, browser, Python, CLI or external benchmark;
- expected surface Hangul and every explicitly permitted variant;
- expected IPA exactly as asserted, including length, aspiration/fortis features, syllable separators and stress;
- expected Ukrainian target exactly as asserted, target status, and whether the test asserts it;
- rules/traces expected, rules explicitly forbidden, and positive/negative-control role;
- source URL, NIKL article or evidence ID;
- observed output and pass/fail for each actual run. A test's expected value is not an observed result;
- source hash, artifact/run ID, code commit and environment where available.

Never overwrite a disagreement with a “canonical” answer. Preserve competing readings and classify the disagreement (pronunciation, morphology, IPA convention, Ukrainian adaptation, serialization, engine regression or unknown) until adjudicated.

## Evidence statuses

- DONE_VERIFIED — case and provenance extracted, expected and observed result recorded from a named passing run.
- EXPECTED_ONLY — assertion/fixture known, but no matching run result currently evidenced.
- FAIL_OBSERVED — a named run failed; include actual vs expected.
- REVIEW_REQUIRED — source, morphology, IPA convention or Ukrainian target needs independent adjudication.
- UNRESOLVED_BY_DESIGN — engine is expected to abstain; partial output must not be invented.
- NOT_EXTRACTED — test/source file identified but individual cases not yet enumerated.
- DUPLICATE_PROVENANCE — same input/result as another row, but retain this test reference.
- BLOCKED — exact external evidence/artifact or runtime access unavailable.

A test file existing is not proof that it passed. A successful run on a different commit is not proof for the current head.

## Initial case inventory extracted directly from test assertions

These are expected values read directly from tests on branch research/strict-teacher-guided-rule-mining-2026-10-26. They are **not** a claim that the current PR head's CI passed. This inventory is intentionally a first extraction batch, not the full register.

### NIKL §§6–7 — vowel length and contrast controls
Source: tests/nikl-articles-6-7-exhaustive-listed-examples.test.mjs

| Input | Expected surface | Expected IPA | Tested distinction |
|---|---|---|---|
| 눈보라 | 눈보라 | nuːn bo ɾa | long first-syllable vowel |
| 말씨 | 말씨 | maːl ɕ͈i | long vowel |
| 밤나무 | 밤나무 | paːm na mu | long vowel |
| 많다 | 만타 | maːn tʰa | long vowel plus §12 aspiration |
| 멀리 | 멀리 | mʌːl li | long vowel |
| 벌리다 | 벌리다 | pʌːl li da | long vowel |
| 첫눈 | 천눈 | tɕʰʌn nun | short-vowel contrast |
| 참말 | 참말 | tɕʰam mal | short-vowel contrast |
| 쌍동밤 | 쌍동밤 | s͈aŋ doŋ pam | short-vowel contrast |
| 수많이 | 수마니 | suː ma ni | explicit length exception |
| 눈멀다 | 눈멀다 | nun mʌl ta | short-vowel contrast |
| 떠벌리다 | 떠벌리다 | t͈ʌ bʌl li da | short-vowel contrast |
| 재삼재사 | 재삼재사 | tɕɛː sam dʑɛː sa | compound length |
| 반신반의 | 반신바늬; variant 반신바니 | paːn ɕin baː ni | permitted 의 reading variant |
| 봐 | 봐 | pwaː | contracted long vowel |
| 겨 | 겨 | kjʌː | contracted long vowel |
| 돼 | 돼 | twɛː | contracted long vowel |
| 둬 | 둬 | twʌː | contracted long vowel |
| 해 | 해 | hɛː | contracted long vowel |
| 와 | 와 | wa | short contracted form |
| 져 | 저 | tɕʌ | short contracted form |
| 쪄 | 쩌 | tɕ͈ʌ | short contracted form |
| 쳐 | 처 | tɕʰʌ | short contracted form |
| 감다 | 감따 | kaːm t͈a | citation-form length |
| 밟다 | 밥따 | paːp̚ t͈a | citation-form length |
| 신다 | 신따 | ɕiːn t͈a | citation-form length |
| 알다 | 알다 | aːl da | citation-form length |
| 끌다 | 끌따 | k͈ɯːl t͈a | citation-form length |
| 떨다 | 떨다 | t͈ʌːl da | citation-form length |
| 벌다 | 벌다 | pʌːl da | citation-form length |
| 쓸다 | 쓸다 | s͈ɯːl da | citation-form length |
| 떫다 | 떨따 | t͈ʌːl t͈a | citation-form length |
| 없다 | 업따 | ʌːp̚ t͈a | citation-form length |

The full test has further alternation pairs and needs complete extraction.

### NIKL §§10, 19–20 — coda, ordered nasalization and liquid assimilation
Source: tests/nikl-articles-10-19-20-complete-examples.test.mjs

| Input | Expected IPA or surface | Test purpose |
|---|---|---|
| 넋 | nʌk̚ | generic simple-coda realization, no lexical override |
| 값 | kap̚ | generic simple-coda realization, no lexical override |
| 담력 | tam njʌk̚ | §19 ordered liquid-to-nasal |
| 침략 | tɕʰim njak̚ | §19 ordered assimilation |
| 강릉 | kaŋ nɯŋ | §19 |
| 항로 | haŋ no | §19 |
| 대통령 | tɛ tʰoŋ njʌŋ | §19 |
| 막론 | maŋ non | §19 then nasal assimilation |
| 백리 | pɛŋ ni | §19 then nasal assimilation |
| 석류 | sʌŋ nju | §19 then nasal assimilation |
| 협력 | hjʌm njʌk̚ | both rules, in order |
| 십리 | ɕim ni | §19 |
| 법리 | pʌm ni | §19 |
| 난로 | nal lo | productive liquid assimilation |
| 신라 | ɕil la | productive liquid assimilation |
| 천리 | tɕʰʌl li | productive liquid assimilation |
| 광한루 | kwaŋ hal lu | productive liquid assimilation |
| 대관령 | tɛ ɡwal ljʌŋ | productive liquid assimilation |
| 칼날 | kʰal lal | productive liquid assimilation |
| 물난리 | mul lal li | productive liquid assimilation |
| 할는지 | hal lɯn dʑi | productive liquid assimilation |
| 닳는 | tal lɯn | productive liquid assimilation |
| 뚫는 | t͈ul lɯn | productive liquid assimilation |
| 핥네 | hal le | productive liquid assimilation |
| 의견란 | 의견난 | listed exception |
| 임진란 | 임진난 | listed exception |
| 생산량 | 생산냥 | listed exception |
| 결단력 | 결딴녁 | listed exception |
| 공권력 | 공꿘녁 | listed exception |
| 동원령 | 동원녕 | listed exception |
| 상견례 | 상견녜 | listed exception |
| 횡단로 | 횡단노 | listed exception |
| 이원론 | 이원논 | listed exception |
| 입원료 | 이붠뇨 | listed exception |
| 구근류 | 구근뉴 | listed exception |

### NIKL §§17–18 — palatalization and nasal assimilation
Source: tests/nikl-articles-17-18-complete-examples.test.mjs

| Input | Expected surface | Expected IPA |
|---|---|---|
| 곧이듣다 | 고지듣따 | ko dʑi dɯt̚ t͈a |
| 굳이 | 구지 | ku dʑi |
| 미닫이 | 미다지 | miː da dʑi |
| 땀받이 | 땀바지 | t͈am ba dʑi |
| 밭이 | 바치 | pa tɕʰi |
| 벼훑이 | 벼훌치 | pjʌ hul tɕʰi |
| 굳히다 | 구치다 | ku tɕʰi da |
| 닫히다 | 다치다 | ta tɕʰi da |
| 묻히다 | 무치다 | mu tɕʰi da |
| 먹는 | 멍는 | mʌŋ nɯn |
| 국물 | 궁물 | kuŋ mul |
| 깎는 | 깡는 | k͈aŋ nɯn |
| 키읔만 | 키응만 | kʰi ɯŋ man |
| 몫몫이 | 몽목씨 | moŋ mok̚ ɕ͈i |
| 긁는 | 긍는 | kɯŋ nɯn |
| 흙만 | 흥만 | hɯŋ man |
| 닫는 | 단는 | tan nɯn |
| 짓는 | 진는 | tɕiːn nɯn |
| 옷맵시 | 온맵씨 | on mɛp̚ ɕ͈i |
| 있는 | 인는 | in nɯn |
| 맞는 | 만는 | man nɯn |
| 젖멍울 | 전멍울 | tɕʌn mʌŋ ul |
| 쫓는 | 쫀는 | tɕ͈on nɯn |
| 꽃망울 | 꼰망울 | k͈on maŋ ul |
| 붙는 | 분는 | pun nɯn |
| 놓는 | 논는 | non nɯn |
| 잡는 | 잠는 | tɕam nɯn |
| 밥물 | 밤물 | pam mul |
| 앞마당 | 암마당 | am ma daŋ |
| 밟는 | 밤는 | paːm nɯn |
| 읊는 | 음는 | ɯm nɯn |
| 없는 | 엄는 | ʌːm nɯn |
| 값매다 | 감매다 | kam mɛ da |

Cross-word examples asserted by the same test: 책 넣는다 → tɕʰɛŋ nʌn nɯn da; 흙 말리다 → hɯŋ mal li da; 옷 맞추다 → on mat̚ tɕʰu da; 밥 먹는다 → pam mʌŋ nɯn da; 값 매기다 → kam mɛ ɡi da. Full extraction must preserve each phrase's exact Ukrainian target and trace too.

### NIKL §12 — aspiration vs ㅎ deletion
Sources: tests/nikl-article-12-aspiration-vs-h-deletion.test.mjs and tests/nikl-articles-8-23-gap-closure.test.mjs

| Input | Expected surface | Expected IPA | Distinction |
|---|---|---|---|
| 놓고 | 노코 | no kʰo | ㅎ + ㄱ aspiration |
| 좋고 | 조코 | tɕo kʰo | aspiration |
| 좋다 | 조타 | tɕo tʰa | aspiration |
| 많고 | 만코 | man kʰo | aspiration |
| 많다 | 만타 | maːn tʰa | aspiration and length |
| 읽히다 | 일키다 | il kʰi da | second member of complex coda + ㅎ |
| 앉히다 | 안치다 | an tɕʰi da | complex coda + ㅎ |
| 넓히다 | 널피다 | nʌl pʰi da | complex coda + ㅎ |
| 놓아 | 노아 | no a | ㅎ deletion before vowel-initial ending |
| 싫어 | 시러 | ɕi ɾʌ | ㅎ deletion |
| 낳은 | 나은 | source row must supply exact IPA | §12(4), exact R003 license |
| 놓아 | 노아 | source row must supply exact IPA | §12(4), exact R003 license |
| 쌓이다 | 싸이다 | source row must supply exact IPA | §12(4), exact R003 license |
| 않은 | 아는 | source row must supply exact IPA | §12(4), exact R003 license |
| 닳아 | 다라 | source row must supply exact IPA | §12(4), exact R003 license |
| 싫어도 | 시러도 | source row must supply exact IPA | §12(4), exact R003 license |
| 쌓지 | 싸치 | source row must supply exact IPA | ㅎ + ㅈ aspiration |
| 먹히다 | 머키다 | source row must supply exact IPA | aspiration |
| 밝히다 | 발키다 | source row must supply exact IPA | aspiration |
| 맏형 | 마텽 | source row must supply exact IPA | aspiration |
| 좁히다 | 조피다 | source row must supply exact IPA | aspiration |
| 꽂히다 | 꼬치다 | source row must supply exact IPA | aspiration |
| 옷 한 벌 | 오탄벌 | source row must supply exact IPA | cross-word aspiration |
| 낮 한때 | 나탄때 | source row must supply exact IPA | cross-word aspiration |
| 꽃 한 송이 | 꼬탄송이 | source row must supply exact IPA | cross-word aspiration |
| 숱하다 | 수타다 | source row must supply exact IPA | ㅎ/ㄷ interaction |
| 닿소 | 다쏘 | source row must supply exact IPA | ㅎ interaction |
| 많소 | 만쏘 | source row must supply exact IPA | ㅎ interaction |
| 싫소 | 실쏘 | source row must supply exact IPA | ㅎ interaction |
| 쌓네 | 싼네 | source row must supply exact IPA | ㅎ + ㄴ |
| 않네 | 안네 | source row must supply exact IPA | ㅎ + ㄴ |
| 않는 | 안는 | source row must supply exact IPA | ㅎ + ㄴ |
| 뚫네 | 뚤레 | source row must supply exact IPA | ㅎ + ㄴ and liquid |

### NIKL §15 and §14 — substantive and complex-coda liaison
Sources: tests/nikl-article-15-substantive-morpheme-liaison.test.mjs and tests/adversarial-complex-coda-liaison-2026-10-10.test.mjs

| Input | Expected surface | Expected IPA |
|---|---|---|
| 맛없다 | 마덥따 | ma dʌp̚ t͈a |
| 겉옷 | 거돋 | kʌ dot̚ |
| 값어치 | 가버치 | ka bʌ tɕʰi |
| 밭 아래 | 바다래 | pa ta ɾɛ |
| 맛있다 | 마딛따; variant 마싣따 | ma dit̚ t͈a |
| 넋이 | 넉씨 | nʌk̚ ɕ͈i |
| 앉아 | 안자 | an dʑa |
| 곬이 | 골씨 | kol ɕ͈i |
| 핥아 | 할타 | hal tʰa |
| 읊어 | 을퍼 | ɯl pʰʌ |
| 몫이 | 목씨 | mok̚ ɕ͈i |
| 값이 | 갑씨 | kap̚ ɕ͈i |
| 값을 | 갑쓸 | kap̚ s͈ɯl |
| 넓어 | 널버 | nʌl bʌ |
| 넓으니 | 널브니 | nʌl bɯ ni |
| 넓은 | 널븐 | nʌl bɯn |
| 넓습니다 | 널씀니다 | nʌl s͈ɯm ni da |
| 넓지 | 널찌 | nʌl tɕ͈i |
| 짧아 | 짤바 | tɕ͈al ba |
| 짧으니 | 짤브니 | tɕ͈al bɯ ni |

### Adversarial forms
Sources: tests/adversarial-standard-pronunciation-2026-10-10.test.mjs, tests/adversarial-standard-pronunciation-followup-2026-10-10.test.mjs, tests/adversarial-morphology-corpus-2026-10-10.test.mjs

| Input | Expected surface | Expected Ukrainian | Expected IPA |
|---|---|---|---|
| 밝는 | 방는 | паннин | paŋ nɯn |
| 묽게 | 물께 | мулке | mul k͈e |
| 실없다 | 시럽따 | шіропта | ɕi ɾʌp̚ t͈a |
| 몇으로 | 며츠로 | мйочиро | mjʌ tɕʰɯ ɾo |
| 값있는 | 가빈는 | кабіннин | ka bin nɯn |
| 앞일 | 암닐 | амніл | am nil |
| 무늬 | 무니 | муні | mu ni |
| 넋받이 | 넉빠지 | нокпаджі | nʌk̚ p͈a dʑi |
| 지식의 | 지시긔; variant 지시게 | чішіґий; variant чішіґе | tɕi ɕi ɡɰi; variant tɕi ɕi ɡe |
| 읽고 | 일꼬 | ілко | il k͈o |
| 읽는 | 잉는 | іннин | iŋ nɯn |
| 읽어 | 일거 | ілґо | il ɡʌ |
| 밟다 | 밥따 | папта | paːp̚ t͈a |
| 밟고 | 밥꼬 | папко | paːp̚ k͈o |
| 밟는 | 밤는 | памнин | paːm nɯn |
| 맑게 | 말께 | малке | mal k͈e |
| 묽고 | 물꼬 | мулко | mul k͈o |
| 읊는 | 음는 | имнин | ɯm nɯn |
| 삯돈 | — | сактон | sak̚ t͈on |
| 읊조리다 | — | ипчоріда | ɯp̚ tɕ͈o ɾi da |
| 맑는 | — | маннин | maŋ nɯn |
| 밭이랑 | 반니랑 | — | pan ni ɾaŋ |
| 집안일 | 지반닐 | — | tɕi ban nil |
| 공업용 | 공엄뇽 | — | koŋ ʌm njoŋ |
| 얇실하다 | 얄씰하다 | — | jal ɕ͈il ha da |
| 밭갈이 | 받까리 | — | pat̚ k͈a ɾi |
| 값지다 | 갑찌다 | — | kap̚ tɕ͈i da |
| 짧다 | 짤따 | — | tɕ͈al t͈a |
| 삶다 | 삼따 | — | samː t͈a |
| 읽거든 | 일꺼든 | — | il k͈ʌ dɯn |
| 있었다 | 이썯따 | ісотта | i s͈ʌt̚ t͈a |
| 있었고 | 이썯꼬 | ісотко | i s͈ʌt̚ k͈o |
| 웃었고 | 우섣꼬 | усотко | u sʌt̚ k͈o |
| 넓어졌다는 | 널버젇따는 | нолбоджоттанин | nʌl bʌ dʑʌt̚ t͈a nɯn |
| 삯일을 | 상니를 | саннірил | saŋ ni ɾɯl |

### NIKL §§24–30 — exact morphology inventories
Source: tests/nikl-articles-24-30-complete-corpus.test.mjs. These are closed, exact-form examples, not automatically productive rules.

- §24: 안다→안따, 안고→안꼬, 안지→안찌, 감다→감따, 감고→감꼬, 감지→감찌, 앉고→안꼬, 앉지→안찌, 삼고→삼꼬, 삼지→삼찌, 젊고→점꼬, 젊지→점찌, 안기다→안기다, 감기다→감기다, 굶기다→굼기다, 옮기다→옴기다.
- §25: 넓게→널께, 핥다→할따, 훑소→훌쏘, 떫지→떨찌.
- §26: 갈등→갈뜽, 발동→발똥, 절도→절또, 말살→말쌀, 불소→불쏘, 일시→일씨, 갈증→갈쯩, 물질→물찔, 발전→발쩐, 몰상식→몰쌍식, 불세출→불쎄출, 허허실실→허허실실, 절절하다→절절하다.
- §27: 할걸→할껄, 할밖에→할빠께, 할세라→할쎄라, 할수록→할쑤록, 할진대→할찐대, 할지라도→할찌라도, 할지언정→할찌언정.
- §28: 문고리→문꼬리, 눈동자→눈똥자, 신바람→신빠람, 산새→산쌔, 손재주→손째주, 길가→길까, 물동이→물똥이, 발바닥→발빠닥, 굴속→굴쏙, 술잔→술짠, 바람결→바람껼, 그믐달→그믐딸, 아침밥→아침빱, 잠자리→잠짜리, 강가→강까, 초승달→초승딸, 등불→등뿔, 창살→창쌀, 강줄기→강쭐기.
- §29: 솜이불→솜니불, 홑이불→혼니불, 막일→망닐, 삯일→상닐, 맨입→맨닙, 꽃잎→꼰닙, 내복약→내봉냑, 한여름→한녀름, 남존여비→남존녀비, 신여성→신녀성, 색연필→생년필, 직행열차→지캥녈차, 늑막염→능망념, 콩엿→콩녇, 담요→담뇨, 눈요기→눈뇨기, 영업용→영엄뇽, 식용유→시굥뉴, 백분율→백뿐뉼, 국민윤리→궁민뉼리, 밤윷→밤뉻, 서울역→서울력, 물약→물략, 불여우→불려우, 들일→들릴, 솔잎→솔립, 설익다→설릭따, 물엿→물렫, 휘발유→휘발류, 유들유들→유들류들, 서른여섯→서른녀섣, 스물여섯→스물려섣, 3 연대→삼년대, 1 연대→일련대, 6·25→유기오, 3·1절→사밀쩔, 송별연→송벼련, 등용문→등용문, 이죽이죽→이중니죽, 야금야금→야금냐금, 검열→검녈, 욜랑욜랑→욜랑뇰랑, 금융→금늉.
- §30: 냇가→내까, 샛길→새낄, 빨랫돌→빨래똘, 콧등→코뜽, 깃발→기빨, 대팻밥→대패빱, 햇살→해쌀, 뱃속→배쏙, 뱃전→배쩐, 고갯짓→고개찓, 콧날→콘날, 아랫니→아랜니, 툇마루→퇸마루, 뱃머리→밴머리, 베갯잇→베갠닏, 깻잎→깬닙, 나뭇잎→나문닙, 도리깻열→도리깬녈, 뒷윷→뒨뉻.

The test also has additional contrast assertions (including noun/verb homographs and negative license controls); extract them separately. The separate morphology guard test lists generic-mode negative controls: 껴안다, 얹다, 더듬지, 젊지, 앉고, 안기다, 감기다, 굶기다, 옮기다, 넓게, 핥다, 훑소, 떫지, 불소, 발전, 몰상식, 불세출, 문고리. Exact positive controls: 닮다 → tam.t͈a; 넘게 → nʌm.k͈e; 안지 → an.tɕ͈i; 신다 → sin.t͈a; 닮고 → surface 담꼬 with §24 trace.

### IPA → Ukrainian adapter and fail-closed controls
Sources: tests/ipa-ukrainian-trace.test.mjs and tests/ipa-first-runtime-invariant.test.mjs

- dʑi → dʑ→дж, i→і; output джі.
- ɕi → ɕ→ш, i→і; output ші.
- ka → ка; ɡa → ґа; tɕʰi → чі; t͈a → та.
- IPA ɡ is valid and maps to ґ; ASCII g is unknown and must not silently alias it.
- ɕ☃ retains unknown symbol ☃ and fails closed; 💥 is unknown, not transliterated.
- These whole tokens must remain unresolved with empty IPA, empty Ukrainian output and no derived variants: 짧은소리의, 수많이는, 없으니를, 없애다에서는, 값에서는, 밟으니와, 싫어도에서는, 외곬에를, 값있는에서는, 히읗을의, 벼훑이를, 밭이와, 붙임.

### Phrase-boundary and ordered-rule controls
Sources: tests/nikl-articles-18-20-generic-assimilation-2026-10-11.test.mjs and tests/nikl-articles-9-18-23-29-interaction-2026-10-11.test.mjs

- 국물 → kuŋ mul; 앞마당 → am ma daŋ; 닫는 → tan nɯn: productive nasal assimilation in generic mode.
- 협력 → hjʌm njʌk̚: liquid-to-nasal before obstruent precedes coda nasal assimilation.
- 밥 먹는다 → pam mʌŋ nɯn da: connected phrase assimilates; 밥, 먹는다 must not share the connected-phrase output.
- 국밥 → kuk̚ p͈ap̚: §9 neutralized obstruent coda can license fortition.
- 간가, 갈가, 감가, 강가: no fortition trace from sonorant codas.
- 옷 입다 → on nip̚ t͈a: exact phrase-specific §29 insertion; 옷, 입다 must not trigger insertion across punctuation.

## Research-teacher and IPA-corpus cases — keep separate from production rules

- Scratch teacher run 40296965071 / artifact 12638313059: 602/1000 exact; 107 length-mark-only mismatches (80 underpredictions, 27 overpredictions); 291 other mismatches.
- Distinct checkpoint artifacts 12638708277 and 12642016107: 596/1000 exact; 116 length-mark-only (92 underpredictions, 24 overpredictions); 288 other mismatches. Same pinned train/dev hashes as first run; checkpoint variation, not data conflict.
- SIGMORPHON/UGTPHON train intersection: 1,084 forms; 718 targets match after removing only SIGMORPHON token whitespace; 366 differ (151 length-mark-only diagnostic, 215 other symbol/feature differences). Not a count of missing rules.
- Charsiu SIGMORPHON dev: 676/1000 exact vs corpus annotation; Strict broad 332/994; both exact 330, Charsiu exact/Strict not exact 345, Charsiu not exact/Strict exact 2, both not exact 317, Strict abstained with teacher nonexact 5 and with teacher exact 1.
- Charsiu UGTPHON dev: 1670/1834 exact vs corpus annotation; Strict broad 977/1800; both exact 922, Charsiu exact/Strict not exact 728, Charsiu not exact/Strict exact 55, both not exact 95, Strict abstained with teacher nonexact 14 and with teacher exact 20.
- Convention examples: SIGMORPHON 가수 gold k a̠ sʰ u, Charsiu ka̠sʰu, Strict broad ka.su; UGTPHON 애들 gold and Charsiu ɛ̝dɯɭ, Strict broad ɛ.dɯl. Preserve raw case IDs/strings in the full artifact.
- The IPA adjudication queue regression uses two SIGMORPHON variants and an overlapping UGTPHON variant; both conflicting variants must remain queued. Extract exact rows from tests/test_build_korean_ipa_adjudication_queue.py.

These benchmark comparisons remain research-only. They do not establish a new production rule.

## Full source/test inventory to enumerate

The repository has many more tests than the examples above. Every file must have an explicit extraction status, including tests that contain no linguistic example (schema, integrity, UI, deployment and source-register tests). Include all files under tests/fixtures and tests/corpora.

### Browser/Node test families
- Adversarial: adversarial-balmne-surface-form-2026-10-10.test.mjs; adversarial-complex-coda-liaison-2026-10-10.test.mjs; adversarial-long-passage-2026-10-10.test.mjs; adversarial-morphology-corpus-2026-10-10.test.mjs; adversarial-n-insertion-exceptions-2026-10-10.test.mjs; adversarial-rule29-liquid-assimilation-2026-10-10.test.mjs; adversarial-sentence-corpus.test.mjs; adversarial-sentence-corpus-3.test.mjs; adversarial-standard-pronunciation-2026-10-10.test.mjs; adversarial-standard-pronunciation-followup-2026-10-10.test.mjs; adversarial-text-corpus-suite.test.mjs; tricky-passage-morphology-matrix-2026-10-10.test.mjs; user-corpus-standard-pronunciation.test.mjs; corpus-discovered-morphology-regressions.test.mjs; corpus-discovered-unresolved-repairs.test.mjs; corpus-sentence-and-trace-regression.test.mjs; reported-placeholder-regressions.test.mjs; reported-placeholder-regressions-2026-10-10.test.mjs.
- Normative rules/interactions: nikl-article-review-1-30.test.mjs; nikl-articles-2-3-inventory.test.mjs; nikl-articles-4-5-vowel-variants.test.mjs; nikl-articles-6-7-complete-corpus.test.mjs; nikl-articles-6-7-exhaustive-listed-examples.test.mjs; nikl-articles-8-23-gap-closure.test.mjs; nikl-articles-9-18-17-interaction-2026-10-11.test.mjs; nikl-articles-9-18-23-29-interaction-2026-10-11.test.mjs; nikl-articles-10-11-complex-coda-contrast.test.mjs; nikl-articles-10-19-20-complete-examples.test.mjs; nikl-articles-17-18-complete-examples.test.mjs; nikl-articles-18-20-generic-assimilation-2026-10-11.test.mjs; nikl-articles-24-30-complete-corpus.test.mjs; nikl-articles-27-29-phrase-boundary-controls-2026-10-11.test.mjs; nikl-article-10-11-morphological-contrasts-2026-10-11.test.mjs; nikl-article-12-aspiration-vs-h-deletion.test.mjs; nikl-article-12-generic-h-aspiration-2026-10-11.test.mjs; nikl-article-13-generic-formal-liaison.test.mjs; nikl-article-15-substantive-morpheme-liaison.test.mjs; nikl-article-30-saisiot-interaction-2026-10-11.test.mjs; nikl-article-30-saisiot-morphology-guard-2026-10-11.test.mjs; nikl-exhaustive-coda-matrix.test.mjs; nikl-fortition-context-matrix.test.mjs; nikl-generic-vowel-variants.test.mjs; nikl-morphology-guard-matrix-24-30.test.mjs; nikl-numeric-phrase-regression.test.mjs; nikl-ordered-rule-chains-and-boundary-isolation.test.mjs; nikl-palatalization-boundary-matrix.test.mjs; nikl-phrase-boundary-insertion-29.test.mjs; nikl-phrase-boundary-rules.test.mjs; nikl-pronunciation-regression.test.mjs; nikl-r11-exception-contrast-evidence.test.mjs; nikl-rule-boundary-regression-2026-10-10.test.mjs; nikl-substantive-liaison-matrix.test.mjs; nikl-surface-only-complex-coda.test.mjs.
- IPA, lexicon, morphology, parity and evidence: ipa-adjudication-queue.test.mjs; ipa-first-runtime-invariant.test.mjs; ipa-ukrainian-trace.test.mjs; lexical-csv-integrity-ipa-first.test.mjs; lexical-evidence-review-batch-01.test.mjs through lexical-evidence-review-batch-28.test.mjs; lexical-evidence-traceability-audit.test.mjs; lexicon-schema-and-adversarial-regression.test.mjs; independent-oracles-and-context-invariance-2026-10-10.test.mjs; g2pk-browser-parity-gate.test.mjs; g2pk-nikl-surface-corrections.test.mjs; g2pk-web-engine.test.mjs; common-verb-liaison-regression.test.mjs; soft-heuristic-morphology-formal-endings.test.mjs; soft-morphology-parity.test.mjs; normative-surface-evidence-fixture.test.mjs; r002-r003-source-adjudication-queue.test.mjs; validate-ipa-review-submission.test.mjs.
- Structural/data/UI/delivery: audit-nikl-article-test-index.test.mjs; deploy-pages-smoke-contract.test.mjs; engine-shared-hangul-properties.test.mjs; model-wide-target-consistency.test.mjs; nikl-agent-skill-evidence-contract.test.mjs; nikl-evidence-import.test.mjs; nikl-evidence-lexicon-roundtrip-2026-10-10.test.mjs; nikl-human-review-surface-regression.test.mjs; nikl-master-passage-engine-regression.test.mjs; nikl-norm-crawler.test.mjs; nikl-pdf-import.test.mjs; public-ui-functional-regression.test.mjs; source-register-rights-audit.test.mjs; standard-pronunciation-rule-coverage-gate.test.mjs; web-engine.test.mjs; web-ui-contract.test.mjs; mixed-input-jamo-policy-2026-10-15.test.mjs.
- Python test families include: test_analyze_korean_g2p_teacher_errors.py; test_analyze_korean_ipa_conflict_patterns.py; test_audit_korean_corpus_compatibility.py; test_audit_korean_ipa_symbol_inventories.py; test_audit_teacher_corpus_splits.py; test_build_korean_ipa_adjudication_queue.py; test_charsiu_research_split.py; test_cli.py; test_clusters.py; test_compare_korean_teacher_strict_dev.py; test_compare_morphology_analyzers.py; test_correspondence.py; test_data_integrity.py; test_end_to_end.py; test_evaluate_deterministic_rule_candidate.py; test_evidence.py; test_evidence_schemas.py; test_final_residual_abstention_triage.py; test_g2pk_diagnostic_ipa_gate.py; test_g2pk_engine.py; test_generated_artifact.py; test_generation.py; test_hangul.py; test_hangul_exhaustive.py; test_inventory.py; test_ipa.py; test_ipa_modifier_preservation.py; test_ipa_target_data_generated.py; test_ipa_target_renderer.py; test_ipa_tokenize_regression.py; test_korean_corpus_generator.py; test_korean_ukrainian_target.py; test_mine_deterministic_rule_candidates.py; test_morphology_ipa_delta_benchmark.py; test_morphology_rule_licenses.py; test_multi_engine_benchmark.py; test_narrow_ipa.py; test_native_surface_ipa_boundary.py; test_nikl_evidence_import_schema.py; test_nikl_manifest_schema.py; test_nikl_pdf_import_schema.py; test_packetize_korean_ipa_annotations.py; test_phonotactics.py; test_pipeline.py; test_prepare_korean_g2p_corpus.py; test_prepare_ugtphon_korean_corpus.py; test_research_morphology.py; test_rule_license_parity.py; test_rule_scope.py; test_rules.py; test_schemas.py; test_sigmorphon_benchmark.py; test_slavic_comparative_integrity.py; test_soft_morphology.py; test_soft_morphology_parity.py; test_source_register_integrity.py; test_target_renderer_holdout_24.py; test_train_korean_g2p_teacher.py; test_ugtphon_abstention_recovery.py; test_ugtphon_benchmark.py; test_ukrainian_adapter.py; test_unresolved_morphophonology.py; test_validate_korean_ipa_adjudications.py.

## Completion gates

1. Enumerate all tracked tests, fixtures, corpora, source-backed lexical rows, generated-artifact manifests and relevant benchmark reports at a pinned commit.
2. Extract cases into a machine-readable CSV or JSONL with stable IDs and one row per (case, test assertion, context).
3. Include every expected output and variant exactly as written. Preserve both literal test expectation and data-row expectation if they differ.
4. Recover observed output, pass/fail, commit SHA and workflow/run ID from logs/artifacts when available. Otherwise mark EXPECTED_ONLY or BLOCKED.
5. Include counterexamples and negative controls: punctuation/boundaries, no-lexicon mode, unresolved tokens, unknown IPA, morphology lookalikes, and tests that forbid a rule trace.
6. Keep teacher/benchmark disagreements separate with raw targets and explicit convention status; never label them missing rules by default.
7. Reconcile duplicates without deleting their per-test provenance.
8. Add integrity checks: every test file has a ledger status; every case literal extracted from test tables is represented; no target is fabricated; source/test IDs validate; generation is deterministic.
9. Only after completeness audit, conduct the rule-by-rule review. Promotion requires primary source, exact environment, morphology resolution, positive and negative controls, IPA adjudication, Ukrainian target review, browser/Python parity and independent evaluation.

## Next execution batch

- Finish the test/fixture manifest from the repository tree.
- Extract the full lexical dictionary and all 28 lexical-evidence test batches, cross-referencing each case to its NIKL source/evidence ID.
- Extract every test literal, expected IPA/target, variant and forbidden trace from every suite; add stable case IDs and per-run evidence.
- Retrieve relevant successful and failed CI artifacts/logs; record observed results only where a run ties to the exact commit.
- Validate the register and update the master handoff with completeness counts, hashes, commands and blockers.
- Do not resume production-rule changes until the completeness gate passes.

## Change log

2026-10-26: Initial register created from direct inspection of core NIKL/adversarial/IPA tests and the current teacher-research register. Status remains PARTIAL INVENTORY; no claim of complete extraction or current-head CI success.


## Machine-readable bases committed after initial inspection

- File inventory: [TEST-CASE-REGISTER-MANIFEST-2026-10-26.csv](../research/TEST-CASE-REGISTER-MANIFEST-2026-10-26.csv). It records 431 relevant tracked files at the refreshed branch tree: 179 test-source files, 177 fixture files, 1 test corpus file, plus Korean data and relevant research scripts/registers. Every discovered test/fixture is currently marked NOT_EXTRACTED until its individual cases are enumerated. This is a file manifest, not a case-completeness claim. Every discovered test/fixture is currently marked NOT_EXTRACTED until its individual cases are enumerated. This is a file manifest, not a case-completeness claim.
- Lexical base: [TEST-CASE-REGISTER-LEXICAL-BASE-2026-10-26.csv](../research/TEST-CASE-REGISTER-LEXICAL-BASE-2026-10-26.csv). It preserves all 644 data rows from data/korean/lexical_pronunciations.csv with exact surface, Ukrainian syllables, IPA, source, notes, variants and target status. Static generation check: 644 source rows, 17 output columns, zero malformed rows, zero duplicate input forms. The base deliberately marks test cross-reference and exact-head observed-run status as pending.
- Source lexical CSV blob SHA at extraction: 1bd0d8116a5f5a4e74bcdbf7fc4999445b4478c5.

These machine-readable files make the inventory reproducible and provide the lexical source-of-truth base. They do **not** yet satisfy the owner's “all examples from each test” requirement: each test assertion must still be linked to the case ledger, non-lexical test literals and fixture cases must be extracted, and actual results must be tied to exact commits/runs.


## Deterministic extractor added; results still pending execution

A standard-library-only extractor is now available at scripts/build_test_case_register.py. It is intentionally conservative:

- exports every lexical dictionary row with stable LEX IDs and exact fields;
- scans every textual file under tests/ and preserves each exact lexical-input occurrence with its file, line and raw line, but labels this TEXT_OCCURRENCE_REQUIRES_ASSERTION_CLASSIFICATION rather than pretending every occurrence is a test input;
- captures every Hangul span from every scanned test/fixture/corpus line into an unclassified candidate inventory, preserving the raw line so expected outputs and context are not lost;
- never reports pass/fail and never guesses a missing IPA or Ukrainian target;
- emits deterministic CSVs for the lexical base, lexical-to-test links, and Hangul-literal candidates.

Added tests/test_build_test_case_register.py to check stable IDs, exact token boundaries, test/fixture provenance and candidate preservation. These new tests have **not been run locally**; exact-head GitHub Actions results must be checked. The script's generated counts, malformed-row checks, candidate-review status and output hashes must be recorded only after an actual run. Its output is a high-recall candidate register, not automatic linguistic adjudication.


The extractor was expanded to preserve **every source line** from all scannable text files beneath `tests/`, not only Hangul spans. It now emits `TEST-CASE-REGISTER-SOURCE-LINES-2026-10-26.csv`, with stable line IDs, file/category, line number, exact raw line, per-line SHA-256, and explicit unclassified/pending-run status. This makes IPA-only or Latin-script expected values recoverable from their original assertion context. The generated artifact is not yet available: the matching GitHub Actions run is queued, so no line/candidate counts or output hashes are asserted here.


### Assertion candidate inventory

The extractor now also emits `TEST-CASE-REGISTER-ASSERTION-CANDIDATES-2026-10-26.csv`. It captures test declarations and assertion-like lines from JS and Python tests, each with stable ID, file/category, line number, exact raw line, and unclassified status. This is a review queue, not proof that each row is a complete independent case: multiline assertions, parametrized cases and helper-generated cases must be reconciled against the full source-line inventory. The extraction workflow validates unique stable IDs across all five generated inventories and uploads them as a commit-specific artifact.

## Inventory scope expanded — 2026-10-26

The extractor now preserves line-level candidates not only from tests/fixtures/corpora, but also from checked-in `data/korean/` (including the 24-form benchmark manifest and target-renderer holdout file) and `examples/`. Every candidate carries a source category; the lexical-to-test links still search only `tests/`, so a match in a data CSV cannot be misrepresented as a test assertion. The generator deliberately does not scan its own `research/` output directory, which would recursively ingest generated CSVs on the next run.

This is a broader **source inventory**, not yet a fully classified case register. Structured/minified JSON and historical CI artifacts still require dedicated parsers/importers; source-line preservation alone does not prove that each JSON object, model prediction, assertion, or actual run result has become an individual case row. The new unit test covers inclusion of a data CSV and verifies source-category separation. Exact-head CI has not yet passed, so generated counts remain pending.

## Exhaustive inventory extraction — verified artifact on 2026-10-26

The workflow **Exhaustive test-case register extraction** passed on commit `ed1e9830673d7388d077ee56d780f7cfb4d9f439`, run [40381081948](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381081948), artifact [12681810325](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381081948/artifacts/12681810325). The artifact is a reproducible, loss-preserving *candidate inventory*, not a fully adjudicated case register.

| Inventory measure | Extracted count | Meaning / limitation |
|---|---:|---|
| Lexical dictionary records | 644 | Every dictionary row has a stable lexical case ID; expected fields copied, not independently validated |
| Test files scanned | 357 | Test file inventory, not test-case count |
| Source files scanned | 385 | Tests, fixtures, and selected Korean data/examples |
| Lexical-to-test text links | 6,790 | Text occurrences only; still require assertion/test-context classification |
| Hangul literal candidates | 50,737 | Includes inputs, expected outputs, comments, examples and other contexts; not all are test cases |
| Raw source lines preserved | 34,452 | Exact line provenance and hashes preserved |
| Assertion/test-declaration candidates | 5,512 | Candidate declarations/assertions; requires semantic classification |
| Lexical inputs with at least one test text match | 644 | A text match is not proof that the assertion tests that lexical input |

The extraction gate is therefore **DONE_VERIFIED for reproducible candidate generation**, while the full semantic case register remains **PARTIAL**. The artifact must be retained as evidence and reused; do not rerun expensive teacher training merely to populate the case ledger. Next, classify assertions and connect cases to exact-head observed results, then join existing pinned teacher predictions by stable source/input identity.

## Exact-head CI failure triage

The current-head workflow batch for `ed1e9830673d7388d077ee56d780f7cfb4d9f439` did **not** pass:
- Core test workflow [40381081899](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381081899): browser tests failed; Python 3.13 tests failed; wheel-install and teacher-corpus audit passed.
- System verification [40381081817](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381081817): browser and Python regression jobs failed.
- Browser G2P integration [40381082133](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40381082133): failed.
- The same head's morphology-consensus IPA diagnostic, multi-engine IPA diagnostic, UGTPHON diagnostic, morphology adapter smoke, master artifacts, optional g2pK integration, teacher corpus split audit, paired native-vs-g2pk diagnostic, scratch teacher training, and teacher-corpus audit passed.

The observed browser suite reported 33 failures. A substantial cluster is IPA serialization disagreement: some tests expect period-separated syllables (e.g. `paŋ.nɯn`, `ɰiː.ɡjʌn.nan`), while outputs from lexical records used spaces; other assertions expect spaces while generic same-token output uses periods. This is a contract inconsistency to adjudicate against the repository's IPA schema and test intent—not a reason to globally replace separators or rewrite expected values without evidence. Additional observed failures include optional-vowel variant assertions, the exact-form `담고`/surface `담꼬` case, and the §30 saisiot case `뒨마루`. Preserve these as FAIL_OBSERVED until the IPA boundary/serialization contract and source-specific forms are checked.

The Python suite additionally exposed a test-only `NameError` because `tests/test_rules.py` called the public `phoneticize_korean` function without importing it. This was corrected in follow-up commit `b305cd7d0e7e8189d99e65d5c1d08be36014573e`; this fix is **not yet verified** until workflows for that exact head finish. Do not treat the pre-fix failure as a current-head result.

The case inventory must next be converted from occurrence lists to case-level evidence: one row per exact input × mode × expected assertion, retaining duplicate provenance, with expected and observed IPA kept distinct. No generalized production rule should be derived solely from teacher predictions or these unclassified literals.



## Lossless raw-line preservation fix — 2026-10-26

The register generator previously stripped leading/trailing whitespace from two derived inventories even though the source-line inventory preserved the original line. This made the derived occurrence rows non-lossless and could obscure indentation/context during later assertion classification.

- **Fixed in code commit** [dccb093e03d0aa493cca02339a22f15d29f09c8d](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/dccb093e03d0aa493cca02339a22f15d29f09c8d): raw_line and raw_test_line now retain the exact line string.
- **Regression added in** [ceda29b9e472f361cae5912e10e5896bcf7672b9](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/commit/ceda29b9e472f361cae5912e10e5896bcf7672b9): tests assert that the two leading spaces in a fixture assertion survive in both derived inventories.
- **Observed verification:** the Test extractor behavior step passed in the exact-head extraction workflow [40400451180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451180). The full inventory-generation/upload step was still running at the last check; generated counts and artifact hashes are not yet re-asserted for this head.
- **Full CI remains PARTIAL:** exact-head test matrix [40400451313](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451313) was queued at last check. Browser/system workflows have a separate failure cluster from the ongoing IPA dot-vs-space serialization migration; do not attribute those failures to this register patch or silently rewrite expected phonology.
- The generated inventories remain **candidate inventories**, not semantically complete case-level adjudication. The next acceptance gate is to classify assertions/fixtures and link observed results only to exact commit/run evidence.


## Updated lossless-inventory artifact — verified on code/test head ceda29b (2026-10-26)

The exact-head extraction workflow completed successfully: [run 40400451180](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451180), [artifact 12689091191](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40400451180/artifacts/12689091191).

| Inventory measure | Verified count | Interpretation |
|---|---:|---|
| Lexical dictionary records | 644 | Full lexical CSV row inventory |
| Test files scanned | 357 | File count, not test-case count |
| Source files scanned | 385 | Test sources, fixtures/corpora, selected Korean data and examples |
| Lexical-to-test text links | 6,794 | Occurrences; assertion semantics still unclassified |
| Hangul literal candidates | 50,753 | Includes inputs, expected values, comments and examples |
| Raw source lines preserved | 34,509 | Exact line text and per-line SHA-256 |
| Assertion/test-declaration candidates | 5,522 | Candidate lines; multiline/parameterized tests need semantic classification |
| Lexical inputs with at least one text match | 644 | Text match does not prove an assertion covers that input |

Artifact ZIP SHA-256: 1b7ebaf1feaeb0139b395388b052c639c43ba0db58a40723f7c60178ad287b3b. The extractor's focused tests, full generation step and upload all passed. This verifies reproducible candidate generation and lossless source preservation; it does **not** complete the semantic case ledger.


## Register extractor integrity gate — fail-closed source scanning (2026-10-26)

The extractor now stops with the offending path if a candidate source file cannot be decoded as UTF-8 or read due to an I/O error. Previously, such files were silently skipped, which could understate the scan denominator and compromise any completeness claim. The regression suite also checks a malformed UTF-8 fixture and verifies preserved source-line SHA-256 values against the exact UTF-8 encoding of each recorded `raw_line`.

**Status:** `DONE_VERIFIED` for the extractor behavior and inventory-generation gate on code head `63959896008b0a32ed43975a7ee7b33406fb9576`. Focused workflow [40406510664](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40406510664) passed the unit-test step and generated/uploaded all five inventories with stable-ID checks; Python regression/data integrity passed in [40406510656](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40406510656). The broader browser regression/build job failed on both this PR head and the base branch; its exact assertion could not be retrieved because the log endpoint returned `BlobNotFound`. Local execution remains unavailable because the container cannot resolve `github.com`. PR #342 was squash-merged into this research branch as `ce6f96927695eaed10cdbe3e848bfa1b5bea6c09` after the focused register workflow passed. The broader browser job remained failed on both the PR head and base branch, so this merge is not evidence of a green full-system run. This fix does not complete case-level classification, establish observed outcomes for every assertion, or resolve linguistic adjudication gates.


## Browser IPA serialization regression — acceptance status (2026-10-26)

The browser engine's output contract separates syllables within one source word with `.` while preserving spaces between source words. The initial browser suite failures were stale test-oracle serialization, not evidence of a changed pronunciation rule. PR [#343](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/pull/343) updated the test-only expectations using the existing source-boundary renderer and removed a duplicate import.

**Status:** `DONE_VERIFIED` for this test-oracle repair. PR #343 was squash-merged into the research branch as `19832224daab7d17b56df75485bb5461ea3c9ef9`. Exact-head system verification [40408709236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709236) passed browser regression/build and Python regression/data integrity; focused register extraction [40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171) passed inventory generation and artifact upload. The system workflow's official NIKL source inventory was skipped in metadata-only mode and is not counted as passed.

This change does not complete case-level classification, establish outcomes for every assertion, or resolve linguistic adjudication gates. No production runtime, IPA segment content, Ukrainian target, or pronunciation rule was changed.


## Exact-head inventory after assertion-candidate detector hardening (2026-10-26)

**Status:** `DONE_VERIFIED` for the lossless candidate-inventory generation on merged research head `19832224daab7d17b56df75485bb5461ea3c9ef9`.

- Extraction workflow [40408709171](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171) passed the extractor tests, generated all five inventories, validated stable IDs, and uploaded artifact [12691822644](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709171/artifacts/12691822644).
- Artifact ZIP SHA-256: `28271fcbf18402e8046399721e6c6be1db42d4998e94d6f2dee7c9ca9d0b223e` (3,083,197 bytes).

| Inventory measure | Exact-head count | Meaning / limitation |
|---|---:|---|
| Lexical dictionary records | 644 | CSV records, not all independently reviewed |
| Test files scanned | 359 | File count, not semantic test-case count |
| Source files scanned | 387 | In-scope sources read successfully; fail-closed on unreadable/invalid UTF-8 |
| Lexical-to-test text links | 6,801 | Text occurrences, not assertion coverage |
| Raw source lines preserved | 34,573 | Exact line text, including indentation, with hashes |
| Assertion/test-declaration candidates | 5,241 | Strictly detected source lines; still require semantic classification |
| Lexical inputs with text matches | 644 | Text match alone does not establish a test oracle |

The older 5,522 candidate count from artifact `12689091191` is historical and superseded by the stricter detector that excludes import/declaration false positives. This artifact validates reproducible candidate generation and preservation, **not** a complete case-level evidence ledger.

## System regression gate after IPA test-oracle repair

Exact-head system verification [40408709236](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40408709236) passed both browser regression/build and Python regression/data-integrity jobs. The official NIKL source inventory job was skipped in metadata-only mode and is not counted as a pass. The independent pronunciation adjudication, Ukrainian adaptation review, and source-rights gates remain open.


## Current PR #339 merge-ref artifact verification (2026-10-27)

The latest case-register workflow [40410859892](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859892) ran on synthetic PR merge commit `348a3dc18764191f68339333ce24bc0f54e2c523`, which merged research head `256b27a454c992218ca87a0fdf58ea6135071560` into `main` `a452054a669de28426404d1110731715083423bb`. It passed extractor tests, generation, stable-ID checks, and artifact upload: artifact [12693590917](https://github.com/ClippyFirst/Korean-Ukrainian-Phonetic-System/actions/runs/40410859892/artifacts/12693590917), ZIP SHA-256 `c8e90fe5bd121fa31073d087faa6787cf2136c4fa4e6e71962ba63c6b2b4a34e` (3,083,199 bytes). Inventory counts: 644 lexical records, 359 test files, 387 source files, 6,801 lexical text links, 34,573 preserved lines, 5,241 assertion/test-declaration candidates, 644 lexical inputs with at least one text match. This is reproducible candidate extraction, not a semantically complete case ledger.
