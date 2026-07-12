"""Protected internal Discord ingestion routes.

These endpoints are called by the trusted Discord bot after it has
resolved a Discord member's ID to a HeroBrine / Supabase user UUID.
They reuse the same ingestion-and-persistence services as the public
``/ai/*`` endpoints.
"""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.auth.internal_api import verify_internal_api_key
from app.schemas.commitment import CommitmentResponse
from app.schemas.internal import DiscordTextRequest
from app.services.ai_ingestion_service import AIIngestionService
from app.services.ai_ingestion_service import get_ai_ingestion_service

router = APIRouter(
    prefix="/internal/discord",
    tags=["Internal Discord"],
    dependencies=[Depends(verify_internal_api_key)],
)


@router.post(
    "/text",
    response_model=list[CommitmentResponse],
)
def ingest_discord_text(
    payload: DiscordTextRequest,
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from a Discord message and persist them.

    The supplied ``user_id`` is the HeroBrine / Supabase user UUID that
    the Discord bot resolved via the ``profiles`` table.
    """
    try:
        return service.ingest_text(payload.text, str(payload.user_id))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post(
    "/pdf",
    response_model=list[CommitmentResponse],
)
def ingest_discord_pdf(
    user_id: UUID = Form(...),
    file: UploadFile = File(...),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from a PDF shared on Discord and persist them."""
    try:
        return service.ingest_pdf(file, str(user_id))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post(
    "/image",
    response_model=list[CommitmentResponse],
)
def ingest_discord_image(
    user_id: UUID = Form(...),
    file: UploadFile = File(...),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from an image shared on Discord and persist them."""
    try:
        return service.ingest_image(file, str(user_id))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post(
    "/voice",
    response_model=list[CommitmentResponse],
)
def ingest_discord_voice(
    user_id: UUID = Form(...),
    file: UploadFile = File(...),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from a voice message shared on Discord and persist them."""
    try:
        return service.ingest_voice(file, str(user_id))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc