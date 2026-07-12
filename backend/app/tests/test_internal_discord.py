"""Tests for the protected internal Discord ingestion endpoints."""

from __future__ import annotations

import io
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient


class TestAuth:
    """Authentication-layer tests for the internal Discord routes."""

    ROUTES = [
        "/internal/discord/text",
        "/internal/discord/image",
        "/internal/discord/pdf",
        "/internal/discord/voice",
    ]

    def test_missing_header_returns_401(self, client: TestClient) -> None:
        """A request without X-HeroBrine-Internal-Key must be rejected."""
        for route in self.ROUTES:
            if route == "/internal/discord/text":
                resp = client.post(route, json={"user_id": str(...), "text": "hello"})
            else:
                resp = client.post(route)
            assert resp.status_code == 401, f"{route} did not return 401"
            assert resp.json()["detail"] == "Invalid internal API key."

    def test_incorrect_header_returns_401(self, client: TestClient) -> None:
        """An incorrect internal key must be rejected."""
        headers = {"X-HeroBrine-Internal-Key": "wrong-key"}
        for route in self.ROUTES:
            if route == "/internal/discord/text":
                resp = client.post(
                    route,
                    json={"user_id": str(...), "text": "hello"},
                    headers=headers,
                )
            else:
                resp = client.post(route, headers=headers)
            assert resp.status_code == 401, f"{route} did not return 401"
            assert resp.json()["detail"] == "Invalid internal API key."

    def test_correct_header_passes_auth(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
    ) -> None:
        """A valid key should pass auth, even if the body is incomplete."""
        for route in self.ROUTES:
            resp = client.post(route, headers=valid_internal_headers)
            assert resp.status_code != 401, f"{route} rejected a valid key"


class TestTextEndpoint:
    """Tests for POST /internal/discord/text."""

    def test_valid_request_calls_service(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
        valid_user_id: str,
        override_service: MagicMock,
    ) -> None:
        """Passing a valid user_id and text should invoke ingest_text."""
        payload = {"user_id": valid_user_id, "text": "Submit the report by Friday."}

        resp = client.post(
            "/internal/discord/text",
            json=payload,
            headers=valid_internal_headers,
        )

        assert resp.status_code == 200
        override_service.ingest_text.assert_called_once_with(
            payload["text"], valid_user_id,
        )

    def test_invalid_uuid_returns_422(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
    ) -> None:
        """An invalid user_id UUID must fail validation."""
        payload = {"user_id": "not-a-uuid", "text": "hello"}
        resp = client.post(
            "/internal/discord/text",
            json=payload,
            headers=valid_internal_headers,
        )
        assert resp.status_code == 422

    def test_blank_text_returns_422(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
        valid_user_id: str,
    ) -> None:
        """Empty or whitespace-only text must fail validation."""
        for text in ("", "   "):
            payload = {"user_id": valid_user_id, "text": text}
            resp = client.post(
                "/internal/discord/text",
                json=payload,
                headers=valid_internal_headers,
            )
            assert resp.status_code == 422, f"text={text!r} did not fail"

    def test_too_long_text_returns_422(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
        valid_user_id: str,
    ) -> None:
        """Text exceeding the maximum length must fail validation."""
        payload = {"user_id": valid_user_id, "text": "x" * 20_001}
        resp = client.post(
            "/internal/discord/text",
            json=payload,
            headers=valid_internal_headers,
        )
        assert resp.status_code == 422

    def test_service_value_error_maps_to_400(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
        valid_user_id: str,
        override_service: MagicMock,
    ) -> None:
        """A ValueError from the service layers should become HTTP 400."""
        override_service.ingest_text.side_effect = ValueError("Bad input")

        payload = {"user_id": valid_user_id, "text": "Some text"}
        resp = client.post(
            "/internal/discord/text",
            json=payload,
            headers=valid_internal_headers,
        )

        assert resp.status_code == 400
        assert resp.json()["detail"] == "Bad input"


class TestFileEndpoints:
    """Tests for POST /internal/discord/{image,pdf,voice}."""

    @pytest.mark.parametrize(
        "route,ingest_method,content_type,filename",
        [
            ("/internal/discord/pdf", "ingest_pdf", "application/pdf", "test.pdf"),
            ("/internal/discord/image", "ingest_image", "image/png", "test.png"),
            ("/internal/discord/voice", "ingest_voice", "audio/mpeg", "test.mp3"),
        ],
    )
    def test_file_upload_calls_correct_service(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
        valid_user_id: str,
        override_service: MagicMock,
        route: str,
        ingest_method: str,
        content_type: str,
        filename: str,
    ) -> None:
        """Each file endpoint must call the correct ingestion method."""
        file_content = b"fake file content"
        files = {
            "file": (filename, io.BytesIO(file_content), content_type),
            "user_id": (None, valid_user_id),
        }

        resp = client.post(
            route,
            files=files,
            headers=valid_internal_headers,
        )

        assert resp.status_code == 200, f"{route} failed with {resp.status_code}"
        mock_method = getattr(override_service, ingest_method)
        assert mock_method.call_count == 1
        # First positional arg is the UploadFile, second is the user_id string
        call_args = mock_method.call_args[0]
        assert call_args[1] == valid_user_id

    @pytest.mark.parametrize(
        "route",
        [
            "/internal/discord/pdf",
            "/internal/discord/image",
            "/internal/discord/voice",
        ],
    )
    def test_invalid_user_id_returns_422(
        self,
        client: TestClient,
        valid_internal_headers: dict[str, str],
        route: str,
    ) -> None:
        """An invalid UUID for user_id must fail with 422."""
        files = {
            "file": ("test.bin", io.BytesIO(b"data"), "application/octet-stream"),
            "user_id": (None, "not-a-uuid"),
        }
        resp = client.post(route, files=files, headers=valid_internal_headers)
        assert resp.status_code == 422


class TestPublicRoutesUnaffected:
    """Confirm that existing public routes are still registered and work."""

    def test_ai_save_route_exists(self, client: TestClient) -> None:
        """POST /ai/save should still be present (will fail auth but not 404)."""
        resp = client.post("/ai/save", json={"text": "hello"})
        assert resp.status_code != 404, "/ai/save is missing"

    def test_ai_extract_route_exists(self, client: TestClient) -> None:
        """POST /ai/extract should still be present."""
        resp = client.post("/ai/extract", json={"text": "hello"})
        assert resp.status_code != 404, "/ai/extract is missing"

    def test_ai_image_route_exists(self, client: TestClient) -> None:
        """POST /ai/image should still be present."""
        resp = client.post("/ai/image")
        assert resp.status_code != 404, "/ai/image is missing"

    def test_ai_pdf_route_exists(self, client: TestClient) -> None:
        """POST /ai/pdf should still be present."""
        resp = client.post("/ai/pdf")
        assert resp.status_code != 404, "/ai/pdf is missing"

    def test_ai_voice_route_exists(self, client: TestClient) -> None:
        """POST /ai/voice should still be present."""
        resp = client.post("/ai/voice")
        assert resp.status_code != 404, "/ai/voice is missing"