import { ContractSummary } from '../../../process/contract-summary';

export const createSummaryTemplate = (summary: ContractSummary): string => {
  const {
    dexContractSummary: {
      description,
      priceUSD,
      txns24h,
      volume24hUSD,
      priceUSDChange24h,
      liquidityUSD,
      AMM,
    },
    holdersAmount,
  } = summary;

  return `${description}
      💵Current price: 
            $${round(priceUSD, 6)}
      💳Transactions (24h): 
            ${txns24h}
      ↔Volume: (24h): 
            $${round(volume24hUSD, 2)}
      🧐Price change (24h): 
            $${round(priceUSDChange24h, 6)}
      💸Liquidity: 
            $${round(liquidityUSD, 2)}
      🤴🏼Holders (BSC): 
            ${holdersAmount || 'N/A'} 
      📈Stats provided by: 
            ${AMM?.toUpperCase()}`;
};

export const createSummaryTemplateFromCmcSummary = (
  summary: { valueText: string; value: string }[],
): string => {
  return summary
    .map(
      ({ valueText, value }) =>
        `
      ${valueText}: 
            $${value}`,
    )
    .join();
};

const round = (num: number, decimals: number) =>
  +`${Math.round(Number(num + 'e+' + decimals))}e-${decimals}`;
