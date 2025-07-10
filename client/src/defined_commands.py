import base64
import functools
import logging
from io import BytesIO
from typing import Any

from telegram import Update, ForceReply
from telegram._utils.types import JSONDict
from telegram.ext import ContextTypes, CommandHandler, Application

import bag_service
import crypto_data_client
import user_service
from botutil import extract_message_text

users = user_service.UserService()
crypto_data = crypto_data_client.CryptoDataClient()
bags = bag_service.BagService(users, crypto_data)

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)


def add(application: Application) -> None:
    for command in commands:
        application.add_handler(CommandHandler(command[0], command[1]))


def _add_user(func) -> Any:
    async def wrapper(*args, **kwargs):
        logger.info('Adding user')
        update = args[0]

        user_data = extract_current_request_data_from_update(update)
        if user_data:
            users.add_new_user(user_data)
        else:
            logger.warning("Could not extract user data from update")

        return await func(*args, **kwargs)

    return wrapper


def _update_command_calls(func) -> Any:
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        callback = args[1]
        logger.info(f'arguments-{callback.args}')
        await func(*args, **kwargs)
        update = args[0]

        message_text = extract_message_text(update)

        if message_text:
            users.update_command_calls(extract_current_request_data_from_update(update), message_text)

        return None

    return wrapper


@_add_user
@_update_command_calls
async def _start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    await send_reply_markdown_v2(
        update, context,
        fr'Hi, {user.mention_markdown_v2()}\! I am here to help you with your crypto needs\. Type /help to see what I can do\.',
        reply_markup=ForceReply(selective=True),
    )


@_add_user
@_update_command_calls
async def _send_market_cap(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, context, await crypto_data.get_mcap_summary())


@_add_user
@_update_command_calls
async def _send_cummies(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, context, await crypto_data.get_coin_summary('cumrocket'))


@_add_user
@_update_command_calls
async def coin_price(update: Update, cb: ContextTypes.DEFAULT_TYPE) -> None:
    words_in_text = cb.args
    if len(words_in_text) != 1:
        logger.info("Too many args")
        return

    await send_reply(update, cb, await crypto_data.get_coin_summary(words_in_text.pop()))


@_add_user
@_update_command_calls
async def _send_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, context,
                     '\n'.join(list(map(lambda command: '/' + command[0] + ' : ' + command[2], commands))))


@_add_user
@_update_command_calls
async def _send_two_year_chart(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_photo(update, context, photo=BytesIO(base64.b64decode(
        await crypto_data.get_2_year_avg_chart())))


@_add_user
@_update_command_calls
async def _send_rainbow_chart(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_photo(update, context, photo=BytesIO(base64.b64decode(
        await crypto_data.get_rainbow_chart())))


@_add_user
@_update_command_calls
async def _send_trending(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, context, await crypto_data.get_trending_coins())


@_add_user
@_update_command_calls
async def _add_coin_to_bag(update: Update, cb: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, cb, await bags.add_coin(extract_current_request_data_from_update(update), cb, update))


@_add_user
@_update_command_calls
async def _remove_coin_from_bag(update: Update, cb: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, cb,
                     await bags.remove_from_bag(extract_current_request_data_from_update(update), cb, update))


@_add_user
@_update_command_calls
async def _send_bag_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await send_reply(update, context, await bags.get_bag_data(extract_current_request_data_from_update(update)))


@_add_user
async def _send_last_ten_commands(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    last_commands = users.get_last_ten_commands(extract_current_request_data_from_update(update))
    if len(last_commands) < 1:
        await send_reply(update, context, "Sorry, did not find your command history!\nTry using /help")
    else:
        last_commands.insert(0, 'Your last 10 commands🧐')
        await send_reply(update, context, "\n".join(last_commands))


def extract_current_request_data_from_update(update: Update) -> JSONDict:
    if update.message and update.message.from_user:
        return update.message.from_user.to_dict()
    elif update.channel_post and update.channel_post.chat:
        chat = update.channel_post.chat
        return {
            'id': chat.id,
            'is_bot': False,
            'first_name': chat.username,
            'debug-type': 'channel-post'
        }
    elif update.effective_user:
        return update.effective_user.to_dict()
    else:
        logger.info(f"Update without user data, using fallback user. Update type: {type(update).__name__}")
        return {'id': -1, 'is_bot': False, 'first_name': 'devnull', 'debug-type': 'error'}


async def send_reply(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str, **kwargs) -> None:
    if update.message:
        await update.message.reply_text(text, **kwargs)
    elif update.channel_post:
        await context.bot.send_message(chat_id=update.effective_chat.id, text=text, **kwargs)
    elif update.effective_chat and update.effective_message:
        await context.bot.send_message(chat_id=update.effective_chat.id, text=text, **kwargs)
    else:
        logger.error(f"Could not send reply - no valid message or chat found in update: {update}")
        raise ValueError("No valid message or chat found in update")


async def send_reply_markdown_v2(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str, **kwargs) -> None:
    if update.message:
        await update.message.reply_markdown_v2(text, **kwargs)
    else:
        await send_reply(update, context, text, **kwargs)


async def send_photo(update: Update, context: ContextTypes.DEFAULT_TYPE, photo, **kwargs) -> None:
    chat_id = update.effective_chat.id if update.effective_chat else None
    if not chat_id:
        logger.error(f"Could not send photo - no valid chat found in update: {update}")
        raise ValueError("No valid chat found in update")

    await context.bot.send_photo(chat_id=chat_id, photo=photo, **kwargs)


commands = [
    ("start", _start, "Start conversation"),
    ("help", _send_help, "List commands"),
    ("cummies", _send_cummies, "Show summary for $CUMMIES"),
    ("price", coin_price, "Show summary for a coin, e.g. ´/price@bitcoin´"),
    ("mcap", _send_market_cap, "Show CMC summary"),
    ("last10", _send_last_ten_commands, "Show last ten used commands"),
    ("2year", _send_two_year_chart, "Show btc 2-Year MA Multiplier"),
    ("rainbow", _send_rainbow_chart, "Show btc rainbow graph"),
    ("trending", _send_trending, "Show trending coins"),
    ("bag_add", _add_coin_to_bag, "Add a coin to the bag, e.g. ´/bag_add bitcoin 0.001´"),
    ("bag_remove", _remove_coin_from_bag, "Remove a coin from the bag, e.g. ´/bag_remove bitcoin`"),
    ("bag_show", _send_bag_data, "Show off your bag")
]
