import base64
import json
import logging
import urllib.request
from io import BytesIO

from telegram import Update, ForceReply
from telegram.ext import CallbackContext, CommandHandler

from configuration import SERVER_HOST, SERVER_PORT
from db import find_last_ten_commands, update_command_calls

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

    summary = get_json(update, url)['cmcSummary']
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

    arg = cb.args.pop()
    url = SERVER_URL + '/bot/contract/summary?coinFullName=' + arg
    log_request(url)

    find_coin_summary_and_respond(update, url)


def help_command(update: Update, _: CallbackContext) -> None:
    update_command_calls(update)
    update.message.reply_text(
        '\n'.join(list(map(lambda command: '/' + command[0] + ' : ' + command[2], commands))))


def find_coin_summary_and_respond(update, url):
    response_json = get_json(update, url)
    logger.info(response_json)
    text = response_json['summaryText']
    logging.info(text)
    update_command_calls(update)
    update.message.reply_text(text)


def _2_year(update: Update, context: CallbackContext) -> None:
    update_command_calls(update)
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        get_json(update, SERVER_URL + '/bot/images/2YearMovingAvg')['base64Img'])))


def rainbow(update: Update, context: CallbackContext) -> None:
    update_command_calls(update)
    context.bot.sendPhoto(chat_id=update.message.chat.id, photo=BytesIO(base64.b64decode(
        get_json(update, SERVER_URL + '/bot/images/rainbow')['base64Img'])))


def get_headers(update: Update):
    return {'userid': update.message.from_user.id,
            'username': update.message.from_user.first_name}


def get_json(update, url):
    response_json = json.loads(
        urllib.request.urlopen(urllib.request.Request(
            url, headers=get_headers(update))).read().decode('utf8'))
    return response_json


def log_request(url):
    logger.info('Sending rq to %s', url)


commands = [
    ("start", start, "Start conversation"),
    ("cummies", cummies, "Show summary for $CUMMIES"),
    ("price", price, "Show summary for a coin. E.g. /price@bitcoin"),
    ("mcap", mcap, "Show CMC summary"),
    ("last10", last_10, "Show last ten used commands"),
    ("2year", _2_year, "Show btc 2-Year MA Multiplier"),
    ("rainbow", rainbow, "Show btc rainbow graph"),
    ("help", help_command, "List commands")
]
