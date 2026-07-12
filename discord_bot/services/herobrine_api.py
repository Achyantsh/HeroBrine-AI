"""HTTP client for the HeroBrine AI internal API.

This module provides functions to call the protected internal FastAPI
endpoints for text and file ingestion.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

import aiohttp

from config import settings


class HeroBrineAPIError(RuntimeError):
    """Raised when the HeroBrine backend rejects or cannot process a request."""


@dataclass(frozen=True)
class DiscordFile:
    """An in-memory file downloaded from a Discord attachment."""

    filename: str
    content_type: str
    content: bytes


MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024
"""Maximum allowed attachment size (20 MB)."""


async def ingest_text(
    user_id: str,
    text: str,
) -> list[dict[str, Any]]:
    """Send a plain-text message to the internal Discord text endpoint."""
    url = f"{settings.api_base_url}/internal/discord/text"

    headers = {
        "X-HeroBrine-Internal-Key": settings.internal_api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "user_id": user_id,
        "text": text,
    }

    timeout = aiohttp.ClientTimeout(total=120)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(
            url,
            json=payload,
            headers=headers,
        ) as response:
            response_body = await response.text()

            if response.status >= 400:
                raise HeroBrineAPIError(
                    f"Text ingestion failed with HTTP "
                    f"{response.status}: {response_body}"
                )

            result = await response.json()

    if not isinstance(result, list):
        raise HeroBrineAPIError(
            "HeroBrine returned an unexpected response format."
        )

    return result


async def ingest_file(
    endpoint: Literal["image", "pdf", "voice"],
    user_id: str,
    uploaded_file: DiscordFile,
) -> list[dict[str, Any]]:
    """Upload a file attachment to the corresponding internal Discord endpoint.

    Parameters
    ----------
    endpoint:
        One of ``"image"``, ``"pdf"``, or ``"voice"``.
    user_id:
        The HeroBrine / Supabase user UUID resolved by the Discord bot.
    uploaded_file:
        The in-memory file to upload.

    Returns
    -------
    list[dict[str, Any]]
        The list of saved commitments returned by the backend.

    Raises
    ------
    HeroBrineAPIError
        If the backend returns a non-2xx status or an unexpected response.
    """
    url = f"{settings.api_base_url}/internal/discord/{endpoint}"

    headers = {
        "X-HeroBrine-Internal-Key": settings.internal_api_key,
    }

    timeout = aiohttp.ClientTimeout(total=180)

    form_data = aiohttp.FormData()
    form_data.add_field("user_id", user_id)
    form_data.add_field(
        "file",
        uploaded_file.content,
        filename=uploaded_file.filename,
        content_type=uploaded_file.content_type,
    )

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(
            url,
            data=form_data,
            headers=headers,
        ) as response:
            response_body = await response.text()

            if response.status >= 400:
                raise HeroBrineAPIError(
                    f"File ingestion failed for {endpoint} with HTTP "
                    f"{response.status}: {response_body}"
                )

            result = await response.json()

    if not isinstance(result, list):
        raise HeroBrineAPIError(
            "HeroBrine returned an unexpected response format."
        )

    return result


async def ingest_image(
    user_id: str,
    uploaded_file: DiscordFile,
) -> list[dict[str, Any]]:
    """Upload an image attachment for commitment extraction."""
    return await ingest_file("image", user_id, uploaded_file)


async def ingest_pdf(
    user_id: str,
    uploaded_file: DiscordFile,
) -> list[dict[str, Any]]:
    """Upload a PDF attachment for commitment extraction."""
    return await ingest_file("pdf", user_id, uploaded_file)


async def ingest_voice(
    user_id: str,
    uploaded_file: DiscordFile,
) -> list[dict[str, Any]]:
    """Upload a voice/audio attachment for commitment extraction."""
    return await ingest_file("voice", user_id, uploaded_file)