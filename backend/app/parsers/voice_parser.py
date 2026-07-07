"""Voice transcription utilities.

This module provides speech-to-text parsing for uploaded audio files.
"""

from __future__ import annotations

import os
import tempfile
from functools import lru_cache
from typing import BinaryIO

from faster_whisper import WhisperModel


@lru_cache(maxsize=1)
def _get_whisper_model(model_size: str = "base") -> WhisperModel:
    """Return a singleton Whisper model instance.

    Args:
        model_size: Name of the Whisper model size.

    Returns:
        A cached ``WhisperModel`` instance.
    """

    return WhisperModel(
    model_size,
    device="cpu",
    compute_type="int8",
    )


class VoiceParser:
    """Extract plain text from audio files using Faster-Whisper."""

    def __init__(self, model_size: str = "base") -> None:
        """Initialize the parser with a singleton Whisper model.

        Args:
            model_size: Whisper model size to load. Defaults to ``"base"``.
        """

        self.model = _get_whisper_model(model_size)

    def extract_text(self, file: BinaryIO) -> str:
        """Transcribe speech from an uploaded audio stream.

        The input stream is copied to a temporary file before transcription.
        The temporary file is always removed, even when transcription fails.

        Args:
            file: Binary file-like object containing audio data.

        Returns:
            The transcribed text.

        Raises:
            ValueError: If no speech is detected in the audio.
        """

        temp_path = self._write_temp_audio(file)

        try:
            segments, _ = self.model.transcribe(temp_path)
            texts: list[str] = []

            for segment in segments:
                segment_text = segment.text.strip()
                if segment_text:
                    texts.append(segment_text)

            if not texts:
                raise ValueError("No speech detected in audio.")

            return " ".join(texts)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @staticmethod
    def _write_temp_audio(file: BinaryIO) -> str:
        """Persist uploaded audio to a temporary file and return its path.

        Args:
            file: Binary file-like object containing audio data.

        Returns:
            Absolute path to the temporary audio file.
        """

        if hasattr(file, "seek"):
            file.seek(0)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".tmp") as temp_file:
            data = file.read()
            temp_file.write(data)
            return temp_file.name