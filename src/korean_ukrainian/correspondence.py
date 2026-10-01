from __future__ import annotations
def feature_distance(source,target,weights):
    total=0.0; mismatches=[]
    for feature,weight in weights.items():
        sv,tv=source.get(feature),target.get(feature)
        if sv in {None,"", "na"} or tv in {None,"","na"}: continue
        if str(sv)!=str(tv):
            total+=float(weight); mismatches.append(feature)
    return {"cost":total,"mismatches":mismatches}

def rank_candidates(source_features,candidates,weights):
    ranked=[]
    for candidate in candidates:
        d=feature_distance(source_features,candidate.get("features",{}),weights)
        ranked.append({**candidate,"score":d["cost"],"mismatches":d["mismatches"],"score_type":"heuristic_cost"})
    return sorted(ranked,key=lambda x:(x["score"],x.get("candidate_id","")))
