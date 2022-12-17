import { ContractSummary } from 'crypto-data/lib/src/process/crypto-data';
import { CoinsPrices } from './data.service';

export const createSummaryTemplate = (summary: ContractSummary): string => {
    const {
        dexContractSummary: { description, priceUSD, txns24h, volume24hUSD, priceUSDChange24h, liquidityUSD, AMM },
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

export const createSummaryTemplateFromCmcSummary = (summary: { valueText: string; value: string }[]): string => {
    const emojis = ['💵', '↔', '🧐', '💸', '💳', '🐂', '✊'];
    const uniqueEmojiCount: number = emojis.length;
    return summary
        .map(({ valueText, value }, index) => {
            const circularIndex: number = ((index % uniqueEmojiCount) + uniqueEmojiCount) % uniqueEmojiCount;
            return `${emojis[circularIndex] + valueText}: 
         ${value}\n`;
        })
        .join('');
};

export const createMarketCapSummaryTemplate = ({
    mcap,
    volume24H,
    btcDominance,
    ethDominance,
    fearIndex,
    fearClass,
}: {
    mcap: string;
    volume24H: string;
    btcDominance: string;
    ethDominance: string;
    fearIndex: string;
    fearClass: string;
}): string => {
    return `💰Market Cap: 
        ${mcap}
💱Volume 24h: 
        ${volume24H}
💲BTC dominance:
        ${btcDominance}
🦄ETH dominance: 
        ${ethDominance}
${Number(fearIndex) > 50 ? '🐂' : '🐻'}Fear/Greed index: 
        ${fearIndex}
🦈Fear classification: 
        ${fearClass}`;
};

export const createBagSummaryTemplate = (coinPrices: CoinsPrices) => {
    const formatCurrency = (currency) => (currency === 'USD' ? '$' : currency);

    return `💰Bag value: ${coinPrices.totalValue.amount}${formatCurrency(
        coinPrices.totalValue.currency,
    )}${coinPrices.prices
        .map(({ coinFullName, fullUnitPrice, amount, amountPrice, currency }, index) => {
            const formattedCurrency = formatCurrency(currency);
            return `\n  ${index + 1}. ${coinFullName.toUpperCase()}
    💲Unit price: ${formattedCurrency}${fullUnitPrice}
    🏧Amount: ${amount}
    💹Price: ${formattedCurrency}${amountPrice}`;
        })
        .join('')}`;
};

const round = (num: number, decimals: number) => +`${Math.round(Number(num + 'e+' + decimals))}e-${decimals}`;
