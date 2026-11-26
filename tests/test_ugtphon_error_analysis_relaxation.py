"""The equivalence table of the UGTPHON error analysis must not hide real errors."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from analyze_ugtphon_ko_errors import relax_reference_conventions as relax, align


def test_aspiration_on_stops_is_never_relaxed():
    assert relax("kʰɯ") != relax("kɯ")      # ㅋ vs ㄱ is phonemic
    assert relax("tɕʰi") != relax("tɕi")


def test_reference_fricative_release_is_read_as_aspiration():
    assert relax("kxɯ") == relax("kʰɯ")
    assert relax("sʰo") == relax("so")


def test_fortis_and_voicing_are_not_relaxed():
    assert relax("s͈a") != relax("sa")
    assert relax("ɡa") != relax("ka")


def test_lateral_and_palatal_notation_equivalences():
    assert relax("wʌɭɭɛ") == relax("wʌllɛ")
    assert relax("tɕaŋɲju") == relax("tɕaŋnju")


def test_real_segment_differences_stay_visible():
    assert relax("tɕaŋnɯ") != relax("tɕaŋɾɯ")   # 장르: assimilated vs unassimilated
    assert align("ab", "ab") == []
    assert align("ab", "ac") == [("b", "c")]
