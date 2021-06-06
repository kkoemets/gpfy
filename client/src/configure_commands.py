import json
import logging
import time
import urllib.request

from telegram import Update, ForceReply
from telegram.ext import CommandHandler, MessageHandler, Filters, CallbackContext

from configuration import SERVER_HOST, SERVER_PORT

SERVER_URL = SERVER_HOST + ':' + SERVER_PORT

logging.basicConfig(
    filename='../logs/run_telegram_bot-' + str(int(time.time())) + '.log',
    filemode='w',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def configure_commands(dispatcher):
    set_known_command(dispatcher)
    echo_unknown_message(dispatcher)
    try_to_handle_nonstandard_command(dispatcher)
    dispatcher.add_error_handler(error_handler)


def set_known_command(dispatcher):
    for command in commands:
        dispatcher.add_handler(CommandHandler(command[0], command[1]))


def echo_unknown_message(dispatcher):
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))


def try_to_handle_nonstandard_command(dispatcher):
    dispatcher.add_handler(MessageHandler(Filters.command, handle_nonstandard_command))


def error_handler(update: Update, context: CallbackContext) -> None:
    logger.error(msg="Exception while handling an update:", exc_info=context.error)
    update.message.reply_text('Sorry, something went wrong with me.')


def start(update: Update, _: CallbackContext) -> None:
    user = update.effective_user
    update.message.reply_markdown_v2(
        fr'Hi {user.mention_markdown_v2()}\! I am here to help you with your crypto needs.',
        reply_markup=ForceReply(selective=True),
    )


def help_command(update: Update, _: CallbackContext) -> None:
    update.message.reply_text(
        '\n'.join(list(map(lambda command: '/' + command[0] + ' : ' + command[2], commands))))


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


def price(update: Update, cb: CallbackContext) -> None:
    logger.info("Trying to find price for -" + str(cb.args))
    if len(cb.args) != 1:
        logger.info("Too many args")
        return

    arg = cb.args.pop()

    url = SERVER_URL + '/bot/contract/summary?coinFullName=' + arg
    logger.info('Sending rq to %s', url)

    find_coin_summary_and_respond(update, url)


def cummies(update: Update, _: CallbackContext) -> None:
    url = SERVER_URL + \
          '/bot/contract/summary?contract=0x27ae27110350b98d564b9a3eed31baebc82d878d'
    logger.info('Sending rq to %s', url)

    find_coin_summary_and_respond(update, url)


def find_coin_summary_and_respond(update, url):
    response_json = json.loads(
        urllib.request.urlopen(urllib.request.Request(
            url, headers=get_headers(update))).read().decode('utf8'))
    logger.info(response_json)
    text = response_json['summaryText']
    logging.info(text)
    update.message.reply_text(text)


def get_headers(update: Update):
    return {'userid': update.message.from_user.id,
            'username': update.message.from_user.first_name}


commands = [
    ("start", start, "Start conversation"),
    ("cummies", cummies, "Show summary for $CUMMIES"),
    ("price", price, "Show summary for a coin. E.g. /price@cumrocket"),
    ("help", help_command, "List commands")
]
