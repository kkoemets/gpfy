import { CoinmarketcapApi } from './coinmarketcap-api';
import { getLogger } from '../../../util/get-logger';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { COULD_NOT_FIND_CONTRACT } from '../../../rest/controller-api/api-errors';
import { RestClient } from '../rest-client';

const log = getLogger();

export class CoinmarketcapRestClient
  extends RestClient
  implements CoinmarketcapApi
{
  async findMarketCapSummary(): Promise<{
    mcap: string;
    volume24H: string;
    btcDominance: string;
    ethDominance: string;
  }> {
    const html = await getHtml('https://coinmarketcap.com/');

    const findValue = (start: string, end: string) => {
      return html.substring(
        html.indexOf(start) + start.length,
        html.indexOf(end),
      );
    };

    const mcap = findValue(
      'href="/charts/" class="cmc-link">',
      '</a></span><span class="sc-2bz68i-0 cVPJov">24h Vol',
    );
    log.info('Found market cap-' + mcap);

    const volume24H = findValue(
      '24h Vol<!-- -->:  <a href="/charts/" class="cmc-link">',
      '</a></span><span class="sc-2bz68i-0 cVPJov">Dominance',
    );
    log.info(`Found volume 24h-${volume24H}`);

    const btcDominance = findValue(
      'dominance-percentage" class="cmc-link">BTC<!-- -->: <!-- -->',
      '<!-- --> <!-- -->ETH',
    );
    log.info(`Found found btc dominance-${btcDominance}`);

    const ethDominance = findValue(
      '<!-- -->ETH<!-- -->: <!-- -->',
      '</a></span><span class="sc-2bz68i-0 cVPJov"><span class="icon-Gas-Filled"',
    );
    log.info(`Found found eth dominance-${ethDominance}`);

    return { mcap, volume24H, btcDominance, ethDominance };
  }

  async findContract({
    coinOfficialName,
  }: {
    coinOfficialName: string;
  }): Promise<string | null> {
    const html = await getCoinHtml(coinOfficialName);
    const document: Document = toDocument(html);
    const achorElements: HTMLAnchorElement[] = Array.from(
      document.getElementsByTagName('a'),
    );

    const findFromAnchorsTokenAddress = (hrefIncluesAnd: string) =>
      achorElements
        .find((el) => el.href.includes(hrefIncluesAnd))
        ?.href.replace(hrefIncluesAnd, '');

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
    const document: Document = toDocument(html);
    const htmlTableElements: HTMLTableElement[] = Array.from(
      document.getElementsByTagName('table'),
    );

    log.debug('Tables found-' + htmlTableElements.length);
    if (!htmlTableElements.length) {
      return COULD_NOT_FIND_CONTRACT();
    }

    const retrievedData: Promise<{ valueText: string; value: string }[]> =
      htmlTableElements
        .map((table: HTMLTableElement) => slice(table.rows))
        .find((rows: HTMLTableRowElement[]) => {
          return rows.find((row: HTMLTableRowElement) =>
            row.innerHTML?.includes('Price'),
          );
        })
        ?.map((elements: HTMLTableElement) => {
          const getHtmlTableCellElements = (tagName: string) =>
            elements.getElementsByTagName(tagName).item(0)?.lastChild
              ?.textContent || '';

          return {
            valueText: getHtmlTableCellElements('th'),
            value: getHtmlTableCellElements('td'),
          };
        });
    log.info(`Retrieved data${JSON.stringify(retrievedData)}`);

    return retrievedData;
  }
}

const getHtml = async (url: string, coinOfficialName?: string) => {
  const fullUrl = !coinOfficialName
    ? `${url}`
    : `${url}/${coinOfficialName?.toLowerCase()}`;

  log.info(`Fetching data from-${fullUrl}`);

  return await (
    await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
  ).text();
};

const getCoinHtml = async (coinOfficialName: string): Promise<string> =>
  await getHtml('https://coinmarketcap.com/currencies', coinOfficialName);

export const findContract = async ({
  coinOfficialName,
}: {
  coinOfficialName: string;
}): Promise<string | null> => {
  const html = await getCoinHtml(coinOfficialName);

  const beginTokenIdentifier = '"contractAddress":"';
  const indexOfStartingPositionOfContract = html.indexOf(beginTokenIdentifier);
  if (indexOfStartingPositionOfContract < 0) {
    log.info(`Trying to find contract for token by name-${coinOfficialName}`);
    const findFromAnchorHref: (url: string) => string | null = (url: string) =>
      findContractFromAnchorHref(html, url);

    return (
      ['https://bscscan.com/token/', 'https://etherscan.io/token/']
        .map(findFromAnchorHref)
        .find((c) => c) || null
    );
  }

  const stringStartingWithContract = html
    .substring(indexOfStartingPositionOfContract)
    .substring(beginTokenIdentifier.length);
  return stringStartingWithContract.substring(
    0,
    stringStartingWithContract.indexOf('"'),
  );
};

const findContractFromAnchorHref: (
  html: string,
  url: string,
) => string | null = (html: string, url: string) => {
  log.info('Did not find contract by contact address');
  const document = toDocument(html);

  const contractByLink = (
    slice(document.querySelectorAll('a')) as HTMLAnchorElement[]
  )
    .map(({ href }) => href)
    .find((href) => href.includes(url))
    ?.replace(url, '');

  if (contractByLink) {
    log.info(`Contract-${contractByLink} by ${url} in anchor elements`);
    return contractByLink;
  }

  return null;
};

const slice = (
  elements: NodeListOf<HTMLElement> | HTMLCollectionOf<HTMLElement>,
) => Array.prototype.slice.call(elements);

const toDocument = (html: string): Document => new JSDOM(html).window.document;
