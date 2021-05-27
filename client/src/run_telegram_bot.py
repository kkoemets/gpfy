#!/usr/bin/env python
# pylint: disable=C0116

from telegram.ext import Updater

from com.gpfy.telegram.configure_commands import configure_commands
from configuration import telegram_token


def main() -> None:
    updater = Updater(telegram_token)

    dispatcher = updater.dispatcher

    configure_commands(dispatcher)

    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    main()
