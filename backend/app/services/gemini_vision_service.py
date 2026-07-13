from __future__ import annotations

from google import genai
from google.genai import types

from app.ai.prompt_builder import (
    build_image_commitment_prompt,
)
from app.core.config import settings
from app.parsers.image_parser import ParsedImage
from app.schemas.ai_extraction import (
    CommitmentExtractionResponse,
)


class GeminiVisionService:
    def __init__(self) -> None:
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY.strip()
        )

    def extract_commitments(
        self,
        image: ParsedImage,
    ) -> CommitmentExtractionResponse:
        response = self.client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=[
                types.Part.from_bytes(
                    data=image.content,
                    mime_type=image.mime_type,
                ),
                build_image_commitment_prompt(),
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json",
                response_schema=CommitmentExtractionResponse,
            ),
        )

        if response.parsed is not None:
            return CommitmentExtractionResponse.model_validate(
                response.parsed
            )

        if not response.text:
            raise ValueError(
                "Gemini returned an empty image response."
            )

        return CommitmentExtractionResponse.model_validate_json(
            response.text
        )