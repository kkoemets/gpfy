import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src'))

from command_messages import render_help_message, render_start_message, render_unknown_command_message
from command_registry import CommandRegistry, CommandSpec


async def _noop(update, context):
    return None


class CommandCopyTest(unittest.TestCase):
    def setUp(self):
        self.command_specs = [
            CommandSpec('start', _noop, 'quick intro and next steps', 'Getting started'),
            CommandSpec('help', _noop, 'full command guide', 'Getting started'),
            CommandSpec('price', _noop, 'look up a coin summary', 'Market', '/price bitcoin'),
            CommandSpec('bag_add', _noop, 'add a coin to your bag', 'Portfolio', '/bag_add bitcoin 0.001'),
            CommandSpec('last10', _noop, 'show your recent commands', 'History'),
            CommandSpec('cummies', _noop, 'show the CumRocket summary', 'Fun'),
            CommandSpec('rainbow', _noop, 'BTC rainbow chart', 'Market'),
            CommandSpec('2year', _noop, 'BTC 2-Year MA Multiplier chart', 'Market'),
        ]

    def test_start_message_includes_primary_paths(self):
        message = render_start_message(self.command_specs)
        self.assertIn('Welcome to gpfy.', message)
        self.assertIn('/price bitcoin', message)
        self.assertIn('/bag_add bitcoin 0.001', message)
        self.assertIn('/help', message)

    def test_help_message_groups_commands_and_examples(self):
        message = render_help_message(self.command_specs)
        self.assertIn('gpfy command guide', message)
        self.assertIn('Market', message)
        self.assertIn('/price - look up a coin summary (example: /price bitcoin)', message)
        self.assertIn('Portfolio', message)
        self.assertIn('/bag_add - add a coin to your bag (example: /bag_add bitcoin 0.001)', message)
        self.assertIn('/price@bitcoin - quick inline coin lookup', message)

    def test_unknown_command_message_points_to_help(self):
        self.assertEqual(
            'Unknown command: /moon. Use /help to see what gpfy can do.',
            render_unknown_command_message('moon'),
        )


class CommandRegistryTest(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.price_handler = AsyncMock()
        self.registry = CommandRegistry([
            CommandSpec('price', self.price_handler, 'look up a coin summary', 'Market', '/price bitcoin'),
            CommandSpec('help', AsyncMock(), 'full command guide', 'Getting started'),
        ])

    def test_parse_standard_command(self):
        parsed = self.registry.parse_command_text('/price bitcoin')
        self.assertEqual('price', parsed.name)
        self.assertEqual(['bitcoin'], parsed.args)

    def test_parse_inline_price_shortcut(self):
        parsed = self.registry.parse_command_text('/price@bitcoin')
        self.assertEqual('price', parsed.name)
        self.assertEqual(['bitcoin'], parsed.args)

    def test_parse_group_command_with_bot_username(self):
        parsed = self.registry.parse_command_text('/help@gpfy_bot', bot_username='gpfy_bot')
        self.assertEqual('help', parsed.name)
        self.assertEqual([], parsed.args)

    async def test_dispatches_fallback_command_with_parsed_args(self):
        update = SimpleNamespace(message=SimpleNamespace(text='/price@bitcoin'))
        context = SimpleNamespace(args=None, bot=SimpleNamespace(username='gpfy_bot'))

        handled = await self.registry.dispatch_fallback_command(update, context)

        self.assertTrue(handled)
        self.assertEqual(['bitcoin'], context.args)
        self.price_handler.assert_awaited_once_with(update, context)


if __name__ == '__main__':
    unittest.main()
