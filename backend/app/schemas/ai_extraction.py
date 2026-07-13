from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


Category = Literal[
    "assignment",
    "exam",
    "interview",
    "meeting",
    "project",
    "bill",
    "health",
    "personal",
    "event",
    "other",
]

Priority = Literal[
    "low",
    "medium",
    "high",
    "critical",
]


class ExtractedCommitment(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    category: Category = "other"
    priority: Priority = "medium"
    deadline: datetime | None = None
    estimated_duration: int | None = Field(
        default=None,
        ge=0,
    )
    dependencies: list[str] = Field(default_factory=list)
    ai_confidence: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
    )

    @field_validator("priority", mode="before")
    @classmethod
    def normalize_priority(cls, value: object) -> str:
        if not isinstance(value, str):
            return "medium"

        normalized = value.strip().lower()

        if normalized not in {
            "low",
            "medium",
            "high",
            "critical",
        }:
            return "medium"

        return normalized

    @field_validator("category", mode="before")
    @classmethod
    def normalize_category(cls, value: object) -> str:
        if not isinstance(value, str):
            return "other"

        normalized = value.strip().lower()

        allowed = {
            "assignment",
            "exam",
            "interview",
            "meeting",
            "project",
            "bill",
            "health",
            "personal",
            "event",
            "other",
        }

        return normalized if normalized in allowed else "other"


class CommitmentExtractionResponse(BaseModel):
    commitments: list[ExtractedCommitment] = Field(
        default_factory=list
    )