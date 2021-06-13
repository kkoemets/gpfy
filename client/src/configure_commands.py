import logging

from telegram import Update
from telegram.ext import MessageHandler, Filters, CallbackContext

from add_defined_commands import price, add_defined_commands

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def configure_commands(dispatcher):
    add_defined_commands(dispatcher)
    echo_unknown_message(dispatcher)
    try_to_handle_nonstandard_command(dispatcher)
    dispatcher.add_error_handler(error_handler)


def echo_unknown_message(dispatcher):
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))


def try_to_handle_nonstandard_command(dispatcher):
    dispatcher.add_handler(MessageHandler(Filters.command, handle_nonstandard_command))


def error_handler(update: Update, context: CallbackContext) -> None:
    logger.error(msg="Exception while handling an update:", exc_info=context.error)
    update.message.reply_text('Sorry, something went wrong with me.')


def echo(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(update.message.text)


def handle_nonstandard_command(update: Update, _: CallbackContext) -> None:
    text = update.message.text
    logger.info("Trying to handle non-standard command-{0}".format(text))
    if "/price@" in text:
        _.args = [str(text.replace("/price@", ""))]
        price(update, _)
        return

    update.message.reply_text(text)
