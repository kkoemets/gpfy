import { getLogger } from "../../util/get-logger";
import fetch from "node-fetch";

import { JSDOM } from "jsdom";

const log = getLogger();

export const findContract = async ({
  coinOfficialName,
}: {
  coinOfficialName: string;
}): Promise<string | null> => {
  log.info(`Trying to find contract for token by name-${coinOfficialName}`);
  const html = await getHtml(
    "https://coinmarketcap.com/currencies",
    coinOfficialName
  );

  const beginTokenIdentifier = '"contractAddress":"';
  const indexOfStartingPositionOfContract = html.indexOf(beginTokenIdentifier);
  if (indexOfStartingPositionOfContract < 0) {
    log.info("Did not find contract by contact address");
    const document: Document = new JSDOM(html).window.document;
    const etherscan = "https://etherscan.io/token/";

    const contractByEtherScan = (Array.prototype.slice.call(
      document.querySelectorAll("a")
    ) as HTMLAnchorElement[])
      .map(({ href }) => href)
      .find((href) => href.includes(etherscan))
      ?.replace(etherscan, "");

    if (contractByEtherScan) {
      log.info(
        `Contract-${contractByEtherScan} by etherscan in anchor elements`
      );
      return contractByEtherScan;
    }

    return null;
  }

  const stringStartingWithContract = html
    .substring(indexOfStartingPositionOfContract)
    .substring(beginTokenIdentifier.length);
  return stringStartingWithContract.substring(
    0,
    stringStartingWithContract.indexOf('"')
  );
};

export const findMarketCapSummary = async (): Promise<{
  mcap: string;
  volume24H: string;
  btcDominance: string;
  ethDominance: string;
}> => {
  const html = await getHtml("https://coinmarketcap.com/");

  const findValue = (start: string, end: string) => {
    return html.substring(
      html.indexOf(start) + start.length,
      html.indexOf(end)
    );
  };

  const mcap = findValue(
    'href="/charts/" class="cmc-link">',
    '</a></span><span class="sc-2bz68i-0 cVPJov">24h Vol'
  );
  log.info("Found market cap-" + mcap);

  const volume24H = findValue(
    '24h Vol<!-- -->:  <a href="/charts/" class="cmc-link">',
    '</a></span><span class="sc-2bz68i-0 cVPJov">Dominance'
  );
  log.info(`Found volume 24h-${volume24H}`);

  const btcDominance = findValue(
    'dominance-percentage" class="cmc-link">BTC<!-- -->: <!-- -->',
    "<!-- --> <!-- -->ETH"
  );
  log.info(`Found found btc dominance-${btcDominance}`);

  const ethDominance = findValue(
    "<!-- -->ETH<!-- -->: <!-- -->",
    '</a></span><span class="sc-2bz68i-0 cVPJov"><span class="icon-Gas-Filled"'
  );
  log.info(`Found found eth dominance-${ethDominance}`);

  return { mcap, volume24H, btcDominance, ethDominance };
};

async function getHtml(url: string, coinOfficialName?: string) {
  const fullUrl = !coinOfficialName
    ? `${url}`
    : `${url}/${coinOfficialName?.toLowerCase()}`;

  log.info(`Fetching data from-${fullUrl}`);

  return await (
    await fetch(fullUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    })
  ).text();
}
