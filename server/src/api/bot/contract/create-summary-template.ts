import { ContractSummary } from '../../../process/contract-summary';

export const createSummaryTemplate = (summary: ContractSummary): string => {
  const {
    dexContractSummary: {
      description,
      priceUSD,
      txns24h,
      volume24hUSD,
      priceChange24h,
      liquidityUSD,
    },
    holdersAmount,
  } = summary;

  return `${description}
      Current price: $${round(priceUSD, 6)}
      Transactions (24h): ${txns24h}
      Volume: (24h): $${round(volume24hUSD, 2)}
      Price change (24h): $${round(priceChange24h, 6)}
      Liquidity: $${round(liquidityUSD, 2)}
      Holders: ${holdersAmount || 'N/A'}`;
};

const round = (num: number, decimals: number) =>
  +`${Math.round(Number(num + 'e+' + decimals))}e-${decimals}`;
