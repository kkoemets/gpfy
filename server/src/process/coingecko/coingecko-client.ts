import { getLogger } from '../../util/get-logger';
import fetch from 'node-fetch';

const log = getLogger();

export const findContract = async ({
  coinOfficialName,
}: {
  coinOfficialName: string;
}): Promise<string | null> => {
  log.info(`Trying to find contract for token by name-${coinOfficialName}`);
  return (
    (
      await (
        await fetch(
          `https://www.coingecko.com/en/coins/${coinOfficialName.toLowerCase()}`,
          {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          },
        )
      ).text()
    )
      .split(/\r?\n/)
      .filter((row: string) => row.includes('data-address'))
      .map((row) => row.match(new RegExp(/data-address="(.*?)" data-symbol/i)))
      .filter((regexResult) => regexResult)
      .map((arr) => arr && arr[1])
      .find((token) => token) || null
  );
};
