import * as numeral from 'numeral';

import { ContractSummary } from 'crypto-data/lib/src/process/crypto-data';
import { CoinsPrices } from './data.service';

export const createSummaryTemplate = (summary: ContractSummary): string => {
    const {
        dexContractSummary: { description, priceUSD, txns24h, volume24hUSD, priceUSDChange24h, liquidityUSD, AMM },
        holdersAmount,
    } = summary;

    const round = (num: number, format: string) => numeral(num).format(format);

    return `${description}
      💵Current price:
            $${round(priceUSD, '0,0.000000')}
      💳Transactions (24h):
            ${txns24h}
      ↔Volume: (24h):
            $${round(volume24hUSD, '0,0.00')}
      🧐Price change (24h):
            $${round(priceUSDChange24h, '0,0.000000')}
      💸Liquidity:
            $${round(liquidityUSD, '0,0.00')}
      🤴🏼Holders (BSC):
            ${holdersAmount || 'N/A'} 
      📈Stats provided by:
            ${AMM?.toUpperCase()}`;
};

export const createSummaryTemplateFromCmcSummary = (summary: { valueText: string; value: string }[]): string => {
    const emojis = ['💵', '↔', '🧐', '💸', '💳', '🐂', '✊'];

    // count helps to circle through the emojis
    const uniqueEmojiCount: number = emojis.length;
    return summary
        .map(({ valueText, value }, index) => {
            // We circle through the array because we can not be sure about the size of summary
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
    // Higher number is bullish, lower number is more bearish
    const fearEmoji: string = Number(fearIndex) > 50 ? '🐂' : '🐻';
    return `💰Market Cap: 
        ${mcap}
💱Volume 24h: 
        ${volume24H}
💲BTC dominance:
        ${btcDominance}
🦄ETH dominance: 
        ${ethDominance}
${fearEmoji}Fear/Greed index: 
        ${fearIndex}
🦈Fear classification: 
        ${fearClass}`;
};

export const createBagSummaryTemplate = (coinPrices: CoinsPrices) => {
    const formatCurrency = (currency) => (currency === 'USD' ? '$' : currency);

    const formatAmount = (string) =>
        string.substring(0, Math.min(string.length, 4)) === '0.00'
            ? Number(
                  Number(string)
                      .toFixed(20)
                      .match(/^-?\d*\.?0*\d{0,4}/)[0],
              ).toString()
            : string.match(new RegExp('^(\\d+.\\d{2})\\d*$'))[1];

    const { amount, btc, currency }: { amount: string; currency: string; btc: string } = coinPrices.totalValue;
    return `💰Bag value: ${formatCurrency(currency)}${formatAmount(amount)} / ₿${btc}${coinPrices.prices
        .map(({ coinFullName, fullUnitPrice, amount, amountPrice, currency }, index) => {
            const formattedCurrency = formatCurrency(currency);

            const calculatePriceInBtc = () =>
                Number((Number(amountPrice) / Number(coinPrices.btcPrice.fullUnitPrice)).toFixed(8))
                    .toFixed(8)
                    .toString();

            return `\n  ${index + 1}. ${coinFullName.toUpperCase()}
    💲Unit price: ${formattedCurrency}${formatAmount(fullUnitPrice)}
    🏧Amount: ${amount}
    💹Price: ${formattedCurrency}${formatAmount(amountPrice)}
      ₿ ${calculatePriceInBtc()}`;
        })
        .join('')}`;
};

export const createTrendingCoinsSummary = (
    data: { position: string; coinName: string; price: string; _24hChange: string; mcap: string }[],
): string => {
    return data
        .map(
            ({ position, coinName, price, _24hChange, mcap }) =>
                `#${position} ${coinName}
      💵${price}
      2️⃣4️⃣↕️${_24hChange}
      🐂${mcap} `,
        )
        .join('\n');
};
