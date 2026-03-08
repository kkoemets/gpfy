import { CoinmarketcapApi, CoinSummary, MarketCapSummary, TrendingCoinData } from './coinmarketcap.api';
import { createLogger } from '../../../util/log';
import fetch from 'node-fetch';
import { RestClient } from '../rest.client';
import { parseTrendingTable } from './parse-trending-table';

const log = createLogger();

export class CoinmarketcapRestClient extends RestClient implements CoinmarketcapApi {
    async findMarketCapSummary(): Promise<MarketCapSummary> {
        const globalStatisticsElements = Array.from(
            this.toDocument(await getHtml('https://coinmarketcap.com/')).querySelectorAll('div[class*="global-stats"]'),
        )
            ?.find((el) => el)
            ?.querySelectorAll('div[class*="glo-stat-item"]');

        const dominanceIndex = 4;
        if (!globalStatisticsElements || globalStatisticsElements.length < dominanceIndex) {
            return Promise.reject(Error('Could not find mcap global stats'));
        }

        const findDataFromAnchorElement = (index: number) =>
            globalStatisticsElements[index].getElementsByTagName('a')?.item(0)?.textContent || '';

        const mcapIndex = 2;
        const mcap = findDataFromAnchorElement(mcapIndex);
        log.info('Found market cap-' + mcap);

        const volume24HIndex = 3;
        const volume24H = findDataFromAnchorElement(volume24HIndex);
        log.info(`Found volume 24h-${volume24H}`);

        const dominanceData: string[] = findDataFromAnchorElement(dominanceIndex).split(/\s+/);

        const btcPercentageIndex = 1;
        const btcDominance = dominanceData[btcPercentageIndex];
        log.info(`Found found btc dominance-${btcDominance}`);

        const ethPercentageIndex = 3;
        const ethDominance = dominanceData[ethPercentageIndex];
        log.info(`Found found eth dominance-${ethDominance}`);

        return { mcap, volume24H, btcDominance, ethDominance };
    }

    async findCoinSummaryFromCmc({ coinOfficialName }: { coinOfficialName: string }): Promise<CoinSummary> {
        log.info('Retrieving coin summary from coinmarketcap');
        const html: string = await getCoinHtml(coinOfficialName);
        const document: Document = this.toDocument(html);

        const data: string | null | undefined = document.getElementById('__NEXT_DATA__')?.textContent;
        if (!data) {
            return Promise.reject(Error('Could not find summary (missing data)'));
        }

        const { low24h, high24h, marketCapDominance, price, priceChangePercentage24h, rank, turnover } =
            JSON.parse(data)?.props?.pageProps?.info?.statistics ||
            JSON.parse(data)?.props?.pageProps?.detailRes?.detail?.statistics ||
            {};

        return {
            coinName: `${
                JSON.parse(data)?.props?.pageProps?.info?.name ||
                JSON.parse(data)?.props?.pageProps?.detailRes?.detail?.name
            }`,
            price: `${price}`,
            _24hChange: `${priceChangePercentage24h}`,
            _24Low: `${low24h}`,
            _24High: `${high24h}`,
            _24TradingVolume: `${
                JSON.parse(data)?.props?.pageProps?.info?.volume ||
                JSON.parse(data)?.props?.pageProps?.detailRes?.detail?.volume
            }`,
            volumeMarketCapRatio: `${turnover}`,
            marketCapDominance: `${marketCapDominance}`,
            rank: `${rank}`,
        };
    }

    async findTrendingCoins(): Promise<TrendingCoinData[]> {
        const fromStaticHtml = parseTrendingTable({
            trendingHtmlPage: await getHtml('https://coinmarketcap.com/trending-cryptocurrencies/'),
        });

        if (fromStaticHtml.length > 0) {
            return fromStaticHtml;
        }

        log.info('Trending page is client-rendered; using CoinMarketCap unified trending API');
        return await findTrendingCoinsFromApi();
    }
}

const findTrendingCoinsFromApi = async (): Promise<TrendingCoinData[]> => {
    const response = await fetch('https://api.coinmarketcap.com/data-api/v3/unified-trending/listing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({ interval: '24h', pageNum: 1, pageSize: 50, boostType: 'hideBoost' }),
    });

    if (!response.ok) {
        throw new Error(`CoinMarketCap trending API failed with status ${response.status}`);
    }

    const data = await response.json();
    const list: Record<string, string | number | undefined>[] | undefined = data?.data?.list;

    if (!Array.isArray(list) || list.length === 0) {
        throw new Error('CoinMarketCap trending API returned no list data');
    }

    return list.map((coin: Record<string, string | number | undefined>, index: number) => {
        const requiredFields: string[] = ['tokenName', 'priceUsd', 'pricePercentageChange24h', 'volume24h'];

        const missingFields: string[] = requiredFields.filter((field) => coin[field] === undefined || coin[field] === null);
        if (missingFields.length > 0) {
            throw new Error(`CoinMarketCap trending API item ${index} missing fields: ${missingFields.join(', ')}`);
        }

        const position = coin.listingRank ?? index + 1;
        const marketCap = coin.marketCap ?? coin.selfReportedMarketCap;
        if (marketCap === undefined || marketCap === null) {
            throw new Error(`CoinMarketCap trending API item ${index} missing fields: marketCap/selfReportedMarketCap`);
        }

        return {
            position: `${position}`,
            coinName: `${coin.tokenName}`,
            price: `${coin.priceUsd}`,
            _24hChange: `${coin.pricePercentageChange24h}`,
            _7dChange: `${coin.pricePercentageChange7d ?? ''}`,
            _30Change: `${coin.pricePercentageChange30d ?? ''}`,
            mcap: `${marketCap}`,
            _24hVol: `${coin.volume24h}`,
        };
    });
};

const getHtml = async (url: string, coinOfficialName?: string) => {
    const fullUrl = !coinOfficialName ? `${url}` : `${url}/${coinOfficialName?.toLowerCase()}`;

    log.info(`Fetching data from-${fullUrl}`);

    return await (
        await fetch(fullUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        })
    ).text();
};

const getCoinHtml = async (coinOfficialName: string): Promise<string> =>
    await getHtml('https://coinmarketcap.com/currencies', coinOfficialName);
