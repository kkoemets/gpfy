#!/usr/bin/env python
# pylint: disable=C0116

from telegram.ext import Updater

from configuration import TELEGRAM_TOKEN
from configure_commands import configure_commands


def main() -> None:
    updater = Updater(TELEGRAM_TOKEN)

    dispatcher = updater.dispatcher

    configure_commands(dispatcher)

    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    main()
