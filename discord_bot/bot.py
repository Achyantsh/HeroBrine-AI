from __future__ import annotations

import logging

import discord

from config import settings
from handlers.message_handler import handle_herobrine_message

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger("herobrine-discord-bot")

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

client = discord.Client(intents=intents)


@client.event
async def on_ready() -> None:
    if client.user is None:
        logger.error("Connected to Discord without a bot user.")
        return

    logger.info(
        "HeroBrine logged in as %s with user ID %s",
        client.user,
        client.user.id,
    )


@client.event
async def on_message(
    message: discord.Message,
) -> None:
    if client.user is None:
        return

    if message.author.bot:
        return

    # Only direct bot-user mentions are accepted.
    # Role mentions such as <@&role_id> are intentionally ignored.
    if client.user not in message.mentions:
        return

    await handle_herobrine_message(
        message=message,
        bot_user=client.user,
    )


if __name__ == "__main__":
    client.run(settings.discord_bot_token)