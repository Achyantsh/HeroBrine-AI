"""FastAPI application entrypoint for HeroBrine AI."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router
from app.api.commitments import router as commitment_router
from app.api.internal_discord import router as internal_discord_router
from app.api.profile import router as profile_router
from app.auth.dependencies import get_current_user
from fastapi import Depends


app = FastAPI(title="HeroBrine AI API")

# Allow frontend to access backend
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)
app.include_router(commitment_router)
app.include_router(internal_discord_router)
app.include_router(profile_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Welcome to HeroBrine AI API"}
@app.get("/me")
def me(user=Depends(get_current_user)):
    return user
@app.get("/health", tags=["System"])
async def health():
    return {"status": "ok"}