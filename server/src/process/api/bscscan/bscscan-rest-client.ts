import { BscscanApi } from './bscscan-api';
import fetch from 'node-fetch';
import { getLogger } from '../../../util/get-logger';
import { RestClient } from '../rest-client';

const log = getLogger();

export class BscscanRestClient extends RestClient implements BscscanApi {
  async findHolders({
    bscContract,
  }: {
    bscContract: string;
  }): Promise<{ holdersAmount: string }> {
    log.info(`Find holders for token-${bscContract}`);

    const removeNonNumeric = () => (row: string) => row.replace(/\D/g, '');

    const holdersAmount: string =
      (
        await (
          await fetch(`https://bscscan.com/token/${bscContract}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          })
        ).text()
      )
        .split(/\r?\n/)
        .filter((row: string) => row.includes('addresses'))
        .map(removeNonNumeric())
        .find((row: string) => row) || '0';

    log.info(`Amount of holders found-${holdersAmount}`);
    return { holdersAmount };
  }
}
