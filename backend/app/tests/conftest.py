"""Shared test fixtures and configuration."""

from __future__ import annotations

import os
from unittest.mock import MagicMock
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

# Set the internal API key before importing the app
os.environ["HEROBRINE_INTERNAL_API_KEY"] = "test-internal-key-12345"

from app.main import app  # noqa: E402
from app.services.ai_ingestion_service import (  # noqa: E402
    AIIngestionService,
    get_ai_ingestion_service,
)


@pytest.fixture(name="client")
def client_fixture() -> TestClient:
    """Provide a TestClient against the live FastAPI application."""
    return TestClient(app)


@pytest.fixture(name="valid_internal_headers")
def valid_internal_headers_fixture() -> dict[str, str]:
    """Return headers with a valid internal API key."""
    return {"X-HeroBrine-Internal-Key": "test-internal-key-12345"}


@pytest.fixture(name="valid_user_id")
def valid_user_id_fixture() -> str:
    """Return a valid UUID string representing a HeroBrine user."""
    return str(uuid4())


@pytest.fixture(name="mock_ingestion_service")
def mock_ingestion_service_fixture() -> MagicMock:
    """Return a mocked AIIngestionService that returns an empty list."""
    mock = MagicMock(spec=AIIngestionService)
    mock.ingest_text.return_value = []
    mock.ingest_pdf.return_value = []
    mock.ingest_image.return_value = []
    mock.ingest_voice.return_value = []
    return mock


@pytest.fixture(name="override_service")
def override_service_fixture(mock_ingestion_service: MagicMock) -> MagicMock:
    """Override the ``get_ai_ingestion_service`` dependency with a mock.

    The override is automatically cleaned up after the test.
    """
    app.dependency_overrides[get_ai_ingestion_service] = lambda: mock_ingestion_service
    yield mock_ingestion_service
    app.dependency_overrides.pop(get_ai_ingestion_service, None)