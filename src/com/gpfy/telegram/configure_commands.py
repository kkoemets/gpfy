import logging

from com.gpfy.scan.dex_guru.dex_guru_scanner import get_cummies_average_price
from telegram import Update, ForceReply
from telegram.ext import CommandHandler, MessageHandler, Filters, CallbackContext

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
    price = get_cummies_average_price()
    logging.info(price)
    update.message.reply_text('Cummies average price-{0} USD'.format(str(price)))


commands = [
    ("start", start, "Start conversation"),
    ("cummies", cummies, "Show summary for $cummies"),
    ("help", help_command, "List commands")
]
