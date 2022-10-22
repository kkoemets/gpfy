import { CoinmarketcapApi, TrendingCoinData } from './coinmarketcap.api';
import { createLogger } from '../../../util/log';
import fetch from 'node-fetch';
import { RestClient } from '../rest.client';
import { parseTrendingTable } from './parse-trending-table';

const log = createLogger();

export class CoinmarketcapRestClient extends RestClient implements CoinmarketcapApi {
    async findMarketCapSummary(): Promise<{
        mcap: string;
        volume24H: string;
        btcDominance: string;
        ethDominance: string;
    }> {
        const html = await getHtml('https://coinmarketcap.com/');
        const document: Document = this.toDocument(html);
        const globalStatsContent = Array.from(document.getElementsByClassName('cmc-global-stats__inner-content'))
            ?.find((el) => el)
            ?.getElementsByTagName('span');
        console.log(globalStatsContent?.length);

        if (!globalStatsContent || globalStatsContent.length < 8) {
            return Promise.reject(Error('Could not find mcap global stats'));
        }

        const findDataFromAnchorElement = (index: number) =>
            globalStatsContent[index].getElementsByTagName('a')?.item(0)?.textContent || '';

        const mcapIndex = 2;
        const mcap = findDataFromAnchorElement(mcapIndex);
        log.info('Found market cap-' + mcap);

        const volume24HIndex = 3;
        const volume24H = findDataFromAnchorElement(volume24HIndex);
        log.info(`Found volume 24h-${volume24H}`);

        const dominanceIndex = 4;
        const dominanceData: string[] = findDataFromAnchorElement(dominanceIndex).split(/\s+/);

        const btcPercentageIndex = 1;
        const btcDominance = dominanceData[btcPercentageIndex];
        log.info(`Found found btc dominance-${btcDominance}`);

        const ethPercentageIndex = 3;
        const ethDominance = dominanceData[ethPercentageIndex];
        log.info(`Found found eth dominance-${ethDominance}`);

        return { mcap, volume24H, btcDominance, ethDominance };
    }

    async findContract({ coinOfficialName }: { coinOfficialName: string }): Promise<string | null> {
        const html = await getCoinHtml(coinOfficialName);
        const document: Document = this.toDocument(html);
        const achorElements: HTMLAnchorElement[] = Array.from(document.getElementsByTagName('a'));

        const findFromAnchorsTokenAddress = (hrefIncluesAnd: string) =>
            achorElements.find((el) => el.href.includes(hrefIncluesAnd))?.href.replace(hrefIncluesAnd, '');

        return (
            findFromAnchorsTokenAddress('https://bscscan.com/token/') ||
            findFromAnchorsTokenAddress('https://etherscan.io/token/') ||
            null
        );
    }

    async findCoinSummaryFromCmc({
        coinOfficialName,
    }: {
        coinOfficialName: string;
    }): Promise<{ valueText: string; value: string }[]> {
        log.info('Retrieving coin summary from coinmarketcap');
        const html: string = await getCoinHtml(coinOfficialName);
        const document: Document = this.toDocument(html);
        const htmlTableElements: HTMLTableElement[] = Array.from(document.getElementsByTagName('table'));

        log.debug('Tables found-' + htmlTableElements.length);
        if (!htmlTableElements.length) {
            return Promise.reject(Error('Could not find summary (missing data table)'));
        }

        const retrievedData: Promise<{ valueText: string; value: string }[]> = htmlTableElements
            .map((table: HTMLTableElement) => slice(table.rows))
            .find((rows: HTMLTableRowElement[]) => {
                return rows.find((row: HTMLTableRowElement) => row.innerHTML?.includes('Price'));
            })
            ?.map((elements: HTMLTableElement) => {
                const getHtmlTableCellElements = (tagName: string) =>
                    elements.getElementsByTagName(tagName).item(0)?.lastChild?.textContent || '';

                return {
                    valueText: getHtmlTableCellElements('th'),
                    value: getHtmlTableCellElements('td'),
                };
            });
        log.info(`Retrieved data${JSON.stringify(retrievedData)}`);

        return retrievedData;
    }

    async findTrendingCoins(): Promise<TrendingCoinData[]> {
        return parseTrendingTable({
            trendingHtmlPage: await getHtml('https://coinmarketcap.com/trending-cryptocurrencies/'),
        });
    }
}

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

const slice = (elements: NodeListOf<HTMLElement> | HTMLCollectionOf<HTMLElement>) =>
    Array.prototype.slice.call(elements);
