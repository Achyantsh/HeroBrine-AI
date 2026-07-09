"""AI ingestion service.

This module orchestrates text, PDF, and image ingestion into persisted commitments.
"""

from __future__ import annotations

from fastapi import Depends, UploadFile

from app.ai.extractor import CommitmentExtractor
from app.ai.gemini_client import GeminiClient
from app.ai.gemini_client import get_gemini_client
from app.ai.mapper import to_commitments
from app.parsers.image_parser import ImageParser
from app.parsers.pdf_parser import PDFParser
from app.parsers.voice_parser import VoiceParser
from app.schemas.ai import AICommitment
from app.schemas.ai import AIExtractResponse
from app.schemas.commitment import CommitmentResponse
from app.services.commitment_service import CommitmentService
from app.services.commitment_service import get_commitment_service


def get_pdf_parser() -> PDFParser:
    """Provide a PDF parser through dependency injection."""

    return PDFParser()


def get_image_parser() -> ImageParser:
    """Provide an image parser through dependency injection."""

    return ImageParser()


def get_voice_parser() -> VoiceParser:
    """Provide a voice parser through dependency injection."""

    return VoiceParser()


def get_commitment_extractor(
    client: GeminiClient = Depends(get_gemini_client),
) -> CommitmentExtractor:
    """Provide a commitment extractor through dependency injection."""

    return CommitmentExtractor(client)


class AIIngestionService:
    """Orchestrate AI extraction and commitment persistence for multiple inputs."""

    def __init__(
        self,
        pdf_parser: PDFParser,
        image_parser: ImageParser,
        voice_parser: VoiceParser,
        extractor: CommitmentExtractor,
        commitment_service: CommitmentService,
    ) -> None:
        """Initialize the service with parser, extractor, and persistence dependencies."""

        self.pdf_parser = pdf_parser
        self.image_parser = image_parser
        self.voice_parser = voice_parser
        self.extractor = extractor
        self.commitment_service = commitment_service

    def extract_text(self, text: str) -> AIExtractResponse:
        """Extract commitments from plain text without persisting them."""

        return self.extractor.extract(text)

    def ingest_text(self, text: str, user_id: str) -> list[CommitmentResponse]:
        """Extract commitments from text and persist them for the given user."""

        extracted = self.extractor.extract(text)
        return self._persist_extracted_commitments(extracted.commitments, user_id)

    def ingest_pdf(self, file: UploadFile, user_id: str) -> list[CommitmentResponse]:
        """Extract commitments from a PDF file and persist them for the given user."""

        self._validate_pdf_upload(file)
        text = self.pdf_parser.extract_text(file.file)
        return self.ingest_text(text, user_id)

    def ingest_image(self, file: UploadFile, user_id: str) -> list[CommitmentResponse]:
        """Extract commitments from an image file and persist them for the given user."""

        self._validate_image_upload(file)
        text = self.image_parser.extract_text(file.file)
        return self.ingest_text(text, user_id)

    def ingest_voice(self, file: UploadFile, user_id: str) -> list[CommitmentResponse]:
        """Extract commitments from an audio file and persist them for the given user."""

        self._validate_voice_upload(file)
        text = self.voice_parser.extract_text(file.file)
        return self.ingest_text(text, user_id)

    def _persist_extracted_commitments(
        self,
        commitments: list[AICommitment],
        user_id: str,
    ) -> list[CommitmentResponse]:
        """Convert AI commitments into ORM models and persist them for the user."""

        domain_commitments = to_commitments(commitments)
        return self.commitment_service.create_many_commitments(domain_commitments, user_id)

    @staticmethod
    def _validate_pdf_upload(file: UploadFile) -> None:
        """Validate that the uploaded file is a PDF."""

        allowed_types = {
            "application/pdf",
            "application/x-pdf",
        }

        filename = (file.filename or "").lower()
        if file.content_type not in allowed_types and not filename.endswith(
            ".pdf"
        ):
            raise ValueError("Invalid PDF file.")

    @staticmethod
    def _validate_image_upload(file: UploadFile) -> None:
        """Validate that the uploaded file is an image."""

        allowed_extensions = {
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".bmp",
        }

        filename = (file.filename or "").lower()

        if any(filename.endswith(ext) for ext in allowed_extensions):
            return

        content_type = file.content_type or ""

        if content_type.startswith("image/"):
            return

        raise ValueError("Invalid image file.")

    @staticmethod
    def _validate_voice_upload(file: UploadFile) -> None:
        """Validate that the uploaded file is an audio file."""

        allowed_extensions = {
            ".mp3",
            ".wav",
            ".m4a",
            ".ogg",
            ".flac",
        }

        filename = (file.filename or "").lower()

        if any(filename.endswith(ext) for ext in allowed_extensions):
            return

        content_type = file.content_type or ""

        if content_type.startswith("audio/"):
            return

        raise ValueError("Invalid audio file.")


def get_ai_ingestion_service(
    pdf_parser: PDFParser = Depends(get_pdf_parser),
    image_parser: ImageParser = Depends(get_image_parser),
    voice_parser: VoiceParser = Depends(get_voice_parser),
    extractor: CommitmentExtractor = Depends(get_commitment_extractor),
    commitment_service: CommitmentService = Depends(get_commitment_service),
) -> AIIngestionService:
    """Provide the unified AI ingestion service through dependency injection."""

    return AIIngestionService(
        pdf_parser=pdf_parser,
        image_parser=image_parser,
        voice_parser=voice_parser,
        extractor=extractor,
        commitment_service=commitment_service,
    )