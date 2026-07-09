"""Commitment service.

This module contains business rules for commitment operations.
"""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import Depends
from fastapi import HTTPException

from app.models.commitment import Commitment
from app.repositories.commitment_repository import CommitmentRepository
from app.repositories.commitment_repository import get_commitment_repository
from app.schemas.commitment import CommitmentCreate
from app.schemas.commitment import CommitmentUpdate


class CommitmentService:
    """Apply commitment-specific business rules and orchestration."""

    def __init__(self, repository: CommitmentRepository):
        """Initialize the service with a commitment repository."""

        self.repository = repository

    def create_commitment(
        self,
        data: CommitmentCreate,
        user_id: str,
    ) -> Commitment:
        """Build a Commitment model from validated input, attach user_id, and persist it."""

        commitment = Commitment(
            title=data.title,
            description=data.description,
            category=data.category,
            source=data.source,
            priority=data.priority,
            deadline=data.deadline,
            estimated_duration=data.estimated_duration,
            user_id=user_id,
        )

        return self.repository.create(commitment)

    def create_many_commitments(
        self,
        commitments: list[Commitment],
        user_id: str,
    ) -> list[Commitment]:
        """Attach user_id to each and persist through the repository layer."""

        for c in commitments:
            c.user_id = user_id

        return self.repository.create_many(commitments)

    def get_all_commitments(self, user_id: str) -> list[Commitment]:
        """Return all commitments for the user."""

        return self.repository.get_all_commitments(user_id)

    def get_by_id(self, commitment_id: UUID, user_id: str) -> Commitment | None:
        """Return a commitment by identifier scoped to the user."""

        return self.repository.get_by_id_for_user(commitment_id, user_id)

    def list_all(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Commitment]:
        """Return commitments for the user with offset and limit."""

        return self.repository.list_all(user_id, skip=skip, limit=limit)

    def update_commitment(
        self,
        commitment_id: UUID,
        data: CommitmentUpdate,
        user_id: str,
    ) -> Commitment:
        """Apply partial updates to a commitment scoped to the user."""

        commitment = self.repository.get_by_id_for_user(commitment_id, user_id)
        if commitment is None:
            raise HTTPException(status_code=404, detail="Commitment not found")

        updates = data.model_dump(exclude_unset=True)
        for field_name, value in updates.items():
            setattr(commitment, field_name, value)

        commitment.updated_at = datetime.now(timezone.utc)
        return self.repository.update(commitment)

    def delete_commitment(self, commitment_id: UUID, user_id: str) -> None:
        """Delete a commitment after ensuring it exists and belongs to user."""

        commitment = self.repository.get_by_id_for_user(commitment_id, user_id)
        if commitment is None:
            raise HTTPException(status_code=404, detail="Commitment not found")

        self.repository.delete(commitment)


def get_commitment_service(
    repository: CommitmentRepository = Depends(get_commitment_repository),
) -> CommitmentService:
    """Provide a commitment service through FastAPI dependency injection."""

    return CommitmentService(repository)