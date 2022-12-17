import base64
import json
import logging
import re
import urllib.request
from io import BytesIO

import requests
from telegram import Update, ForceReply
from telegram.ext import CallbackContext, CommandHandler

from configuration import SERVER_HOST, SERVER_PORT
from db import find_last_ten_commands, update_command_calls, add_to_bag, remove_from_bag, find_bag

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

SERVER_URL = SERVER_HOST + ':' + SERVER_PORT


def add_defined_commands(dispatcher):
    for command in commands:
        dispatcher.add_handler(CommandHandler(command[0], command[1]))


def start(update: Update, _: CallbackContext) -> None:
    update_command_calls(update)
    user = update.effective_user
    update.message.reply_markdown_v2(
        fr'Hi {user.mention_markdown_v2()}\! I am here to help you with your crypto needs.',
        reply_markup=ForceReply(selective=True),
    )


def mcap(update: Update, _: CallbackContext) -> None:
    update_command_calls(update)
    url = SERVER_URL + \
          '/coinmarketcap/mcap-summary'
    log_request(url)

    summary = get_json(url)['cmcSummary']
    logging.info(summary)
    update.message.reply_text(summary)


def last_10(update: Update, _: CallbackContext) -> None:
    last_commands = find_last_ten_commands(update)
    if len(last_commands) < 1:
        update.message.reply_text("Sorry, did not find your command history!\nTry using /help")
    else:
        last_commands.insert(0, 'Your last 10 commands🧐')
        update.message.reply_text("\n".join(last_commands))


def cummies(update: Update, _: CallbackContext) -> None:
    url = SERVER_URL + \
          '/bot/contract/summary?contract=0x27ae27110350b98d564b9a3eed31baebc82d878d'
    log_request(url)
    find_coin_summary_and_respond(update, url)


def price(update: Update, cb: CallbackContext) -> None:
    logger.info("Trying to find price for -" + str(cb.args))
    if len(cb.args) != 1:
        logger.info("Too many args")
        return

    coin_full_name = cb.args.pop()
    url = SERVER_URL + '/bot/contract/summary?coinFullName=' + coin_full_name
    log_request(url)

    find_coin_summary_and_respond(update, url)


def help_command(update: Update, _: CallbackContext) -> None:
    update_command_calls(update)
    update.message.reply_text(
        '\n'.join(list(map(lambda command: '/' + command[0] + ' : ' + command[2], commands))))


def find_coin_summary_and_respond(update, url):
    response_json = get_json(url)
    logger.info(response_json)
    text = response_json['summaryText']
    logging.info(text)
    update_command_calls(update)
    update.message.reply_text(text)


def _2_year(update: Update, context: CallbackContext) -> None:
    update_command_calls(update)
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        get_json(SERVER_URL + '/bot/images/2YearMovingAvg')['base64Img'])))


def rainbow(update: Update, context: CallbackContext) -> None:
    update_command_calls(update)
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        get_json(SERVER_URL + '/bot/images/rainbow')['base64Img'])))


def trending(update: Update, _) -> None:
    update_command_calls(update)
    response_json = get_json(SERVER_URL + '/coinmarketcap/trending')
    logger.info(response_json)
    text = response_json['trendingSummary']
    logging.info(text)
    update_command_calls(update)
    update.message.reply_text(text)


def bag_add(update: Update, cb: CallbackContext):
    args = cb.args
    if (len(args) != 2):
        update.message.reply_text('Incorrect arguments, correct example: `/bag_add bitcoin 0.001`')
        return

    coin_full_name = args[0]
    amount = args[1]
    if not re.compile(r'^\d*[.]?\d*$').match(amount):
        update.message.reply_text('Incorrect amount argument, correct example: `/bag_add bitcoin 0.001`')
        return

    try:
        url = SERVER_URL + '/bot/contract/summary?coinFullName=' + coin_full_name
        log_request(url)
        get_json(url)
    except urllib.error.HTTPError:
        update.message.reply_text('Unknown coin ´{0}´ not added to the bag'.format(coin_full_name))
        return

    update_command_calls(update)
    add_to_bag(update, coin_full_name, amount)

    update.message.reply_text('Added ´{0}´ to the bag'.format(coin_full_name))


def bag_remove(update: Update, cb: CallbackContext):
    args = cb.args
    if (len(args) != 1):
        update.message.reply_text('Incorrect arguments, correct example: `/bag_remove bitcoin`')
        return

    coin_full_name = args[0]

    update_command_calls(update)
    remove_from_bag(update, coin_full_name)

    update.message.reply_text('Deleted ´{0}´ from the bag'.format(coin_full_name))


def bag_show(update: Update, _):
    update_command_calls(update)
    bag = find_bag(update)
    if len(bag) < 1:
        update.message.reply_text('Your bag is empty, use `/bag_add` command to add coins to your bag')
        return

    query = [{'coinFullName': k, 'amount': v} for k, v in bag.items()]
    logger.info(str(query))

    url = SERVER_URL + '/bot/bag/calculate'
    update.message.reply_text(str(post_and_get_json(url, {'query': query})['bagSummary']))


def get_json(url):
    logger.info("Getting json from-" + url)
    response_json = json.loads(
        urllib.request.urlopen(urllib.request.Request(url)).read().decode('utf8'))
    return response_json


def post_and_get_json(url, data):
    logger.info("Getting json from-" + url)
    r = requests.post(url, json=data)
    if not r.ok:
        raise Exception()
    return r.json()


def log_request(url):
    logger.info('Sending rq to %s', url)


commands = [
    ("start", start, "Start conversation"),
    ("cummies", cummies, "Show summary for $CUMMIES"),
    ("price", price, "Show summary for a coin, e.g. ´/price@bitcoin´"),
    ("mcap", mcap, "Show CMC summary"),
    ("last10", last_10, "Show last ten used commands"),
    ("2year", _2_year, "Show btc 2-Year MA Multiplier"),
    ("rainbow", rainbow, "Show btc rainbow graph"),
    ("trending", trending, "Show trending coins"),
    ("help", help_command, "List commands"),
    ("bag_add", bag_add, "Add a coin to the bag, e.g. ´/bag_add bitcoin 0.001´"),
    ("bag_remove", bag_remove, "Remove a coin from the bag, e.g. ´/bag_remove bitcoin`"),
    ("bag_show", bag_show, "Show off your bag")
]
