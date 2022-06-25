import { DexContractSummary } from './api/dexguru/dex-contract-summary';
import fetch from 'node-fetch';
import { createLogger } from '../util/log';
import { InversifyContainer } from '../injection/inversify.container';
import { DexGuruApi } from './api/dexguru/dex-guru.api';
import { INVERSIFY_TYPES } from '../injection/inversify.types';
import { BscscanApi } from './api/bscscan/bscscan.api';
import { getCachedContractByName, setCachedContractByName } from './cache/token.cache.manager';
import { CoingeckoApi } from './api/coingecko/coingecko.api';
import { CoinmarketcapApi } from './api/coinmarketcap/coinmarketcap.api';

const log = createLogger();

export interface ContractSummary {
    dexContractSummary: DexContractSummary;
    holdersAmount: string | null;
}

export interface GreedIndex {
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
}

export const findGreedIndex = async (): Promise<GreedIndex> => {
    log.info('Finding greed index');
    const data = (await (
        await fetch(`https://api.alternative.me/fng`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
        })
    ).json()) as { data: object[] };

    log.info(data);

    return { ...(data.data[0] as GreedIndex) };
};

export const findSummary = async (contract: string): Promise<ContractSummary> => {
    log.info(`Finding summary for contract ${contract}`);
    const dexContractSummary: DexContractSummary = await InversifyContainer.get<DexGuruApi>(
        INVERSIFY_TYPES.DexGuruApi,
    ).findContractSummary({
        contract,
    });

    const { holdersAmount } =
        dexContractSummary.network === 'bsc'
            ? await InversifyContainer.get<BscscanApi>(INVERSIFY_TYPES.BscscanApi).findHolders({
                  bscContract: contract,
              })
            : {
                  holdersAmount: null,
              };
    return {
        dexContractSummary,
        holdersAmount,
    };
};

export const findSummaryByName = async (coinOfficialName: string): Promise<ContractSummary> => {
    log.info(`Finding for-${coinOfficialName}`);

    const contract =
        (await getCachedContractByName({ coinOfficialName })) ||
        (await InversifyContainer.get<CoingeckoApi>(INVERSIFY_TYPES.CoingeckoApi).findContract({ coinOfficialName })) ||
        (await InversifyContainer.get<CoinmarketcapApi>(INVERSIFY_TYPES.CoinmarketcapApi).findContract({
            coinOfficialName,
        }));
    if (!contract) {
        return Promise.reject(Error('Could not find summary (did not find contract address)'));
    }

    await setCachedContractByName({ coinOfficialName, contract });

    return await findSummary(contract);
};
