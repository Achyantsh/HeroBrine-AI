"""Commitment API routes.

This module exposes HTTP endpoints for commitment operations.
"""

from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi import Response
from fastapi import Query

from app.schemas.commitment import (
    CommitmentCreate,
    CommitmentResponse,
    CommitmentUpdate,
)
from app.services.commitment_service import CommitmentService
from app.services.commitment_service import get_commitment_service

router = APIRouter(
    prefix="/commitments",
    tags=["Commitments"],
)


@router.post(
    "",
    response_model=CommitmentResponse,
)
def create_commitment(
    payload: CommitmentCreate,
    service: CommitmentService = Depends(get_commitment_service),
) -> CommitmentResponse:
    """Create a commitment via the service layer."""

    return service.create_commitment(payload)


@router.get(
    "",
    response_model=list[CommitmentResponse],
)
def get_commitments(
    service: CommitmentService = Depends(get_commitment_service),
) -> list[CommitmentResponse]:
    """Return all commitments ordered from newest to oldest."""

    return service.list_all()


@router.get(
    "/{commitment_id}",
    response_model=CommitmentResponse,
)
def get_commitment_by_id(
    commitment_id: UUID,
    service: CommitmentService = Depends(get_commitment_service),
) -> CommitmentResponse:
    """Return a single commitment by identifier."""

    commitment = service.get_by_id(commitment_id)
    if commitment is None:
        raise HTTPException(status_code=404, detail="Commitment not found")

    return commitment


@router.patch(
    "/{commitment_id}",
    response_model=CommitmentResponse,
)
def update_commitment(
    commitment_id: UUID,
    payload: CommitmentUpdate,
    service: CommitmentService = Depends(get_commitment_service),
) -> CommitmentResponse:
    """Partially update a commitment and return the updated record."""

    return service.update_commitment(commitment_id, payload)


@router.delete(
    "/{commitment_id}",
    status_code=204,
)
def delete_commitment(
    commitment_id: UUID,
    service: CommitmentService = Depends(get_commitment_service),
) -> Response:
    """Delete a commitment and return no content."""

    service.delete_commitment(commitment_id)
    return Response(status_code=204)