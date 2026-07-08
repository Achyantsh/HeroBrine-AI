"""FastAPI application entrypoint for HeroBrine AI."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router
from app.api.commitments import router as commitment_router

app = FastAPI(title="HeroBrine AI API")

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)
app.include_router(commitment_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Welcome to HeroBrine AI API"}