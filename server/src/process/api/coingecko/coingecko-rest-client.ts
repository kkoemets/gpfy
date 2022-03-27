import { CoingeckoApi } from './coingecko-api';
import fetch from 'node-fetch';
import { getLogger } from '../../../util/get-logger';
import { RestClient } from '../rest-client';

const log = getLogger();

export class CoingeckoRestClient extends RestClient implements CoingeckoApi {
  async findContract({
    coinOfficialName,
  }: {
    coinOfficialName: string;
  }): Promise<string | null> {
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
        .map((row) =>
          row.match(new RegExp(/data-address="(.*?)" data-symbol/i)),
        )
        .filter((regexResult) => regexResult)
        .map((arr) => arr && arr[1])
        .find((token) => token) || null
    );
  }
}
