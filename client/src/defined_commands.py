import base64
import functools
import logging
import re
import urllib.request
from io import BytesIO
from typing import Any

import requests
from telegram import Update, ForceReply
from telegram.ext import CallbackContext, CommandHandler

from configuration import SERVER_HOST, SERVER_PORT
from db import find_last_ten_commands, add_to_bag, remove_from_bag, find_bag, update_command_calls

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

SERVER_URL = SERVER_HOST + ':' + SERVER_PORT
CALCULATE_BAG_URL = '/bot/bag/calculate'
COIN_PRICE_URL = '/bot/contract/summary?coinFullName='
TWO_YEAR_AVG_URL = '/bot/images/2YearMovingAvg'
RAINBOW_CHART_URL = '/bot/images/rainbow'
MCAP_SUMMARY_URL = '/coinmarketcap/mcap-summary'
TRENDING_URL = '/coinmarketcap/trending'


def add(dispatcher):
    """
    Add all the defined commands to the dispatcher
    :param dispatcher:
    """
    for command in commands:
        dispatcher.add_handler(CommandHandler(command[0], command[1]))


def _update_command_calls(func) -> Any:
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        callback = args[1]
        logger.info(f'arguments-{callback.args}')
        func(*args, **kwargs)
        update = args[0]
        update_command_calls(update)
        return None

    return wrapper


@_update_command_calls
def _start(update: Update, _: CallbackContext) -> None:
    user = update.effective_user
    update.message.reply_markdown_v2(
        fr'Hi, {user.mention_markdown_v2()}\! I am here to help you with your crypto needs\. Type /help to see what I can do\.',
        reply_markup=ForceReply(selective=True),
    )


@_update_command_calls
def _send_market_cap(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(_get_json(MCAP_SUMMARY_URL)['cmcSummary'])


@_update_command_calls
def _send_cummies(update: Update, _: CallbackContext) -> None:
    _find_coin_summary_and_respond(update, COIN_PRICE_URL + 'cumrocket')


@_update_command_calls
def coin_price(update: Update, cb: CallbackContext) -> None:
    arguments = cb.args
    if len(arguments) != 1:
        logger.info("Too many args")
        return

    coin_full_name = arguments.pop()
    url = COIN_PRICE_URL + coin_full_name
    _find_coin_summary_and_respond(update, url)


@_update_command_calls
def _send_help(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(
        '\n'.join(list(map(lambda command: '/' + command[0] + ' : ' + command[2], commands))))


@_update_command_calls
def _send_two_year_chart(update: Update, context: CallbackContext) -> None:
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        _get_json(TWO_YEAR_AVG_URL)['base64Img'])))


@_update_command_calls
def _send_rainbow_chart(update: Update, context: CallbackContext) -> None:
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        _get_json(RAINBOW_CHART_URL)['base64Img'])))


@_update_command_calls
def _send_trending(update: Update, _) -> None:
    update.message.reply_text(_get_json(TRENDING_URL)['trendingSummary'])


@_update_command_calls
def _add_coin_to_bag(update: Update, cb: CallbackContext):
    args = cb.args
    if (len(args) != 2):
        update.message.reply_text('Incorrect arguments, correct example: `/bag_add bitcoin 0.001`')
        return

    coin_full_name = args[0].lower()
    amount = args[1]
    if not re.compile(r'^\d*[.]?\d*$').match(amount):
        update.message.reply_text('Incorrect amount argument, correct example: `/bag_add bitcoin 0.001`')
        return

    try:
        url = COIN_PRICE_URL + coin_full_name
        _get_json(url)
    except urllib.error.HTTPError:
        update.message.reply_text('Unknown coin ´{0}´ not added to the bag'.format(coin_full_name))
        return

    add_to_bag(update, coin_full_name, amount)

    update.message.reply_text('Added ´{0}´ to the bag'.format(coin_full_name))


@_update_command_calls
def _remove_coin_from_bag(update: Update, cb: CallbackContext):
    args = cb.args
    if (len(args) != 1):
        update.message.reply_text('Incorrect arguments, correct example: `/bag_remove bitcoin`')
        return

    coin_full_name = args[0].lower()
    remove_from_bag(update, coin_full_name)

    update.message.reply_text('Deleted ´{0}´ from the bag'.format(coin_full_name))


@_update_command_calls
def _send_bag_data(update: Update, _):
    bag = find_bag(update)
    if len(bag) < 1:
        update.message.reply_text('Your bag is empty, use `/bag_add` command to add coins to your bag')
        return

    update.message.reply_text(str(
        _post_and_get_json(CALCULATE_BAG_URL, {'query': [{'coinFullName': k, 'amount': v} for k, v in bag.items()]})[
            'bagSummary']))


def _send_last_ten_commands(update: Update, _: CallbackContext) -> None:
    last_commands = find_last_ten_commands(update)
    if len(last_commands) < 1:
        update.message.reply_text("Sorry, did not find your command history!\nTry using /help")
    else:
        last_commands.insert(0, 'Your last 10 commands🧐')
        update.message.reply_text("\n".join(last_commands))


def _find_coin_summary_and_respond(update, url):
    response_json = _get_json(url)
    logger.info(response_json)
    text = response_json['summaryText']
    update.message.reply_text(text)


def _get_json(url: str) -> dict:
    full_url = SERVER_URL + url
    logger.info(f'Making request to {full_url}')
    response = requests.get(full_url)
    response.raise_for_status()
    j = response.json()
    logger.info(j)
    return j


def _post_and_get_json(url, data):
    full_url = SERVER_URL + url
    logger.info("Getting json from-" + full_url
                )
    r = requests.post(full_url, json=data)
    if not r.ok:
        raise Exception()
    return r.json()


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
