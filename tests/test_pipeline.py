from korean_ukrainian.pipeline import phonologize_korean,phoneticize_korean

def test_pipeline_layers_are_separate():
    p=phonologize_korean("가"); q=phoneticize_korean("가")
    assert p["syllables"][0]["onset"]=="ㄱ" and q["ipa"]["level"]=="broad" and q["rules"]

def test_rule_trace_is_structured():
    q=phoneticize_korean("국밥")
    assert any(x["rule_id"]=="R008" and x["changed"] for x in q["rules"])

def test_unknown_boundary_does_not_apply_contextual_rules():
    q=phoneticize_korean("국밥",boundary_mode="unknown")
    assert not any(x["changed"] for x in q["rules"] if x["rule_id"] in {"R002","R003","R004","R005","R006","R007","R008","R009"})

def test_n_insertion_requires_explicit_licensing():
    assert not any(x["changed"] for x in phoneticize_korean("먹이")["rules"] if x["rule_id"]=="R009")
    q=phoneticize_korean("한여름",n_insertion_licensed=True)
    assert any(x["rule_id"]=="R009" and x["changed"] for x in q["rules"])
    assert q["surface_syllables"][2]["onset"]=="ㄴ"

def test_phrase_n_insertion_requires_phrase_and_license():
    q=phoneticize_korean("무슨 일",boundary_mode="phrase",n_insertion_licensed=True)
    assert q["surface_syllables"][1]["onset"]=="ㄴ"
