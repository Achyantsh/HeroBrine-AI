"""AI schemas.

This module contains request and response models for AI extraction endpoints.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.models.enums import Category, Priority, Source, Status


class AIExtractRequest(BaseModel):
    """Request payload for commitment extraction."""

    text: str


class AICommitment(BaseModel):
    """Typed commitment data returned by AI extraction."""

    title: str
    description: str | None = None

    category: Category
    priority: Priority

    deadline: datetime | None = None
    estimated_duration: int | None = None

    source: Source | None = None
    status: Status = Status.PENDING

    ai_confidence: float = 0.0


class AIExtractResponse(BaseModel):
    """Response payload containing extracted commitments."""

    commitments: list[AICommitment]