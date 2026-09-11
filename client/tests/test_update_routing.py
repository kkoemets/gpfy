import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, Mock, patch

from telegram import Update
from telegram.ext import Application, ContextTypes, ExtBot
from telegram.request import BaseRequest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src'))

# Import the real routing code without opening a database connection or using credentials.
with patch.dict(os.environ, {
    'TELEGRAM_BOT_TOKEN': '123:TEST',
    'CRYPTO_DATA_API_SERVER_HOST': 'http://localhost',
    'CRYPTO_DATA_API_SERVER_PORT': '3001',
    'DB_HOST': 'localhost',
    'DB_PORT': '27017',
    'DB_USER': 'test',
    'DB_PASSWORD': 'test',
}), patch('pymongo.MongoClient'):
    import command_handlers
    from configure_commands import configure_commands, echo


class TelegramRequest(BaseRequest):
    """Exercise Telegram's dispatcher and reply serialization without network access."""

    def __init__(self):
        self.sent_messages = []

    async def initialize(self):
        pass

    async def shutdown(self):
        pass

    async def do_request(self, url, method, request_data=None, **kwargs):
        endpoint = url.rsplit('/', 1)[-1]
        if endpoint == 'getMe':
            result = {'id': 123, 'is_bot': True, 'first_name': 'gpfy', 'username': 'gpfy_bot'}
        elif endpoint == 'setMyCommands':
            result = True
        elif endpoint == 'sendMessage':
            params = request_data.parameters
            self.sent_messages.append(params)
            result = {
                'message_id': 900 + len(self.sent_messages),
                'date': 1_800_000_000,
                'chat': {'id': params['chat_id'], 'type': 'supergroup'},
                'text': params['text'],
            }
        else:
            raise AssertionError(f'Unexpected Telegram request: {endpoint}')
        return 200, json.dumps({'ok': True, 'result': result}).encode()


class UpdateRoutingTest(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.users = Mock()
        self.crypto_data = Mock(get_coin_summary=AsyncMock(return_value='Bitcoin summary'))
        bags = command_handlers.bag_service.BagService(self.users, self.crypto_data)
        for name, value in [('users', self.users), ('crypto_data', self.crypto_data), ('bags', bags)]:
            patcher = patch.object(command_handlers, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)

        self.request = TelegramRequest()
        bot = ExtBot('123:TEST', request=self.request, get_updates_request=TelegramRequest())
        self.application = Application.builder().bot(bot).build()
        await self.application.initialize()
        self.addAsyncCleanup(self.application.shutdown)
        await configure_commands(self.application)
        self.errors = AsyncMock()
        self.application.add_error_handler(self.errors)

    def message_update(self, kind, text, chat_type='supergroup', update_id=1):
        message = {
            'message_id': 42,
            'date': 1_800_000_000,
            'chat': {'id': -100123 if chat_type != 'private' else 456, 'type': chat_type},
            'text': text,
        }
        if chat_type == 'channel':
            message['sender_chat'] = message['chat']
        else:
            message['from'] = {'id': 456, 'is_bot': False, 'first_name': 'Test'}
        if kind.startswith('edited_'):
            message['edit_date'] = 1_800_000_001
        if text.startswith('/'):
            message['entities'] = [{'type': 'bot_command', 'offset': 0, 'length': len(text.split()[0])}]
        return Update.de_json({'update_id': update_id, kind: message}, self.application.bot)

    def assert_silent(self):
        self.assertEqual([], self.request.sent_messages)
        self.assertEqual([], self.users.mock_calls)
        self.assertEqual([], self.crypto_data.mock_calls)
        self.errors.assert_not_awaited()

    def reset_effects(self):
        self.request.sent_messages.clear()
        self.users.reset_mock()
        self.crypto_data.reset_mock()
        self.errors.reset_mock()

    async def test_channel_post_followed_by_repeated_metadata_edits_is_not_reposted(self):
        for update_id, kind in enumerate(['channel_post', 'edited_channel_post', 'edited_channel_post'], 1):
            update = self.message_update(kind, 'BTC signal update', 'channel', update_id)
            await self.application.process_update(update)
        self.assert_silent()

    async def test_edited_chat_messages_are_not_echoed(self):
        for chat_type in ['private', 'group', 'supergroup']:
            with self.subTest(chat_type=chat_type):
                self.reset_effects()
                await self.application.process_update(self.message_update('edited_message', 'hello', chat_type))
                self.assert_silent()

    async def test_edits_do_not_repeat_commands_or_portfolio_mutations(self):
        for kind, chat_type in [('edited_message', 'supergroup'), ('edited_channel_post', 'channel')]:
            for text in ['/help', '/price bitcoin', '/price@bitcoin', '/bag_add bitcoin 0.001', '/unknown']:
                with self.subTest(kind=kind, text=text):
                    self.reset_effects()
                    await self.application.process_update(self.message_update(kind, text, chat_type))
                    self.assert_silent()

    async def test_standalone_reaction_updates_are_ignored(self):
        for kind in ['message_reaction', 'message_reaction_count']:
            update = Update.de_json({
                'update_id': 1,
                kind: {
                    'chat': {'id': -100123, 'type': 'supergroup'},
                    'message_id': 42,
                    'date': 1_800_000_001,
                    'user': {'id': 456, 'is_bot': False, 'first_name': 'Test'},
                    'old_reaction': [],
                    'new_reaction': [{'type': 'emoji', 'emoji': '👍'}],
                    'reactions': [{'type': {'type': 'emoji', 'emoji': '👍'}, 'total_count': 1}],
                },
            }, self.application.bot)
            await self.application.process_update(update)
        self.assert_silent()

    async def test_echo_itself_ignores_edits_and_channel_posts(self):
        for kind, chat_type in [
            ('edited_message', 'supergroup'),
            ('channel_post', 'channel'),
            ('edited_channel_post', 'channel'),
        ]:
            update = self.message_update(kind, 'BTC signal update', chat_type)
            context = ContextTypes.DEFAULT_TYPE.from_update(update, self.application)
            await echo(update, context)
        self.assert_silent()

    async def test_new_chat_text_still_echoes_once(self):
        await self.application.process_update(self.message_update('message', 'hello'))
        self.assertEqual(['hello'], [message['text'] for message in self.request.sent_messages])
        self.errors.assert_not_awaited()

    async def test_new_standard_command_still_runs_once(self):
        await self.application.process_update(self.message_update('message', '/price bitcoin'))
        self.crypto_data.get_coin_summary.assert_awaited_once_with('bitcoin')
        self.assertEqual(['Bitcoin summary'], [message['text'] for message in self.request.sent_messages])
        self.users.update_command_calls.assert_called_once()
        self.errors.assert_not_awaited()

    async def test_new_inline_shortcut_still_runs_once(self):
        await self.application.process_update(self.message_update('message', '/price@bitcoin'))
        self.crypto_data.get_coin_summary.assert_awaited_once_with('bitcoin')
        self.assertEqual(['Bitcoin summary'], [message['text'] for message in self.request.sent_messages])
        self.users.update_command_calls.assert_called_once()
        self.errors.assert_not_awaited()

    async def test_new_channel_commands_still_work(self):
        await self.application.process_update(self.message_update('channel_post', '/help', 'channel'))
        self.assertEqual(1, len(self.request.sent_messages))
        self.assertIn('gpfy command guide', self.request.sent_messages[0]['text'])
        self.errors.assert_not_awaited()

    async def test_new_unknown_command_still_gets_help(self):
        await self.application.process_update(self.message_update('message', '/unknown'))
        self.assertEqual(1, len(self.request.sent_messages))
        self.assertIn('Unknown command: /unknown.', self.request.sent_messages[0]['text'])
        self.errors.assert_not_awaited()


if __name__ == '__main__':
    unittest.main()
