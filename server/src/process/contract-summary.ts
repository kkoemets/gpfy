import { DexContractSummary } from './api/dexguru/dex-contract-summary';

export interface ContractSummary {
  dexContractSummary: DexContractSummary;
  holdersAmount: string | null;
}
