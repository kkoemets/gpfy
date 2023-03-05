import logging

from telegram import Update
from telegram.ext import MessageHandler, filters, Application, ContextTypes

from defined_commands import coin_price, add as add_defined_commands

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def configure_commands(application: Application) -> None:
    add_defined_commands(application)
    echo_unknown_message(application)
    try_to_handle_nonstandard_command(application)
    application.add_error_handler(error_handler)


def echo_unknown_message(dispatcher):
    dispatcher.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))


def try_to_handle_nonstandard_command(dispatcher):
    dispatcher.add_handler(MessageHandler(filters.COMMAND, handle_nonstandard_command))


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error(msg="Exception while handling an update:", exc_info=context.error)
    await update.message.reply_text('Sorry, something went wrong with me.')


async def echo(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(update.message.text)


async def handle_nonstandard_command(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    text = update.message.text
    logger.info("Trying to handle non-standard command-{0}".format(text))
    if "/price@" in text:
        _.args = [str(text.replace("/price@", ""))]
        await coin_price(update, _)
        return

    await update.message.reply_text(text)
