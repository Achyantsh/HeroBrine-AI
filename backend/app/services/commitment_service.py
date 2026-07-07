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
    ) -> Commitment:
        """Build a Commitment model from validated input and persist it."""

        commitment = Commitment(
            title=data.title,
            description=data.description,
            category=data.category,
            source=data.source,
            priority=data.priority,
            deadline=data.deadline,
            estimated_duration=data.estimated_duration,
        )

        return self.repository.create(commitment)

    def create_many_commitments(
        self,
        commitments: list[Commitment],
    ) -> list[Commitment]:
        """Persist multiple commitments through the repository layer."""

        return self.repository.create_many(commitments)

    def get_all_commitments(self) -> list[Commitment]:
        """Return all commitments using the repository layer."""

        return self.repository.get_all_commitments()

    def get_by_id(self, commitment_id: UUID) -> Commitment | None:
        """Return a commitment by identifier using the repository layer."""

        return self.repository.get_by_id(commitment_id)

    def list_all(self, skip: int = 0, limit: int = 100) -> list[Commitment]:
        """Return commitments using the repository layer with offset and limit."""

        return self.repository.list_all(skip=skip, limit=limit)

    def update_commitment(
        self,
        commitment_id: UUID,
        data: CommitmentUpdate,
    ) -> Commitment:
        """Apply partial updates to a commitment and persist the changes."""

        commitment = self.repository.get_by_id(commitment_id)
        if commitment is None:
            raise HTTPException(status_code=404, detail="Commitment not found")

        updates = data.model_dump(exclude_unset=True)
        for field_name, value in updates.items():
            setattr(commitment, field_name, value)

        commitment.updated_at = datetime.now(timezone.utc)
        return self.repository.update(commitment)

    def delete_commitment(self, commitment_id: UUID) -> None:
        """Delete a commitment after ensuring it exists."""

        commitment = self.repository.get_by_id(commitment_id)
        if commitment is None:
            raise HTTPException(status_code=404, detail="Commitment not found")

        self.repository.delete(commitment)


def get_commitment_service(
    repository: CommitmentRepository = Depends(get_commitment_repository),
) -> CommitmentService:
    """Provide a commitment service through FastAPI dependency injection."""

    return CommitmentService(repository)