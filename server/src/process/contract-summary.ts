import { DexContractSummary } from './dexguru/dex-contract-summary';

export interface ContractSummary {
  dexContractSummary: DexContractSummary;
  holdersAmount: string | null;
}