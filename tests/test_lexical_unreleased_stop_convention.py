"""Every sourced lexical IPA syllable that ends in a stop must carry the
unreleased diacritic, as the broad IPA coda table (ipa.CODA) and the other
~1,780 lexical syllables do. Four rows (솔잎, 설익다, 담력, 옷 입다) omitted it;
that is a dataset inconsistency, not a transcription choice: the browser phrase
pass could not rewrite their coda (it matches the ̚-bearing coda symbol), so
`솔잎 나무` missed §18 assimilation.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from korean_ukrainian.pipeline import LEXICAL_PRONUNCIATIONS


def test_no_lexical_ipa_syllable_ends_in_a_bare_stop():
    bare = [(key, syl) for key, row in LEXICAL_PRONUNCIATIONS.items()
            for syl in row.get("ipa_syllables", "").split("|") if re.search(r"[ptk]$", syl)]
    assert bare == []
