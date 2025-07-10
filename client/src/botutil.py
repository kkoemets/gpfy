from typing import Optional

from telegram import Update


def extract_message_text(update: Update) -> Optional[str]:
    if update.message and update.message.text:
        return update.message.text
    elif update.channel_post and update.channel_post.text:
        return update.channel_post.text
    elif update.effective_message and update.effective_message.text:
        return update.effective_message.text
    else:
        return None
