import logging

from tinydb import TinyDB, Query

db = TinyDB('db.json')

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)
COMMANDS_KEY = 'last_10_tracked_command_calls'
COUNT_KEY = 'command_calls_count'
USER_ID = 'id'


def find_last_ten_commands(update):
    found_user, _ = find_user(update)
    if found_user is None:
        return []
    return found_user[COMMANDS_KEY].copy()


def update_command_calls(update):
    found_user, user_request_data = find_user(update)

    text = update.message.text
    if found_user is not None:
        return update_calls(found_user, text)

    logger.info("Adding new user-{0}".format(str(user_request_data)))
    user_request_data[COUNT_KEY] = 1
    user_request_data[COMMANDS_KEY] = [text]
    db.insert(user_request_data)


def update_calls(found_user, text):
    logger.info(f"User-{str(found_user)} already exists")
    update_count(found_user)
    command_calls = found_user[COMMANDS_KEY]
    if text in command_calls:
        return

    if len(command_calls) > 9:
        command_calls.pop()
    command_calls.insert(0, text)
    db.update(found_user, Query().id == found_user[USER_ID])


def update_count(found_user):
    command_calls_count = found_user[COUNT_KEY]
    found_user[COUNT_KEY] = command_calls_count + 1
    db.update(found_user, Query().id == found_user[USER_ID])


def find_user(update):
    user_request_data = update.message.from_user.to_dict()
    results = db.search(Query().id == user_request_data[USER_ID])
    if len(results) > 1:
        raise Exception("Error, multiple entries per one user")

    if len(results) == 0:
        return None, user_request_data

    found_user = results[0]
    return found_user, user_request_data
