import { getLogger } from '../../util/get-logger';
import fetch from 'node-fetch';

const log = getLogger();

export const findContract = async ({
  coinOfficialName,
}: {
  coinOfficialName: string;
}): Promise<string | null> => {
  log.info(`Trying to find contract for token by name-${coinOfficialName}`);
  const html = await getHtml(
    'https://coinmarketcap.com/currencies',
    coinOfficialName,
  );

  const beginTokenIdentifier = '"contractAddress":"';
  const indexOfStartingPositionOfContract = html.indexOf(beginTokenIdentifier);
  if (indexOfStartingPositionOfContract < 0) {
    log.info('Did not find contract');
    return null;
  }

  const stringStartingWithContract = html
    .substring(indexOfStartingPositionOfContract)
    .substring(beginTokenIdentifier.length);
  return stringStartingWithContract.substring(
    0,
    stringStartingWithContract.indexOf('"'),
  );
};

export const findMarketCapSummary = async (): Promise<{ mcap: string }> => {
  const html = await getHtml('https://coinmarketcap.com/');
  const start = 'href="/charts/" class="cmc-link">';
  const end = '</a></span><span class="sc-2bz68i-0 cVPJov">24h Vol';

  const mcap = html.substring(
    html.indexOf(start) + start.length,
    html.indexOf(end),
  );
  log.info('Found market cap-' + mcap);

  return { mcap };
};

async function getHtml(url: string, coinOfficialName?: string) {
  return await (
    await fetch(
      !coinOfficialName
        ? `${url}`
        : `${url}/${coinOfficialName?.toLowerCase()}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      },
    )
  ).text();
}
