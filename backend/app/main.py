"""FastAPI application entrypoint for HeroBrine AI.

This file creates the API application and exposes a simple health-style root route.
"""

from fastapi import FastAPI

from app.api.ai import router as ai_router
from app.api.commitments import router as commitment_router

app = FastAPI(title="HeroBrine AI API")
app.include_router(ai_router)
app.include_router(commitment_router)

@app.get("/")
def root() -> dict[str, str]:
    """Return a welcome message for the API root."""
    return {"message": "Welcome to HeroBrine AI API"}
