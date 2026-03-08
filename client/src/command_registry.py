from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Optional, Sequence

try:
    from telegram import BotCommand, Update
    from telegram.ext import Application, CommandHandler, ContextTypes
except ModuleNotFoundError:  # pragma: no cover - local test fallback when telegram deps are absent
    @dataclass(frozen=True)
    class BotCommand:
        command: str
        description: str

    class Update:  # pragma: no cover
        pass

    class Application:  # pragma: no cover
        def add_handler(self, _handler) -> None:
            raise NotImplementedError

    class CommandHandler:  # pragma: no cover
        def __init__(self, command: str, handler: Any):
            self.command = command
            self.handler = handler

    class _ContextTypes:  # pragma: no cover
        DEFAULT_TYPE = Any

    ContextTypes = _ContextTypes()

from botutil import extract_message_text
from command_messages import render_help_message

CommandCallback = Callable[[Update, ContextTypes.DEFAULT_TYPE], Awaitable[None]]


@dataclass(frozen=True)
class ParsedCommand:
    name: str
    args: list[str]


@dataclass(frozen=True)
class CommandSpec:
    name: str
    handler: CommandCallback
    description: str
    category: str
    example: Optional[str] = None
    show_in_help: bool = True
    show_in_menu: bool = True


class CommandRegistry:
    def __init__(self, command_specs: Sequence[CommandSpec]):
        self.command_specs = list(command_specs)
        self._command_map = {command.name: command for command in self.command_specs}

    def add_handlers(self, application: Application) -> None:
        for command in self.command_specs:
            application.add_handler(CommandHandler(command.name, command.handler))

    def telegram_commands(self) -> list[BotCommand]:
        return [
            BotCommand(command.name, command.description)
            for command in self.command_specs
            if command.show_in_menu
        ]

    def help_text(self) -> str:
        return render_help_message(self.command_specs)

    def get(self, command_name: str) -> Optional[CommandSpec]:
        return self._command_map.get(command_name)

    @staticmethod
    def parse_command_text(text: Optional[str], bot_username: Optional[str] = None) -> Optional[ParsedCommand]:
        if not text:
            return None

        parts = text.strip().split()
        if not parts:
            return None

        first_token = parts[0]
        if not first_token.startswith('/'):
            return None

        token = first_token[1:]
        args = parts[1:]
        if '@' not in token:
            return ParsedCommand(token, args)

        command_name, suffix = token.split('@', 1)
        normalized_bot_username = (bot_username or '').lstrip('@').lower()
        if normalized_bot_username and suffix.lower() == normalized_bot_username:
            return ParsedCommand(command_name, args)

        if command_name == 'price' and suffix and not args:
            return ParsedCommand(command_name, [suffix])

        return ParsedCommand(command_name, args)

    async def dispatch_fallback_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> bool:
        parsed_command = self.parse_command_text(
            extract_message_text(update),
            getattr(getattr(context, 'bot', None), 'username', None),
        )
        if parsed_command is None:
            return False

        command = self.get(parsed_command.name)
        if command is None:
            return False

        context.args = list(parsed_command.args)
        await command.handler(update, context)
        return True
