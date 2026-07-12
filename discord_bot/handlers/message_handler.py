"""Discord message handler for the HeroBrine bot.

This module handles direct bot mentions, resolves linked Discord accounts,
and routes text or file attachments to the appropriate ingestion endpoint.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Literal

import discord

from services.herobrine_api import (
    HeroBrineAPIError,
    MAX_ATTACHMENT_BYTES,
    DiscordFile,
    ingest_image,
    ingest_pdf,
    ingest_text,
    ingest_voice,
)
from services.profile_lookup import (
    ProfileLookupError,
    get_herobrine_user_id,
)

logger = logging.getLogger(__name__)

AttachmentType = Literal["image", "pdf", "voice"]


# ---------------------------------------------------------------------------
# Supported MIME types and file extensions
# ---------------------------------------------------------------------------

_IMAGE_MIMES = frozenset({
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
})

_IMAGE_EXTENSIONS = frozenset({
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
})

_PDF_MIMES = frozenset({
    "application/pdf",
})

_PDF_EXTENSIONS = frozenset({
    ".pdf",
})

_VOICE_MIMES = frozenset({
    "audio/ogg",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/m4a",
    "audio/webm",
})

_VOICE_EXTENSIONS = frozenset({
    ".ogg",
    ".mp3",
    ".wav",
    ".m4a",
    ".webm",
})


def classify_attachment(attachment: discord.Attachment) -> AttachmentType | None:
    """Determine the ingestion endpoint for a Discord attachment.

    Classification order:
        1. Discord voice-message flag.
        2. Normalised MIME type.
        3. Normalised filename extension fallback.

    Returns
    -------
    ``"image"``, ``"pdf"``, ``"voice"``, or ``None`` for unsupported types.
    """
    # 1. Discord voice-message flag
    if getattr(attachment, "is_voice_message", lambda: False)():
        return "voice"

    content_type = (attachment.content_type or "").lower()
    filename = (attachment.filename or "").lower()

    # 2. MIME type check
    if content_type in _IMAGE_MIMES:
        return "image"

    if content_type in _PDF_MIMES:
        return "pdf"

    if content_type in _VOICE_MIMES:
        return "voice"

    # 3. Extension fallback
    if any(filename.endswith(ext) for ext in _IMAGE_EXTENSIONS):
        return "image"

    if any(filename.endswith(ext) for ext in _PDF_EXTENSIONS):
        return "pdf"

    if any(filename.endswith(ext) for ext in _VOICE_EXTENSIONS):
        return "voice"

    return None


# ---------------------------------------------------------------------------
# Text utilities
# ---------------------------------------------------------------------------


def remove_bot_mention(
    content: str,
    bot_user_id: int,
) -> str:
    """Remove ``<@id>`` or ``<@!id>`` from the incoming Discord message."""
    mention_pattern = rf"<@!?{bot_user_id}>"
    return re.sub(mention_pattern, "", content).strip()


# ---------------------------------------------------------------------------
# Response formatters
# ---------------------------------------------------------------------------


def format_commitment(
    commitment: dict[str, Any],
) -> str:
    """Format a single commitment dict for a Discord reply."""
    title = commitment.get("title") or "Untitled commitment"
    deadline = commitment.get("deadline")
    priority = commitment.get("priority")

    line = f"• **{title}**"

    details: list[str] = []

    if priority:
        details.append(str(priority).capitalize())

    if deadline:
        details.append(str(deadline))

    if details:
        line += f"\n  {' · '.join(details)}"

    return line


def format_success_message(
    commitments: list[dict[str, Any]],
) -> str:
    """Format a list of saved commitments for a Discord reply."""
    count = len(commitments)

    if count == 0:
        return (
            "I processed the message, but could not find a clear "
            "commitment to save."
        )

    lines = [
        f"✅ Saved {count} commitment{'s' if count != 1 else ''}."
    ]

    for commitment in commitments[:5]:
        lines.append(format_commitment(commitment))

    if count > 5:
        lines.append(f"• …and {count - 5} more")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# User-facing error messages
# ---------------------------------------------------------------------------

_ERROR_MESSAGES: dict[str, str] = {
    "profile_lookup": (
        "I could not verify your linked HeroBrine account right now."
    ),
    "download": (
        "I could not download that attachment from Discord."
    ),
    "too_large": (
        "That file is too large. HeroBrine currently supports "
        "attachments up to 20 MB."
    ),
    "unsupported_type": (
        "Unsupported file type. HeroBrine currently supports "
        "images, PDFs, and voice files."
    ),
    "multiple_attachments": (
        "Please send one attachment at a time."
    ),
    "backend_error": (
        "HeroBrine could not process that attachment. Please try again."
    ),
    "unexpected": (
        "An unexpected error occurred while processing the attachment."
    ),
}


# ---------------------------------------------------------------------------
# Main handler
# ---------------------------------------------------------------------------


async def handle_herobrine_message(
    message: discord.Message,
    bot_user: discord.ClientUser,
) -> None:
    """Process a direct bot mention.

    This is the single entry point from ``bot.py``.
    It resolves the Discord user to a HeroBrine user UUID and then routes
    the request to the appropriate ingestion endpoint.
    """
    try:
        discord_user_id = message.author.id

        logger.info(
            "Processing Discord message %s from user %s",
            message.id,
            discord_user_id,
        )

        hero_user_id = await get_herobrine_user_id(discord_user_id)

        if hero_user_id is None:
            await message.reply(
                "Your Discord account is not linked to HeroBrine. "
                "Open your HeroBrine profile and connect Discord first.",
                mention_author=False,
            )
            return

        # ----- Attachment handling -----------------------------------------

        attachments = message.attachments

        if len(attachments) > 1:
            await message.reply(
                _ERROR_MESSAGES["multiple_attachments"],
                mention_author=False,
            )
            return

        if len(attachments) == 1:
            await _handle_attachment(message, hero_user_id, attachments[0])
            return

        # ----- Text-only path -----------------------------------------------

        text = remove_bot_mention(
            message.content,
            bot_user.id,
        )

        if not text:
            await message.reply(
                "Mention me with a commitment, for example:\n"
                "`@HeroBrine Submit the assignment tomorrow at 8 PM`",
                mention_author=False,
            )
            return

        async with message.channel.typing():
            commitments = await ingest_text(
                user_id=hero_user_id,
                text=text,
            )

        await message.reply(
            format_success_message(commitments),
            mention_author=False,
        )

    except ProfileLookupError:
        logger.exception(
            "Supabase profile lookup failed for Discord user %s",
            message.author.id,
        )
        await message.reply(
            _ERROR_MESSAGES["profile_lookup"],
            mention_author=False,
        )

    except HeroBrineAPIError:
        logger.exception(
            "HeroBrine API ingestion failed for Discord user %s",
            message.author.id,
        )
        await message.reply(
            "HeroBrine could not process that commitment. "
            "Please try again in a moment.",
            mention_author=False,
        )

    except Exception:
        logger.exception(
            "Unexpected Discord message processing failure."
        )
        await message.reply(
            "An unexpected error occurred while processing the message.",
            mention_author=False,
        )


async def _handle_attachment(
    message: discord.Message,
    hero_user_id: str,
    attachment: discord.Attachment,
) -> None:
    """Download, classify, and route a single attachment for ingestion."""
    attachment_type = classify_attachment(attachment)

    if attachment_type is None:
        await message.reply(
            _ERROR_MESSAGES["unsupported_type"],
            mention_author=False,
        )
        return

    # Check size before downloading
    if attachment.size > MAX_ATTACHMENT_BYTES:
        await message.reply(
            _ERROR_MESSAGES["too_large"],
            mention_author=False,
        )
        return

    # Download
    try:
        raw_bytes = await attachment.read()
    except Exception:
        logger.exception(
            "Failed to download attachment %s (size %s) for user %s",
            attachment.id,
            attachment.size,
            message.author.id,
        )
        await message.reply(
            _ERROR_MESSAGES["download"],
            mention_author=False,
        )
        return

    logger.info(
        "Processing attachment: msg=%s user=%s endpoint=%s "
        "filename=%s size=%s",
        message.id,
        message.author.id,
        attachment_type,
        attachment.filename,
        attachment.size,
    )

    discord_file = DiscordFile(
        filename=attachment.filename or "unknown",
        content_type=attachment.content_type or "application/octet-stream",
        content=raw_bytes,
    )

    # Map attachment type to ingestion function
    _INGEST_MAP: dict[AttachmentType, Any] = {
        "image": ingest_image,
        "pdf": ingest_pdf,
        "voice": ingest_voice,
    }

    ingest_fn = _INGEST_MAP[attachment_type]

    try:
        async with message.channel.typing():
            commitments = await ingest_fn(
                user_id=hero_user_id,
                uploaded_file=discord_file,
            )

        await message.reply(
            format_success_message(commitments),
            mention_author=False,
        )
    except HeroBrineAPIError:
        logger.exception(
            "Backend ingestion failed for attachment %s (%s) user %s",
            attachment.id,
            attachment_type,
            message.author.id,
        )
        await message.reply(
            _ERROR_MESSAGES["backend_error"],
            mention_author=False,
        )