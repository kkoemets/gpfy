import logging

import aiohttp

from configuration import SERVER_HOST, SERVER_PORT

SERVER_URL = SERVER_HOST + ':' + SERVER_PORT
CALCULATE_BAG_URL = '/bag/calculate'
COIN_PRICE_URL = '/bot/contract/summary?coinFullName='
TWO_YEAR_AVG_URL = '/images/2YearMovingAvg'
RAINBOW_CHART_URL = '/images/rainbow'
MCAP_SUMMARY_URL = '/coinmarketcap/mcap-summary'
TRENDING_URL = '/coinmarketcap/trending'

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)


class CryptoDataClient:

    async def get_mcap_summary(self) -> str:
        return (await self._get_json(MCAP_SUMMARY_URL))['cmcSummary']

    async def get_coin_summary(self, coin_full_name: str) -> str:
        return (await self._get_json(COIN_PRICE_URL + coin_full_name))['summaryText']

    async def get_bag_summary(self, bag_query_json: object) -> str:
        return (await self._post_and_get_json(CALCULATE_BAG_URL, bag_query_json))['bagSummary']

    async def get_2_year_avg_chart(self) -> str:
        return (await self._get_json(TWO_YEAR_AVG_URL))['base64Img']

    async def get_rainbow_chart(self) -> str:
        return (await self._get_json(RAINBOW_CHART_URL))['base64Img']

    async def get_trending_coins(self) -> str:
        return await (self._get_json(TRENDING_URL))['trendingSummary']

    @staticmethod
    async def _get_json(url: str) -> dict:
        full_url = SERVER_URL + url
        logger.info(f'Making GET request to {full_url}')
        async with aiohttp.ClientSession() as session:
            async with session.get(full_url) as response:
                return await response.json()

    @staticmethod
    async def _post_and_get_json(url: str, json: object) -> dict:
        full_url = SERVER_URL + url
        logger.info(f'Making POST request to {full_url}')
        async with aiohttp.ClientSession() as session:
            async with session.post(full_url, json=json) as response:
                return await response.json()
