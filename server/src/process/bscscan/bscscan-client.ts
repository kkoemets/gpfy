import { getLogger } from '../../util/get-logger';
import fetch from 'node-fetch';

const log = getLogger();
export const findHolders = async ({
  bscContract,
}: {
  bscContract: string;
}): Promise<{ holdersAmount: string }> => {
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
};
