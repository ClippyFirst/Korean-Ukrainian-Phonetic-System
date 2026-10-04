from __future__ import annotations

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "scripts" / "korean_ukrainian_target.py"


def load_target():
    spec = importlib.util.spec_from_file_location("korean_ukrainian_target", MODULE)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_primary_target_neutralizes_aspiration():
    target = load_target()
    assert target.project_segment("ㅋ", "kʰ").graphemic == "к"
    assert target.project_segment("ㅌ", "tʰ").graphemic == "т"
    assert target.project_segment("ㅍ", "pʰ").graphemic == "п"
    assert target.project_segment("ㅊ", "tɕʰ").graphemic == "ч"


def test_ipa_preserves_lenis_voicing_while_target_follows_surface():
    target = load_target()
    assert target.project_segment("ㄱ", "k").graphemic == "к"
    assert target.project_segment("ㄱ", "ɡ").graphemic == "ґ"
    assert target.project_segment("ㄷ", "t").graphemic == "т"
    assert target.project_segment("ㄷ", "d").graphemic == "д"
    assert target.project_segment("ㅂ", "p").graphemic == "п"
    assert target.project_segment("ㅂ", "b").graphemic == "б"


def test_fortisness_is_not_encoded_as_primary_double_graphemes():
    target = load_target()
    assert target.project_segment("ㄲ", "k͈").graphemic == "к"
    assert target.project_segment("ㄸ", "t͈").graphemic == "т"
    assert target.project_segment("ㅃ", "p͈").graphemic == "п"
    assert target.project_segment("ㅆ", "s͈").graphemic == "с"
    assert target.project_segment("ㅉ", "tɕ͈").graphemic == "ч"


def test_sibilant_before_i_is_context_sensitive():
    target = load_target()
    assert target.project_segment("ㅅ", "ɕ", following="ㅣ").graphemic == "ш"
    assert target.project_segment("ㅅ", "s", following="ㅏ").graphemic == "с"


def test_liquid_and_velar_nasal_are_not_collapsed_at_analytical_layer():
    target = load_target()
    assert target.project_segment("ㄹ", "ɾ").graphemic == "р"
    assert target.project_segment("ㄹ", "l").graphemic == "л"
    assert target.project_segment("ㅇ", "ŋ").graphemic == "н"
    assert target.project_segment("ㅇ", "", onset=True).graphemic == ""


def test_aspiration_and_fortis_are_retained_in_decision_metadata():
    target = load_target()
    aspirated = target.project_segment("ㅋ", "kʰ")
    fortis = target.project_segment("ㄲ", "k͈")
    assert "aspiration" in aspirated.features
    assert "fortis" in fortis.features
    assert aspirated.mode == "primary_practical"
    assert fortis.mode == "primary_practical"
