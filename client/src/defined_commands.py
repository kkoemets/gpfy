import base64
import functools
import logging
from io import BytesIO
from typing import Any

from telegram import Update, ForceReply
from telegram.ext import CallbackContext, CommandHandler
from telegram.utils.types import JSONDict

import bag_service
import crypto_data_client
import user_service

users = user_service.UserService()
crypto_data = crypto_data_client.CryptoDataClient()
bags = bag_service.BagService(users, crypto_data)

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)


def add(dispatcher) -> None:
    """
    Add all the defined commands to the dispatcher
    :param dispatcher:
    """
    for command in commands:
        dispatcher.add_handler(CommandHandler(command[0], command[1]))


def _add_user(func) -> Any:
    def wrapper(*args, **kwargs):
        logger.info('Adding user')
        users.add_new_user(args[0].message.from_user.to_dict())
        return func(*args, **kwargs)

    return wrapper


def _update_command_calls(func) -> Any:
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        callback = args[1]
        logger.info(f'arguments-{callback.args}')
        func(*args, **kwargs)
        update = args[0]
        users.update_command_calls(extract_current_request_data_from_update(update), update.message.text)
        return None

    return wrapper


@_add_user
@_update_command_calls
def _start(update: Update, _: CallbackContext) -> None:
    user = update.effective_user
    update.message.reply_markdown_v2(
        fr'Hi, {user.mention_markdown_v2()}\! I am here to help you with your crypto needs\. Type /help to see what I can do\.',
        reply_markup=ForceReply(selective=True),
    )


@_add_user
@_update_command_calls
def _send_market_cap(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(crypto_data.get_mcap_summary())


@_add_user
@_update_command_calls
def _send_cummies(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(crypto_data.get_coin_summary('cumrocket'))


@_add_user
@_update_command_calls
def coin_price(update: Update, cb: CallbackContext) -> None:
    words_in_text = cb.args
    if len(words_in_text) != 1:
        logger.info("Too many args")
        return

    update.message.reply_text(crypto_data.get_coin_summary(words_in_text.pop()))


@_add_user
@_update_command_calls
def _send_help(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(
        '\n'.join(list(map(lambda command: '/' + command[0] + ' : ' + command[2], commands))))


@_add_user
@_update_command_calls
def _send_two_year_chart(update: Update, context: CallbackContext) -> None:
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        crypto_data.get_2_year_avg_chart())))


@_add_user
@_update_command_calls
def _send_rainbow_chart(update: Update, context: CallbackContext) -> None:
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        crypto_data.get_rainbow_chart())))


@_add_user
@_update_command_calls
def _send_trending(update: Update, _) -> None:
    update.message.reply_text(crypto_data.get_trending_coins())


@_add_user
@_update_command_calls
def _add_coin_to_bag(update: Update, cb: CallbackContext) -> None:
    update.message.reply_text(bags.add_coin(extract_current_request_data_from_update(update), cb))


@_add_user
@_update_command_calls
def _remove_coin_from_bag(update: Update, cb: CallbackContext) -> None:
    update.message.reply_text(bags.remove_from_bag(extract_current_request_data_from_update(update), cb))


@_add_user
@_update_command_calls
def _send_bag_data(update: Update, _) -> None:
    update.message.reply_text(bags.get_bag_data(extract_current_request_data_from_update(update)))


@_add_user
def _send_last_ten_commands(update: Update, _: CallbackContext) -> None:
    last_commands = users.get_last_ten_commands(extract_current_request_data_from_update(update))
    if len(last_commands) < 1:
        update.message.reply_text("Sorry, did not find your command history!\nTry using /help")
    else:
        last_commands.insert(0, 'Your last 10 commands🧐')
        update.message.reply_text("\n".join(last_commands))


def extract_current_request_data_from_update(update: Update) -> JSONDict:
    return update.message.from_user.to_dict()


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
