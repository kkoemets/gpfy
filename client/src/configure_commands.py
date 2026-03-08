import logging

from telegram import Update
from telegram.ext import MessageHandler, filters, Application, ContextTypes

from command_handlers import get_command_registry, send_reply
from command_messages import render_unknown_command_message

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


async def configure_commands(application: Application) -> None:
    registry = get_command_registry()
    registry.add_handlers(application)
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    application.add_handler(MessageHandler(filters.COMMAND, handle_fallback_command))
    application.add_error_handler(error_handler)
    await application.bot.set_my_commands(registry.telegram_commands())


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error(msg='Exception while handling an update:', exc_info=context.error)
    try:
        await send_reply(update, context, 'Sorry, something went wrong with me.')
    except Exception as exc:
        logger.error(f'Failed to send error message: {exc}')


async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.channel_post:
        return

    message = update.effective_message
    if message and message.text:
        await send_reply(update, context, message.text)
    else:
        logger.warning('Echo called but no text message found')


async def handle_fallback_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    registry = get_command_registry()
    if await registry.dispatch_fallback_command(update, context):
        return

    message = update.effective_message
    if not message or not message.text:
        logger.warning('handle_fallback_command called but no text message found')
        return

    parsed_command = registry.parse_command_text(message.text, getattr(context.bot, 'username', None))
    command_name = parsed_command.name if parsed_command else message.text.lstrip('/').split()[0]
    await send_reply(update, context, render_unknown_command_message(command_name))
