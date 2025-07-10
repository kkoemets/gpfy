import re
import urllib.request

from telegram import Update
from telegram._utils.types import JSONDict
from telegram.ext import ContextTypes

from botutil import extract_message_text
from crypto_data_client import CryptoDataClient
from user_service import UserService


class BagService:
    def __init__(self, user_service: UserService, crypto_data_client: CryptoDataClient):
        self.user_service = user_service
        self.crypto_data_client = crypto_data_client

    async def add_coin(self, current_request_data: JSONDict, cb: ContextTypes.DEFAULT_TYPE, update: Update) -> str:
        words_in_message = await self.find_words_in_message(cb, update)

        if len(words_in_message) != 2:
            return 'Incorrect arguments, correct example: `/bag_add bitcoin 0.001`'

        coin_full_name = words_in_message[0].lower()
        amount = words_in_message[1]
        if not re.compile(r'^\d*[.]?\d*$').match(amount):
            return 'Incorrect amount argument, correct example: `/bag_add bitcoin 0.001`'

        try:
            await self.crypto_data_client.get_coin_summary(coin_full_name)
        except urllib.error.HTTPError:
            return 'Unknown coin ´{0}´ not added to the bag'.format(coin_full_name)

        self.user_service.add_to_bag(current_request_data, coin_full_name, amount)

        return 'Added ´{0}´ to the bag'.format(coin_full_name)

    async def get_bag_data(self, current_request_data: JSONDict) -> str:
        bag = self.user_service.get_bag(current_request_data)
        if len(bag) < 1:
            return 'Your bag is empty, use `/bag_add` command to add coins to your bag'

        return str(
            await self.crypto_data_client.get_bag_summary(
                {'query': [{'coinFullName': k, 'amount': v} for k, v in bag.items()]}))

    async def remove_from_bag(self, current_request_data: JSONDict, cb: ContextTypes.DEFAULT_TYPE,
                              update: Update) -> str:
        words_in_message = await self.find_words_in_message(cb, update)

        if len(words_in_message) != 1:
            return 'Incorrect arguments, correct example: `/bag_remove bitcoin`'

        coin_full_name = words_in_message[0].lower()
        self.user_service.remove_from_bag(current_request_data, coin_full_name)

        return 'Deleted ´{0}´ from the bag'.format(coin_full_name)

    @staticmethod
    async def find_words_in_message(cb: ContextTypes.DEFAULT_TYPE, update) -> list[str]:
        words_in_message = cb.args
        if words_in_message is None:
            words_in_message = extract_message_text(update).split()
            words_in_message = words_in_message[1:]

        return words_in_message
