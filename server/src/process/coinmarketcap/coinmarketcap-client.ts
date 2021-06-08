import { getLogger } from '../../util/get-logger';
import fetch from 'node-fetch';

const log = getLogger();

export const findContract = async ({
  coinOfficialName,
}: {
  coinOfficialName: string;
}): Promise<string | null> => {
  log.info(`Trying to find contract for token by name-${coinOfficialName}`);
  const html = await (
    await fetch(
      `https://coinmarketcap.com/currencies/${coinOfficialName.toLowerCase()}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      },
    )
  ).text();

  const beginTokenIdentifier = '"contractAddress":"';
  const indexOfStartingPositionOfContract = html.indexOf(beginTokenIdentifier);
  if (!indexOfStartingPositionOfContract) {
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
