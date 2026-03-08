import base64
import logging
from io import BytesIO
from typing import Optional

from telegram import Update
from telegram._utils.types import JSONDict
from telegram.ext import ContextTypes

import bag_service
import crypto_data_client
import user_service
from botutil import extract_message_text
from command_messages import render_start_message
from command_registry import CommandRegistry, CommandSpec

users = user_service.UserService()
crypto_data = crypto_data_client.CryptoDataClient()
bags = bag_service.BagService(users, crypto_data)

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)


class CommandHandlers:
    def __init__(self):
        self.registry: Optional[CommandRegistry] = None

    def set_registry(self, registry: CommandRegistry) -> None:
        self.registry = registry

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(
            update,
            context,
            lambda: send_reply(update, context, render_start_message(self._command_specs())),
        )

    async def help(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(
            update,
            context,
            lambda: send_reply(update, context, self.registry.help_text()),
        )

    async def show_market_cap(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: send_reply(update, context, awaitable=self._market_cap()))

    async def show_cummies(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: send_reply(update, context, awaitable=self._cummies()))

    async def show_price(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: self._show_price_impl(update, context))

    async def show_two_year_chart(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: self._send_chart(update, context, crypto_data.get_2_year_avg_chart))

    async def show_rainbow_chart(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: self._send_chart(update, context, crypto_data.get_rainbow_chart))

    async def show_trending(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: send_reply(update, context, awaitable=self._trending()))

    async def add_coin_to_bag(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(
            update,
            context,
            lambda: send_reply(
                update,
                context,
                awaitable=bags.add_coin(extract_actor_data(update), context, update),
            ),
        )

    async def remove_coin_from_bag(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(
            update,
            context,
            lambda: send_reply(
                update,
                context,
                awaitable=bags.remove_from_bag(extract_actor_data(update), context, update),
            ),
        )

    async def show_bag(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(
            update,
            context,
            lambda: send_reply(
                update,
                context,
                awaitable=bags.get_bag_data(extract_actor_data(update)),
            ),
        )

    async def show_recent_commands(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        await self._run_tracked(update, context, lambda: self._show_recent_commands_impl(update, context))

    async def _run_tracked(self, update: Update, context: ContextTypes.DEFAULT_TYPE, action) -> None:
        self._ensure_user(update)
        await action()
        self._track_command(update)

    def _ensure_user(self, update: Update) -> None:
        user_data = extract_actor_data(update)
        if user_data:
            users.add_new_user(user_data)
        else:
            logger.warning('Could not extract user data from update')

    def _track_command(self, update: Update) -> None:
        message_text = extract_message_text(update)
        if message_text:
            users.update_command_calls(extract_actor_data(update), message_text)

    async def _show_price_impl(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        words_in_text = list(context.args or [])
        if len(words_in_text) != 1:
            await send_reply(update, context, 'Usage: /price bitcoin\nShortcut: /price@bitcoin')
            return

        await send_reply(update, context, await crypto_data.get_coin_summary(words_in_text[0]))

    async def _show_recent_commands_impl(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        last_commands = users.get_last_ten_commands(extract_actor_data(update))
        if len(last_commands) < 1:
            await send_reply(update, context, 'Sorry, I do not have any command history for you yet. Try /help.')
            return

        await send_reply(update, context, '\n'.join(['Your last 10 commands', *last_commands]))

    async def _send_chart(self, update: Update, context: ContextTypes.DEFAULT_TYPE, image_getter) -> None:
        await send_photo(update, context, photo=BytesIO(base64.b64decode(await image_getter())))

    async def _market_cap(self) -> str:
        return await crypto_data.get_mcap_summary()

    async def _cummies(self) -> str:
        return await crypto_data.get_coin_summary('cumrocket')

    async def _trending(self) -> str:
        return await crypto_data.get_trending_coins()

    def _command_specs(self):
        if self.registry is None:
            return []
        return self.registry.command_specs


def extract_actor_data(update: Update) -> JSONDict:
    if update.message and update.message.from_user:
        return update.message.from_user.to_dict()
    if update.channel_post and update.channel_post.chat:
        chat = update.channel_post.chat
        return {
            'id': chat.id,
            'is_bot': False,
            'first_name': chat.username,
            'debug-type': 'channel-post'
        }
    if update.effective_user:
        return update.effective_user.to_dict()

    logger.info(f'Update without user data, using fallback user. Update type: {type(update).__name__}')
    return {'id': -1, 'is_bot': False, 'first_name': 'devnull', 'debug-type': 'error'}


async def send_reply(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE,
    text: Optional[str] = None,
    awaitable=None,
    **kwargs,
) -> None:
    resolved_text = await awaitable if awaitable is not None else text
    if resolved_text is None:
        raise ValueError('send_reply requires text or awaitable')

    if update.message:
        await update.message.reply_text(resolved_text, **kwargs)
    elif update.channel_post:
        await context.bot.send_message(chat_id=update.effective_chat.id, text=resolved_text, **kwargs)
    elif update.effective_chat and update.effective_message:
        await context.bot.send_message(chat_id=update.effective_chat.id, text=resolved_text, **kwargs)
    else:
        logger.error(f'Could not send reply - no valid message or chat found in update: {update}')
        raise ValueError('No valid message or chat found in update')


async def send_photo(update: Update, context: ContextTypes.DEFAULT_TYPE, photo, **kwargs) -> None:
    chat_id = update.effective_chat.id if update.effective_chat else None
    if not chat_id:
        logger.error(f'Could not send photo - no valid chat found in update: {update}')
        raise ValueError('No valid chat found in update')

    await context.bot.send_photo(chat_id=chat_id, photo=photo, **kwargs)


_registry: Optional[CommandRegistry] = None


def get_command_registry() -> CommandRegistry:
    global _registry
    if _registry is not None:
        return _registry

    handlers = CommandHandlers()
    registry = CommandRegistry([
        CommandSpec('start', handlers.start, 'quick intro and next steps', 'Getting started'),
        CommandSpec('help', handlers.help, 'full command guide', 'Getting started'),
        CommandSpec('price', handlers.show_price, 'look up a coin summary', 'Market', '/price bitcoin'),
        CommandSpec('mcap', handlers.show_market_cap, 'market cap summary', 'Market'),
        CommandSpec('trending', handlers.show_trending, 'trending coins', 'Market'),
        CommandSpec('2year', handlers.show_two_year_chart, 'BTC 2-Year MA Multiplier chart', 'Market'),
        CommandSpec('rainbow', handlers.show_rainbow_chart, 'BTC rainbow chart', 'Market'),
        CommandSpec('bag_add', handlers.add_coin_to_bag, 'add a coin to your bag', 'Portfolio', '/bag_add bitcoin 0.001'),
        CommandSpec('bag_remove', handlers.remove_coin_from_bag, 'remove a coin from your bag', 'Portfolio', '/bag_remove bitcoin'),
        CommandSpec('bag_show', handlers.show_bag, 'show your bag summary', 'Portfolio'),
        CommandSpec('last10', handlers.show_recent_commands, 'show your recent commands', 'History'),
        CommandSpec('cummies', handlers.show_cummies, 'show the CumRocket summary', 'Fun'),
    ])
    handlers.set_registry(registry)
    _registry = registry
    return registry
