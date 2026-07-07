"""Application configuration.

This module loads environment-driven settings for the backend service.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = Field(
        ..., description="SQLAlchemy database connection URL."
    )

    APP_ENV: str = Field(
        default="development",
        description="Application environment name.",
    )

    DEBUG: bool = Field(
        default=False,
        description="Enable debug mode locally.",
    )

    GEMINI_API_KEY: str = Field(
        ...,
        description="Google Gemini API key.",
    )

    GEMINI_MODEL: str = Field(
        default="gemini-2.5-flash",
        description="Default Gemini model.",
    )
    TESSERACT_CMD: str = Field(
    ...,
    description="Path to the Tesseract OCR executable.",
    )


# Singleton settings object used across the backend.
settings = Settings()