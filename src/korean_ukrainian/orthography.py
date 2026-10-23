from __future__ import annotations

def render_sequence(segments:list[dict])->str:
    rendered=[]
    for segment in segments:
        grapheme=segment.get("grapheme","")
        if not grapheme:
            raise ValueError(f"target inventory did not provide an orthographic grapheme for candidate {segment.get('candidate_id')!r}")
        if rendered and segment.get("source_boundary_before")=="word":
            rendered.append(" ")
        rendered.append(grapheme)
    return "".join(rendered)
