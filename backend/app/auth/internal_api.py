"""Internal API-key authentication for trusted service-to-service calls.

This module provides a FastAPI dependency that validates a shared secret
header for internal (non-public) endpoints.  It uses constant-time
comparison to prevent timing side-channel attacks.
"""

from __future__ import annotations

import hmac
import os

from dotenv import load_dotenv
from fastapi import Header, HTTPException

load_dotenv()

ENV_VAR = "HEROBRINE_INTERNAL_API_KEY"
HEADER_NAME = "x-herobrine-internal-key"


def _get_configured_key() -> str | None:
    """Return the configured internal API key, or *None* if unset."""
    return os.getenv(ENV_VAR)


def verify_internal_api_key(
    x_herobrine_internal_key: str | None = Header(None, alias=HEADER_NAME),
) -> None:
    """Validate the internal API key supplied in the request header.

    The caller **must** provide the ``X-HeroBrine-Internal-Key`` header
    whose value matches the ``HEROBRINE_INTERNAL_API_KEY`` environment
    variable.  Comparison is performed in constant time.

    Raises
    ------
    HTTPException
        * ``401`` — the header is missing or does not match.
        * ``500`` — the server environment variable is not configured.
    """
    configured = _get_configured_key()

    if configured is None:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: internal API key is not set.",
        )

    if x_herobrine_internal_key is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid internal API key.",
        )

    if not hmac.compare_digest(x_herobrine_internal_key, configured):
        raise HTTPException(
            status_code=401,
            detail="Invalid internal API key.",
        )