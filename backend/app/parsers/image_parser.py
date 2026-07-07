"""Image text extraction utilities.

This module provides OCR functionality for uploaded image files.
"""

from __future__ import annotations

from typing import BinaryIO

from PIL import Image, ImageOps
import pytesseract

from app.core.config import settings


class ImageParser:
    """Extract plain text from image files using Tesseract OCR."""

    def __init__(self) -> None:
        """Configure the Tesseract executable."""

        pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    def extract_text(self, file: BinaryIO) -> str:
        """Extract readable text from an uploaded image."""

        image = Image.open(file)

        # Convert to grayscale
        image = image.convert("L")

        # Increase contrast
        image = ImageOps.autocontrast(image)

        # Enlarge image for OCR
        image = image.resize(
        (image.width * 3, image.height * 3)
        )

        custom_config = "--oem 3 --psm 6"

        text = pytesseract.image_to_string(
            image,
            config=custom_config,
            ).strip()
        if not text:
          raise ValueError("Unable to extract text from image.")

        return text