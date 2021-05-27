import { ContractSummary } from '../../../process/dexguru/contract-summary';

export const createSummaryTemplate = (summary: ContractSummary): string => {
  const {
    description,
    priceUSD,
    txns24h,
    volume24hUSD,
    priceChange24h,
    liquidityUSD,
  } = summary;

  return `${description}
      Current price: $${round(priceUSD, 6)}
      Transactions (24h): ${txns24h}
      Volume: (24h): $${round(volume24hUSD, 2)}
      Price change (24h): $${round(priceChange24h, 6)}
      Liquidity: $${round(liquidityUSD, 2)}`;
};

const round = (num, decimals) =>
  +`${Math.round(Number(num + 'e+' + decimals))}e-${decimals}`;
