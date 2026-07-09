from __future__ import annotations

import os
from functools import lru_cache

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from jwt.exceptions import InvalidTokenError

load_dotenv()

security = HTTPBearer()

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
ISSUER = f"{SUPABASE_URL}/auth/v1"


@lru_cache(maxsize=1)
def _get_jwks_client() -> PyJWKClient:
    """Return a cached PyJWKClient that fetches JWKS on first call."""

    return PyJWKClient(JWKS_URL, cache_keys=True)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Verify a Supabase ES256 JWT via JWKS and return the decoded payload.

    The returned dict contains the Supabase user claims including ``sub``,
    which is the user UUID used throughout the application for user isolation.
    """

    token = credentials.credentials

    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
            issuer=ISSUER,
            options={
                "require": ["sub", "exp", "iat"],
            },
        )

        return payload

    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication token: {exc}",
        ) from exc