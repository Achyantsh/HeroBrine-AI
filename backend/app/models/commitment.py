"""Commitment entity model.

This module defines the core Commitment table for HeroBrine AI.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Boolean, CheckConstraint, DateTime, Enum as SAEnum
from sqlalchemy import Float, Index, Integer, String, func, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
from app.models.enums import Category, Priority, Source, Status


class Commitment(Base):
    """Represents a single actionable obligation in HeroBrine AI."""

    __tablename__ = "commitments"
    __table_args__ = (
        CheckConstraint(
            "ai_confidence IS NULL OR "
            "(ai_confidence >= 0.0 AND ai_confidence <= 1.0)",
            name="ck_commitments_ai_confidence_range",
        ),
        Index("ix_commitments_deadline", "deadline"),
        Index("ix_commitments_status", "status"),
        Index("ix_commitments_category", "category"),
        Index("ix_commitments_priority", "priority"),
    )

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(length=4000))
    category: Mapped[Category] = mapped_column(
        SAEnum(
            Category,
            name="commitment_category",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=Category.OTHER,
    )
    source: Mapped[Source] = mapped_column(
        SAEnum(
            Source,
            name="commitment_source",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=Source.MANUAL,
    )
    priority: Mapped[Priority] = mapped_column(
        SAEnum(
            Priority,
            name="commitment_priority",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=Priority.MEDIUM,
    )
    status: Mapped[Status] = mapped_column(
        SAEnum(
            Status,
            name="commitment_status",
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=Status.PENDING,
    )
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    estimated_duration: Mapped[int | None] = mapped_column(Integer)
    ai_confidence: Mapped[float | None] = mapped_column(Float)
    context: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    is_ai_generated: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false"),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    def __repr__(self) -> str:
        """Return a developer-friendly representation of the commitment."""

        return (
            "Commitment("
            f"id={self.id!r}, title={self.title!r}, status={self.status!r}, "
            f"priority={self.priority!r})"
        )