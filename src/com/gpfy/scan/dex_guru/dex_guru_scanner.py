import json
import logging
import statistics
import urllib.request

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s | %(name)s | %(levelname)s | %(message)s')

json_file = 'dex_guru_cummies.json'
url = 'https://api.dex.guru/v1/tokens/0x27ae27110350b98d564b9a3eed31baebc82d878d-bsc/swaps?from_num=0&size=30&sort_by=timestamp&sort_by2=id&asc=false'


def get_cummies_average_price():
    return _calculate_cummies_average_price(_get_stats_json())


def _get_stats_json():
    return json.loads(urllib.request.urlopen(urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf8'))


def _calculate_cummies_average_price(json):
    prices_in_usd = _get_usd_prices(json['data'], 'CUMMIES')
    print(prices_in_usd)
    avg_price = statistics.mean(prices_in_usd)
    logging.info('Cummies average price-{0} USD'.format(str(avg_price)))
    return avg_price


def _get_usd_prices(data, token):
    return list(map(lambda el: el['token0PriceUSD'],
                    filter(lambda el: el['token0Symbol'] == token, data)))
