"""Schemas for internal (service-to-service) API endpoints."""

from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class DiscordTextRequest(BaseModel):
    """JSON body for ``POST /internal/discord/text``."""

    user_id: UUID
    text: str = Field(..., min_length=1, max_length=20_000)

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        """Reject whitespace-only strings that pass the min_length check."""
        if not v.strip():
            raise ValueError("Text must not be empty or whitespace-only.")
        return v