import json


def get_test_tx():
    return json.loads(
        '{ "blockNumber": "7553255", "timeStamp": "1621454258", "hash": '
        '"0xb964ef339264feed925b8a0759a5c3c4e9eedb7d4ee28be3de274213321f7b31", "nonce": "168", "blockHash": '
        '"0x392d48dd7a22140cfa489fd28c694a3fb48df2d729a475e02cc98255daa1fcbb", "from": '
        '"0x2036f84a725463a3840ba2cfc7c1b9842272f7ae", "contractAddress": '
        '"0x27ae27110350b98d564b9a3eed31baebc82d878d", "to": "0x114d536fb1d3365318a19c0127822a2a3dd329b3", '
        '"value": "1591279235269793736797", "tokenName": "CumRocket", "tokenSymbol": "CUMMIES", "tokenDecimal": "18", '
        '"transactionIndex": "257", "gas": "521209", "gasPrice": "5000000000", "gasUsed": "465427", '
        '"cumulativeGasUsed": "31052495", "input": "deprecated", "confirmations": "153"}')
