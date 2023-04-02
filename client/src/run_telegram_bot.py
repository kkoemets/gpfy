#!/usr/bin/env python
# pylint: disable=C0116
from telegram.ext import Application, ApplicationBuilder, AIORateLimiter

from configuration import TELEGRAM_TOKEN
from configure_commands import configure_commands


def main() -> None:
    (
        ApplicationBuilder()
        .token(TELEGRAM_TOKEN)
        .concurrent_updates(True)
        .rate_limiter(AIORateLimiter(max_retries=10))
        .post_init(post_init)
        .build()
    ).run_polling()


async def post_init(application: Application):
    await configure_commands(application)


if __name__ == '__main__':
    main()
