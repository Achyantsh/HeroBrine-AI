"""Commitment API routes.

This module exposes HTTP endpoints for commitment operations.
"""

from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi import Response
from fastapi import Query

from app.auth.dependencies import get_current_user
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
    current_user: dict = Depends(get_current_user),
    service: CommitmentService = Depends(get_commitment_service),
) -> CommitmentResponse:
    """Create a commitment for the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return service.create_commitment(payload, user_id)


@router.get(
    "",
    response_model=list[CommitmentResponse],
)
def get_commitments(
    current_user: dict = Depends(get_current_user),
    service: CommitmentService = Depends(get_commitment_service),
) -> list[CommitmentResponse]:
    """Return all commitments for the authenticated user ordered from newest to oldest."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return service.list_all(user_id)


@router.get(
    "/{commitment_id}",
    response_model=CommitmentResponse,
)
def get_commitment_by_id(
    commitment_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: CommitmentService = Depends(get_commitment_service),
) -> CommitmentResponse:
    """Return a single commitment scoped to the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    commitment = service.get_by_id(commitment_id, user_id)
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
    current_user: dict = Depends(get_current_user),
    service: CommitmentService = Depends(get_commitment_service),
) -> CommitmentResponse:
    """Partially update a commitment scoped to the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    return service.update_commitment(commitment_id, payload, user_id)


@router.delete(
    "/{commitment_id}",
    status_code=204,
)
def delete_commitment(
    commitment_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: CommitmentService = Depends(get_commitment_service),
) -> Response:
    """Delete a commitment scoped to the authenticated user."""

    user_id = current_user.get("sub", str(current_user.get("id", "")))
    service.delete_commitment(commitment_id, user_id)
    return Response(status_code=204)