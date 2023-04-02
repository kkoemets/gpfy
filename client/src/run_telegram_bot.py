#!/usr/bin/env python
# pylint: disable=C0116
from telegram import BotCommand
from telegram.ext import Application, ApplicationBuilder, AIORateLimiter

from configuration import TELEGRAM_TOKEN
from configure_commands import configure_commands
from src.defined_commands import commands


def main() -> None:
    application = (
        ApplicationBuilder()
        .token(TELEGRAM_TOKEN)
        .concurrent_updates(True)
        .rate_limiter(AIORateLimiter(max_retries=10))
        .post_init(post_init)
        .build()
    )

    configure_commands(application)

    application.run_polling()


async def post_init(application: Application):
    await application.bot.set_my_commands(list(map(lambda e: BotCommand('/' + e[0], e[2]), commands)))


if __name__ == '__main__':
    main()
