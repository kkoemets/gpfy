import logging
from typing import Optional, Dict

from pymongo import MongoClient
from telegram.utils.types import JSONDict

from configuration import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)
COMMANDS_KEY = 'last_10_tracked_command_calls'
BAG_KEY = 'bag'
COUNT_KEY = 'command_calls_count'
USER_ID_KEY = 'id'


class UserService:
    def __init__(self):
        self.client = MongoClient('mongodb://%s:%s@%s:%s/' % (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT))
        self.db = self.client["bot"]
        self.users = self.db["users"]

    def get_last_ten_commands(self, current_request_data: JSONDict) -> [str]:
        user = self._query_user(current_request_data)
        stored_last_ten_commands = user.get(COMMANDS_KEY)
        return stored_last_ten_commands if stored_last_ten_commands is not None else []

    def add_new_user(self, current_request_data: JSONDict) -> None:
        user = self._query_user(current_request_data)
        if user is not None:
            logger.info("User already exists-{0}".format(str(current_request_data)))
            return

        self.users.insert_one(current_request_data)

    def update_command_calls(self, current_request_data: JSONDict, message_text: str) -> None:
        found_user = self._query_user(current_request_data)

        current_command_calls = found_user.get(COMMANDS_KEY)
        new_command_calls = current_command_calls if current_command_calls is not None else []

        if len(new_command_calls) > 9:
            new_command_calls.pop()

        if message_text not in new_command_calls:
            new_command_calls.insert(0, message_text)

        command_calls_count = found_user.get(COUNT_KEY)
        self.users.update_one({USER_ID_KEY: found_user[USER_ID_KEY]},
                              {"$set": {COMMANDS_KEY: new_command_calls,
                                        COUNT_KEY: command_calls_count + 1 if command_calls_count is not None else 1}})

    def add_to_bag(self, current_request_data: JSONDict, coin_full_name: str, amount: str) -> None:
        user = self._query_user(current_request_data)
        current_bag = user.get(BAG_KEY)

        if current_bag is None:
            user[BAG_KEY] = {coin_full_name: amount}
            self.users.update_one({USER_ID_KEY: user[USER_ID_KEY]}, {"$set": {BAG_KEY: {coin_full_name: amount}}})
            return

        current_bag[coin_full_name] = amount
        self.users.update_one({USER_ID_KEY: user[USER_ID_KEY]}, {"$set": {BAG_KEY: current_bag}})

    def remove_from_bag(self, current_request_data: JSONDict, coin_full_name: str) -> None:
        user = self._query_user(current_request_data)
        current_bag = user.get(BAG_KEY)
        if current_bag is None:
            return

        if current_bag.get(coin_full_name) is None:
            return

        current_bag.pop(coin_full_name)
        self.users.update_one({USER_ID_KEY: user[USER_ID_KEY]}, {"$set": {BAG_KEY: current_bag}})

    def get_bag(self, current_request_data: JSONDict) -> Dict[str, str]:
        user = self._query_user(current_request_data)
        current_bag = user.get(BAG_KEY)
        if current_bag is None:
            return {}

        return current_bag

    def _query_user(self, current_request_data: JSONDict) -> Optional[JSONDict]:
        user = self.users.find_one({USER_ID_KEY: current_request_data[USER_ID_KEY]})
        return user
