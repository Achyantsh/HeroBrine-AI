"""Commitment repository.

This module contains persistence logic for Commitment records.
"""

from __future__ import annotations

from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.commitment import Commitment


class CommitmentRepository:
    """Persist Commitment entities with SQLAlchemy."""

    def __init__(self, db: Session):
        """Initialize the repository with a SQLAlchemy session."""

        self.db = db

    def create(self, commitment: Commitment) -> Commitment:
        """Save a commitment and return the refreshed ORM object."""

        self.db.add(commitment)
        self.db.commit()
        self.db.refresh(commitment)
        return commitment

    def create_many(self, commitments: list[Commitment]) -> list[Commitment]:
        """Save multiple commitments and return the refreshed ORM objects."""

        self.db.add_all(commitments)
        self.db.commit()

        for commitment in commitments:
            self.db.refresh(commitment)

        return commitments

    def update(self, commitment: Commitment) -> Commitment:
        """Persist changes to a commitment and return the refreshed object."""

        self.db.add(commitment)
        self.db.commit()
        self.db.refresh(commitment)
        return commitment

    def delete(self, commitment: Commitment) -> None:
        """Delete a commitment from the database."""

        self.db.delete(commitment)
        self.db.commit()

    def get_all_commitments(self, user_id: str) -> list[Commitment]:
        """Return all commitments for a user ordered by newest first."""

        statement = (
            select(Commitment)
            .where(Commitment.user_id == user_id)
            .order_by(Commitment.created_at.desc())
        )
        return list(self.db.scalars(statement).all())

    def get_by_id(self, commitment_id: UUID) -> Commitment | None:
        """Return a commitment by its identifier, if it exists."""

        return self.db.get(Commitment, commitment_id)

    def get_by_id_for_user(self, commitment_id: UUID, user_id: str) -> Commitment | None:
        """Return a commitment by id that belongs to the specified user."""

        statement = select(Commitment).where(
            Commitment.id == commitment_id,
            Commitment.user_id == user_id,
        )
        return self.db.scalars(statement).first()

    def list_all(self, user_id: str, skip: int = 0, limit: int = 100) -> list[Commitment]:
        """Return commitments for a user ordered by newest first with offset and limit."""

        statement = (
            select(Commitment)
            .where(Commitment.user_id == user_id)
            .order_by(Commitment.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.scalars(statement).all())


def get_commitment_repository(
    db: Session = Depends(get_db),
) -> CommitmentRepository:
    """Provide a commitment repository through FastAPI dependency injection."""

    return CommitmentRepository(db)