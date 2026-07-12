"""Focused tests for Discord attachment classification and routing."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest

# The module under test uses a real discord.Attachment-like interface.
# We build lightweight fakes for classification tests.


class FakeAttachment:
    """Minimal stand-in for ``discord.Attachment`` used only for classification."""

    def __init__(
        self,
        *,
        content_type: str | None = None,
        filename: str = "",
        size: int = 0,
        is_voice: bool = False,
    ) -> None:
        self.content_type = content_type
        self.filename = filename
        self.size = size
        self._is_voice = is_voice

    def is_voice_message(self) -> bool:
        return self._is_voice


# Import after defining FakeAttachment used in tests
from handlers.message_handler import classify_attachment  # noqa: E402


class TestClassifyAttachment:
    """Tests for the ``classify_attachment`` helper."""

    # --- Image by MIME ---

    def test_image_png_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="image/png", filename="pic.png",
        )) == "image"

    def test_image_jpeg_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="image/jpeg", filename="pic.jpg",
        )) == "image"

    def test_image_webp_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="image/webp", filename="pic.webp",
        )) == "image"

    # --- Image by extension (no MIME) ---

    def test_image_png_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="pic.png",
        )) == "image"

    def test_image_jpg_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="pic.jpg",
        )) == "image"

    def test_image_jpeg_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="pic.jpeg",
        )) == "image"

    def test_image_webp_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="pic.webp",
        )) == "image"

    # --- PDF by MIME ---

    def test_pdf_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="application/pdf", filename="doc.pdf",
        )) == "pdf"

    # --- PDF by extension ---

    def test_pdf_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="doc.pdf",
        )) == "pdf"

    # --- Voice by is_voice_message flag ---

    def test_voice_by_flag(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="audio/ogg", filename="voice.ogg", is_voice=True,
        )) == "voice"

    # --- Voice by MIME ---

    def test_voice_ogg_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="audio/ogg", filename="rec.ogg",
        )) == "voice"

    def test_voice_mpeg_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="audio/mpeg", filename="rec.mp3",
        )) == "voice"

    def test_voice_wav_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="audio/wav", filename="rec.wav",
        )) == "voice"

    def test_voice_m4a_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="audio/mp4", filename="rec.m4a",
        )) == "voice"

    def test_voice_webm_by_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="audio/webm", filename="rec.webm",
        )) == "voice"

    # --- Voice by extension ---

    def test_voice_ogg_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="rec.ogg",
        )) == "voice"

    def test_voice_mp3_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="rec.mp3",
        )) == "voice"

    def test_voice_wav_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="rec.wav",
        )) == "voice"

    def test_voice_m4a_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="rec.m4a",
        )) == "voice"

    def test_voice_webm_by_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="rec.webm",
        )) == "voice"

    # --- Unsupported ---

    def test_unsupported_video(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="video/mp4", filename="vid.mp4",
        )) is None

    def test_unsupported_zip(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="application/zip", filename="archive.zip",
        )) is None

    def test_unsupported_no_type_no_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="unknown",
        )) is None

    # --- Case insensitivity ---

    def test_case_insensitive_mime(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type="IMAGE/PNG", filename="pic.PNG",
        )) == "image"

    def test_case_insensitive_extension(self) -> None:
        assert classify_attachment(FakeAttachment(
            content_type=None, filename="pic.JPG",
        )) == "image"


class TestAttachmentRoutingConstants:
    """Verify that constants and imports used in routing are reachable."""

    def test_max_attachment_bytes_defined(self) -> None:
        from services.herobrine_api import MAX_ATTACHMENT_BYTES
        assert MAX_ATTACHMENT_BYTES == 20 * 1024 * 1024

    def test_discord_file_dataclass(self) -> None:
        from services.herobrine_api import DiscordFile
        f = DiscordFile(filename="test.txt", content_type="text/plain", content=b"hello")
        assert f.filename == "test.txt"
        assert f.content_type == "text/plain"
        assert f.content == b"hello"

    def test_ingest_functions_are_importable(self) -> None:
        from services.herobrine_api import ingest_text, ingest_image, ingest_pdf, ingest_voice
        assert callable(ingest_text)
        assert callable(ingest_image)
        assert callable(ingest_pdf)
        assert callable(ingest_voice)