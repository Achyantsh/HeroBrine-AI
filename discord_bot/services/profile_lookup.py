from __future__ import annotations

from urllib.parse import quote

import aiohttp

from config import settings


class ProfileLookupError(RuntimeError):
    """Raised when the Supabase profile lookup fails."""


async def get_herobrine_user_id(discord_user_id: int) -> str | None:
    discord_id = str(discord_user_id)

    url = (
        f"{settings.supabase_url}/rest/v1/profiles"
        f"?select=id"
        f"&discord_id=eq.{quote(discord_id, safe='')}"
        f"&limit=1"
    )

    headers = {
        "apikey": settings.supabase_secret_key,
        "Authorization": f"Bearer {settings.supabase_secret_key}",
        "Accept": "application/json",
    }

    timeout = aiohttp.ClientTimeout(total=10)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url, headers=headers) as response:
            response_body = await response.text()

            if response.status >= 400:
                raise ProfileLookupError(
                    f"Profile lookup failed with HTTP "
                    f"{response.status}: {response_body}"
                )

            rows = await response.json()

    if not rows:
        return None

    user_id = rows[0].get("id")

    if not isinstance(user_id, str) or not user_id:
        raise ProfileLookupError(
            "Supabase returned a profile without a valid id."
        )

    return user_id