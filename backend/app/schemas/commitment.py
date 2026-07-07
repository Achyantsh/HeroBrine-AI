from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.enums import Category, Priority, Source, Status


class CommitmentCreate(BaseModel):
    """Payload for creating a commitment."""

    title: str = Field(..., min_length=1, max_length=255)

    description: str | None = None

    category: Category = Category.OTHER

    source: Source = Source.MANUAL

    priority: Priority = Priority.MEDIUM

    deadline: datetime | None = None

    estimated_duration: int | None = None


class CommitmentUpdate(BaseModel):
    """Payload for partially updating a commitment."""

    title: str | None = None

    description: str | None = None

    category: Category | None = None

    source: Source | None = None

    priority: Priority | None = None

    status: Status | None = None

    deadline: datetime | None = None

    estimated_duration: int | None = None

    ai_confidence: float | None = None

    context: dict | None = None

    is_ai_generated: bool | None = None


class CommitmentResponse(BaseModel):
    """Returned commitment data."""

    id: UUID

    title: str

    description: str | None

    category: Category

    source: Source

    priority: Priority

    status: Status

    deadline: datetime | None

    estimated_duration: int | None

    ai_confidence: float | None

    is_ai_generated: bool

    created_at: datetime

    updated_at: datetime

    model_config = {
        "from_attributes": True
    }