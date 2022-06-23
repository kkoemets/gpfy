import { DexContractSummary } from './dex-contract-summary';

export interface DexGuruApi {
    findContractSummary: ({ contract }: { contract: string }) => Promise<DexContractSummary>;
}
