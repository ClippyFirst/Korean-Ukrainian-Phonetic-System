from korean_ukrainian.pipeline import phonologize_korean,phoneticize_korean
def test_pipeline_layers_are_separate():
    p=phonologize_korean("가"); q=phoneticize_korean("가")
    assert p["syllables"][0]["onset"]=="ㄱ" and q["ipa"]["level"]=="broad" and q["rules"]
def test_rule_trace_is_structured():
    q=phoneticize_korean("국밥"); assert any(x["rule_id"]=="R008" and x["changed"] for x in q["rules"])
