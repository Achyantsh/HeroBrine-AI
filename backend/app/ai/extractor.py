"""Commitment extraction helpers.

This module coordinates prompt building, Gemini generation, and JSON parsing.
"""

from __future__ import annotations

import json

from app.ai.gemini_client import GeminiClient
from app.ai.prompt_builder import build_commitment_prompt
from app.schemas.ai import AIExtractResponse
from pydantic import ValidationError


class CommitmentExtractor:
    """Extract commitments from text using a Gemini client."""

    def __init__(self, client: GeminiClient) -> None:
        """Initialize the extractor with a Gemini client instance."""

        self.client = client

    def extract(self, text: str) -> AIExtractResponse:
        """Extract and validate commitments from raw text."""

        prompt = build_commitment_prompt(text)
        response_text = self.client.generate_text(prompt)

        print("=" * 80)
        print("RAW GEMINI RESPONSE")
        print(response_text)
        print("=" * 80)
        response_text = response_text.strip()

        if response_text.startswith("```"):
            response_text = (
                response_text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        try:
            parsed_response = json.loads(response_text)
        except json.JSONDecodeError as exc:
            raise ValueError("Gemini returned invalid JSON") from exc

        try:
            return AIExtractResponse.model_validate(parsed_response)
        except ValidationError as exc:
            print(exc)
            raise ValueError(str(exc)) from exc
