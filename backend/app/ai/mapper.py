"""Helpers for converting AI schemas into ORM models."""

from __future__ import annotations

from app.models.commitment import Commitment
from app.schemas.ai import AICommitment


def to_commitment(ai_commitment: AICommitment) -> Commitment:
    """Convert an AI-generated commitment into a Commitment ORM model."""

    return Commitment(
        title=ai_commitment.title,
        description=ai_commitment.description,
        category=ai_commitment.category,
        source=ai_commitment.source,
        priority=ai_commitment.priority,
        status=ai_commitment.status,
        deadline=ai_commitment.deadline,
        estimated_duration=ai_commitment.estimated_duration,
        ai_confidence=ai_commitment.ai_confidence,
        is_ai_generated=True,
    )


def to_commitments(
    ai_commitments: list[AICommitment],
) -> list[Commitment]:
    """Convert multiple AI commitments into ORM models."""

    return [to_commitment(commitment) for commitment in ai_commitments]