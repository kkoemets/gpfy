import json
import logging
import urllib.request

from telegram import Update, ForceReply
from telegram.ext import CommandHandler, MessageHandler, Filters, CallbackContext

from configuration import server_host, server_port

server_url = server_host + ':' + server_port

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def configure_commands(dispatcher):
    set_known_command(dispatcher)
    echo_unknown_message_or_command(dispatcher)


def set_known_command(dispatcher):
    for command in commands:
        dispatcher.add_handler(CommandHandler(command[0], command[1]))


def echo_unknown_message_or_command(dispatcher):
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))


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


def cummies(update: Update, _: CallbackContext) -> None:
    url = server_url + \
          '/bot/contract/summary?contract=0x27ae27110350b98d564b9a3eed31baebc82d878d'
    logger.info('Sending rq to ' + url)
    response_json = json.loads(urllib.request.urlopen(urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf8'))
    logger.info(response_json)
    text = response_json['summaryText']
    logging.info(text)
    update.message.reply_text(text)


commands = [
    ("start", start, "Start conversation"),
    ("cummies", cummies, "Show summary for $cummies"),
    ("help", help_command, "List commands")
]
