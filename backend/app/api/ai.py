"""AI extraction routes.

This module exposes FastAPI endpoints for AI ingestion and extraction.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import TypeVar

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.auth.dependencies import get_current_user
from app.schemas.ai import AIExtractRequest, AIExtractResponse
from app.schemas.commitment import CommitmentResponse
from app.services.ai_ingestion_service import AIIngestionService
from app.services.ai_ingestion_service import get_ai_ingestion_service

T = TypeVar("T")


def _call_or_raise(func: Callable[..., T], *args: object, **kwargs: object) -> T:
    """Call a service method and map validation errors to HTTP 400."""

    try:
        return func(*args, **kwargs)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/extract",
    response_model=AIExtractResponse,
)
def extract_commitments(
    payload: AIExtractRequest,
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> AIExtractResponse:
    """Extract commitments from plain text without persisting them."""

    return _call_or_raise(service.extract_text, payload.text)


@router.post(
    "/save",
    response_model=list[CommitmentResponse],
)
def save_commitments(
    payload: AIExtractRequest,
    current_user: dict = Depends(get_current_user),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from text and persist them for the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return _call_or_raise(service.ingest_text, payload.text, user_id)


@router.post(
    "/pdf",
    response_model=list[CommitmentResponse],
)
def extract_commitments_from_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from a PDF upload and persist them for the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return _call_or_raise(service.ingest_pdf, file, user_id)


@router.post(
    "/image",
    response_model=list[CommitmentResponse],
)
def extract_commitments_from_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from an image upload and persist them for the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return _call_or_raise(service.ingest_image, file, user_id)


@router.post(
    "/voice",
    response_model=list[CommitmentResponse],
)
def extract_commitments_from_voice(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    service: AIIngestionService = Depends(get_ai_ingestion_service),
) -> list[CommitmentResponse]:
    """Extract commitments from an audio upload and persist them for the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return _call_or_raise(service.ingest_voice, file, user_id)