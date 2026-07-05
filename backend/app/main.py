"""FastAPI application entrypoint for HeroBrine AI.

This file creates the API application and exposes a simple health-style root route.
"""

from fastapi import FastAPI

app = FastAPI(title="HeroBrine AI API")


@app.get("/")
def root() -> dict[str, str]:
    """Return a welcome message for the API root."""
    return {"message": "Welcome to HeroBrine AI API"}
