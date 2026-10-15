#!/usr/bin/env python3
"""Apply IPA g→ɡ normalization to the 6 overlapping main lexicon rows."""
from pathlib import Path
path = Path('data/korean/lexical_pronunciations.csv')
text = path.read_text(encoding='utf-8')
replacements = [
    ('예쁘고,예쁘고,є|пи|ґо,je|p͈ɯ|go,', '예쁘고,예쁘고,є|пи|ґо,je|p͈ɯ|ɡo,'),
    ('연구원은,연구워는,йон|ґу|во|нин,jʌn|gu|wʌ|nɯn,', '연구원은,연구워는,йон|ґу|во|нин,jʌn|ɡu|wʌ|nɯn,'),
    ('발음과,바름과,па|рим|ґва,pa|rɯm|gwa,', '발음과,바름과,па|рим|ґва,pa|rɯm|ɡwa,'),
    ('강줄기,강쭐기,кан|чул|ґі,kaŋ|tɕ͈ul|gi,', '강줄기,강쭐기,кан|чул|ґі,kaŋ|tɕ͈ul|ɡi,'),
    ('베갯잇,베갠닏,пе|ґен|ніт,pe|gɛn|nit̚,', '베갯잇,베갠닏,пе|ґен|ніт,pe|ɡɛn|nit̚,'),
    ('도리깻열,도리깬녈,то|рі|ґен|ньол,to|ɾi|gɛn|ɲʌl,', '도리깻열,도리깬녈,то|рі|ґен|ньол,to|ɾi|ɡɛn|ɲʌl,'),
]
count = 0
for old, new in replacements:
    if old in text:
        text = text.replace(old, new, 1)
        count += 1
    else:
        print('skip or already fixed:', old[:40])
path.write_text(text, encoding='utf-8')
print(f'applied {count}/6 replacements')
