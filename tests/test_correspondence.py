from korean_ukrainian.correspondence import rank_candidates
def test_feature_ranking_is_explainable_and_not_probability():
    ranked=rank_candidates({"place":"alveolar","manner":"stop"},[{"candidate_id":"a","features":{"place":"alveolar","manner":"stop"}},{"candidate_id":"b","features":{"place":"velar","manner":"stop"}}],{"place":2,"manner":2})
    assert ranked[0]["candidate_id"]=="a"; assert ranked[0]["score_type"]=="heuristic_cost"; assert "probability" not in ranked[0]
