import logging

from telegram import Update, BotCommand
from telegram.ext import MessageHandler, filters, Application, ContextTypes

from defined_commands import coin_price, add as add_defined_commands, commands, send_reply

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


async def configure_commands(application: Application) -> None:
    add_defined_commands(application)
    echo_unknown_message(application)
    try_to_handle_nonstandard_command(application)
    application.add_error_handler(error_handler)
    await application.bot.set_my_commands(list(map(lambda e: BotCommand('/' + e[0], e[2]), commands)))


def echo_unknown_message(dispatcher):
    dispatcher.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))


def try_to_handle_nonstandard_command(dispatcher):
    dispatcher.add_handler(MessageHandler(filters.COMMAND, handle_nonstandard_command))


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error(msg="Exception while handling an update:", exc_info=context.error)
    try:
        await send_reply(update, context, 'Sorry, something went wrong with me.')
    except Exception as e:
        logger.error(f"Failed to send error message: {e}")


async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.channel_post:
        return

    message = update.effective_message
    if message and message.text:
        await send_reply(update, context, message.text)
    else:
        logger.warning("Echo called but no text message found")


async def handle_nonstandard_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    message = update.effective_message
    if not message or not message.text:
        logger.warning("handle_nonstandard_command called but no text message found")
        return

    text = message.text

    # Extract command name (remove leading slash and any arguments)
    command_name = text.split()[0][1:] if text.startswith('/') else text.split()[0]

    known_commands = {cmd[0]: cmd[1] for cmd in commands}

    if command_name in known_commands:
        logger.info(f"Handling known command '{command_name}' that fell through to MessageHandler")
        await known_commands[command_name](update, context)
        return

    logger.info("Trying to handle non-standard command-{0}".format(text))

    if "/price@" in text:
        context.args = [str(text.replace("/price@", ""))]
        await coin_price(update, context)
        return

    await send_reply(update, context, text)
