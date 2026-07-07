"""Gemini client wrapper.

This module owns Gemini SDK initialization and text generation.
"""

from __future__ import annotations

from functools import lru_cache

import google.generativeai as genai

from app.core.config import settings


class GeminiClient:
    """Wrapper around the Google Gemini SDK."""

    def __init__(
        self,
        api_key: str | None = None,
        model_name: str | None = None,
    ) -> None:
        """Initialize the Gemini client using application settings."""

        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL

        genai.configure(api_key=self.api_key)

        self._model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config={
                "temperature": 0.1,
                "top_p": 0.9,
                "max_output_tokens": 2048,
            },
        )

    def generate_text(self, prompt: str) -> str:
        """Generate text from Gemini."""

        try:
            response = self._model.generate_content(prompt)

            text = getattr(response, "text", None)
            if text:
                return text.strip()

            return self._extract_text_from_response(response)

        except Exception as exc:
            raise RuntimeError(
                f"Gemini generation failed: {exc}"
            ) from exc

    @staticmethod
    def _extract_text_from_response(response: object) -> str:
        """Extract text when response.text is unavailable."""

        chunks: list[str] = []

        candidates = getattr(response, "candidates", None) or []

        for candidate in candidates:
            content = getattr(candidate, "content", None)

            if content is None:
                continue

            parts = getattr(content, "parts", None) or []

            for part in parts:
                part_text = getattr(part, "text", None)

                if part_text:
                    chunks.append(part_text)

        return "".join(chunks).strip()


@lru_cache(maxsize=1)
def get_gemini_client() -> GeminiClient:
    """Return a cached Gemini client instance."""

    return GeminiClient()