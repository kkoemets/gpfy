from collections import defaultdict
from typing import Iterable


def render_start_message(command_specs: Iterable[object]) -> str:
    command_names = {command.name for command in command_specs}

    quick_actions = [
        '• Check a coin with /price bitcoin',
        '• Scan the market with /mcap or /trending',
        '• Track your bag with /bag_add bitcoin 0.001 and /bag_show',
    ]

    if 'rainbow' in command_names and '2year' in command_names:
        quick_actions.append('• Open BTC cycle charts with /rainbow or /2year')

    return '\n'.join([
        'Welcome to gpfy.',
        'I help you track crypto prices, market context, and your own bag.',
        '',
        'Quick start:',
        *quick_actions,
        '',
        'Use /help for the full command guide.',
    ])


def render_help_message(command_specs: Iterable[object]) -> str:
    grouped_commands: dict[str, list[object]] = defaultdict(list)
    for command in command_specs:
        if getattr(command, 'show_in_help', True):
            grouped_commands[command.category].append(command)

    lines = [
        'gpfy command guide',
        '',
        'Getting started',
        '/start - quick intro and next steps',
        '/help - this command guide',
    ]

    ordered_categories = ['Market', 'Portfolio', 'History', 'Fun']
    for category in ordered_categories:
        commands = grouped_commands.get(category, [])
        if not commands:
            continue

        lines.extend(['', category])
        for command in commands:
            line = f'/{command.name} - {command.description}'
            if command.example:
                line = f'{line} (example: {command.example})'
            lines.append(line)

    lines.extend([
        '',
        'Compact shortcut',
        '/price@bitcoin - quick inline coin lookup',
    ])

    return '\n'.join(lines)


def render_unknown_command_message(command_name: str) -> str:
    return f"Unknown command: /{command_name}. Use /help to see what gpfy can do."
