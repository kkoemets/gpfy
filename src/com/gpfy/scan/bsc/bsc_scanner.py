import json

from bscscan import BscScan

from com.gpfy.util.json_manager import overwrite
from configuration import bscscan_api_key

transfers_json = 'cummies_transfers.json'
write = True
read = False


def run():
    if write:
        _write_transactions()

    if read:
        with open(transfers_json) as json_file:
            transactions = json.load(json_file)

            tx = transactions[0]
            tx_with_value = add_readable_value(tx)
            print(tx_with_value)


def add_readable_value(tx):
    decimal = int(tx['tokenDecimal'])
    reversed_value = tx['value'][::-1]

    tx_copy = tx.copy()
    tx_copy['readableValue'] = \
        (reversed_value[0:decimal] + "." + reversed_value[decimal:len(reversed_value)])[::-1]
    return tx_copy


def _add_readable_date_time(tx):
    print(tx)
    print(tx['timeStamp'])


def _write_transactions():
    bsc = BscScan(bscscan_api_key)
    cummies_contract = "0x27Ae27110350B98d564b9A3eeD31bAeBc82d878d"
    contract_address = cummies_contract
    page = 0
    offset = 0
    sort = "desc"
    transfers = bsc.get_bep20_token_transfer_events_by_contract_address_paginated(contract_address, page, offset, sort)
    transfers = list(map(lambda trans: add_readable_value(trans), transfers))

    print(len(transfers))

    selected_transfers = transfers[0:1000]
    to_pancake = list(filter(lambda trans: trans['to'] == '0x114d536fb1d3365318a19c0127822a2a3dd329b3',
                             selected_transfers))
    overwrite(transfers_json, to_pancake)

    with open(transfers_json, 'w') as outfile:
        json.dump(to_pancake, outfile)
