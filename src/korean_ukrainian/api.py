from __future__ import annotations

from typing import Any

from .pipeline import analyze_korean, transliterate_korean
from .g2pk_engine import transliterate_with_g2pk


def create_app():
    try:
        from fastapi import FastAPI, HTTPException
        from pydantic import BaseModel, Field
    except ImportError as exc:
        raise RuntimeError("API dependencies are missing; install the [api] extra") from exc

    class AnalyzeRequest(BaseModel):
        text: str = Field(min_length=1)
        mode: str = "transliterate"
        pronunciation_engine: str = "native"
        descriptive_pronunciation: bool = False

    app = FastAPI(title="Korean → Ukrainian Phonetic System", version="0.6.0")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "version": "0.6.0"}

    def _run(req: AnalyzeRequest) -> dict[str, Any]:
        if req.pronunciation_engine not in {"native", "g2pk"}:
            raise ValueError("pronunciation_engine must be 'native' or 'g2pk'")
        if req.mode == "decompose":
            if req.pronunciation_engine != "native":
                raise ValueError("decompose mode is available only with pronunciation_engine='native'")
            return {"input": req.text, "analysis": analyze_korean(req.text)}
        if req.mode != "transliterate":
            raise ValueError(f"unsupported mode: {req.mode}")
        if req.pronunciation_engine == "g2pk":
            return transliterate_with_g2pk(
                req.text, descriptive=req.descriptive_pronunciation
            )
        return transliterate_korean(req.text)

    @app.post("/v1/analyze")
    def analyze(req: AnalyzeRequest) -> dict[str, Any]:
        try:
            return _run(req)
        except (ValueError, RuntimeError) as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    @app.post("/v1/transliterate")
    def transliterate(req: AnalyzeRequest) -> dict[str, Any]:
        if req.mode != "transliterate":
            raise HTTPException(status_code=422, detail="mode must be 'transliterate'")
        try:
            return _run(req)
        except (ValueError, RuntimeError) as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    return app


app = create_app()
