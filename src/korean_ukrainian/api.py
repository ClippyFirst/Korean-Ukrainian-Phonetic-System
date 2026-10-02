from __future__ import annotations

from typing import Any

from .pipeline import analyze_korean, transliterate_korean


def create_app():
    try:
        from fastapi import FastAPI, HTTPException
        from pydantic import BaseModel, Field
    except ImportError as exc:
        raise RuntimeError("API dependencies are missing; install the [api] extra") from exc

    class AnalyzeRequest(BaseModel):
        text: str = Field(min_length=1)
        mode: str = "transliterate"

    app = FastAPI(title="Korean → Ukrainian Phonetic System", version="0.5.0")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "version": "0.5.0"}

    @app.post("/v1/analyze")
    def analyze(req: AnalyzeRequest) -> dict[str, Any]:
        try:
            if req.mode == "decompose":
                return {"input": req.text, "analysis": analyze_korean(req.text)}
            if req.mode == "transliterate":
                return transliterate_korean(req.text)
            raise ValueError(f"unsupported mode: {req.mode}")
        except (ValueError, RuntimeError) as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    @app.post("/v1/transliterate")
    def transliterate(req: AnalyzeRequest) -> dict[str, Any]:
        if req.mode != "transliterate":
            raise HTTPException(status_code=422, detail="mode must be 'transliterate'")
        try:
            return transliterate_korean(req.text)
        except (ValueError, RuntimeError) as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    return app


app = create_app()
