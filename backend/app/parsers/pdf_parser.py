"""PDF text extraction utilities.

This module provides a single-purpose parser for extracting plain text from PDF files.
"""

from __future__ import annotations

from typing import BinaryIO

from pypdf import PdfReader


class PDFParser:
    """Extract plain text from PDF files page by page."""

    def extract_text(self, file: BinaryIO) -> str:
        """Extract readable text from a PDF file stream.

        Pages are processed in order and page text is joined with newline separators.
        Pages without text are ignored.
        """
        try:
            reader = PdfReader(file)
            page_texts: list[str] = []
    
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    cleaned_text = text.strip()
                    if cleaned_text:
                         page_texts.append(cleaned_text)

            if not page_texts:
                 raise ValueError("Unable to extract text from PDF.")

            return "\n".join(page_texts)
        except ValueError:
            raise

        except Exception as exc:
             raise ValueError("Unable to extract text from PDF.") from exc