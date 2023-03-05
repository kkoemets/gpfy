#!/usr/bin/env python
# pylint: disable=C0116

from telegram.ext import Application

from configuration import TELEGRAM_TOKEN
from configure_commands import configure_commands


def main() -> None:
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    configure_commands(application)

    application.run_polling()


if __name__ == '__main__':
    main()
