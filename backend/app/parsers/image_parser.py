from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
from typing import BinaryIO

from PIL import Image, UnidentifiedImageError


SUPPORTED_IMAGE_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
}

MAX_IMAGE_BYTES = 20 * 1024 * 1024


@dataclass(frozen=True)
class ParsedImage:
    content: bytes
    mime_type: str


class ImageParser:
    def parse(
        self,
        file: BinaryIO,
        content_type: str | None = None,
    ) -> ParsedImage:
        raw = file.read()

        if not raw:
            raise ValueError("Uploaded image is empty.")

        if len(raw) > MAX_IMAGE_BYTES:
            raise ValueError(
                "Image exceeds the 20 MB limit."
            )

        try:
            image = Image.open(BytesIO(raw))
            image.verify()
        except UnidentifiedImageError as exc:
            raise ValueError(
                "Uploaded file is not a valid image."
            ) from exc

        detected_format = image.format

        mime_type = self._resolve_mime_type(
            content_type=content_type,
            detected_format=detected_format,
        )

        return ParsedImage(
            content=raw,
            mime_type=mime_type,
        )

    @staticmethod
    def _resolve_mime_type(
        content_type: str | None,
        detected_format: str | None,
    ) -> str:
        normalized = (content_type or "").lower()

        if normalized in SUPPORTED_IMAGE_TYPES:
            return normalized

        format_mapping = {
            "PNG": "image/png",
            "JPEG": "image/jpeg",
            "WEBP": "image/webp",
        }

        mime_type = format_mapping.get(
            detected_format or ""
        )

        if not mime_type:
            raise ValueError(
                "Unsupported image format. Use PNG, JPEG, or WebP."
            )

        return mime_type