from .hangul import decompose_hangul, compose_hangul, generate_syllables
from .pipeline import analyze_korean, phonologize_korean, phoneticize_korean, map_ipa_to_ukrainian, rank_ukrainian_candidates, transliterate_korean
from .g2pk_engine import phoneticize_with_g2pk, transliterate_with_g2pk
from .ukrainian_adapter import UkrainianTargetAdapter
