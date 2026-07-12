from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def require_env(name: str) -> str:
    value = os.getenv(name)

    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")

    return value


@dataclass(frozen=True)
class Settings:
    discord_bot_token: str
    api_base_url: str
    internal_api_key: str
    supabase_url: str
    supabase_secret_key: str


settings = Settings(
    discord_bot_token=require_env("DISCORD_BOT_TOKEN"),
    api_base_url=require_env("HEROBRINE_API_BASE_URL").rstrip("/"),
    internal_api_key=require_env("HEROBRINE_INTERNAL_API_KEY"),
    supabase_url=require_env("SUPABASE_URL").rstrip("/"),
    supabase_secret_key=require_env("SUPABASE_SECRET_KEY"),
)