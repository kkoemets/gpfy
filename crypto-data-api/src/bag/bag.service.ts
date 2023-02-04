import { Injectable } from '@nestjs/common';
import { createBagSummaryTemplate } from '../common/summary';
import { findCoinSummaryFromCmc } from 'crypto-data';

export type CoinPrice = {
    coinFullName: string;
    fullUnitPrice: string;
    amount: string;
    amountPrice: string;
    currency: string;
};

export type CoinsPrices = {
    prices: CoinPrice[];
    totalValue: { amount: string; currency: string; btc: string };
    btcPrice: CoinPrice;
};

@Injectable()
export class BagService {
    findBagSummary = async (
        data: {
            coinOfficialName: string;
            amount: number;
        }[],
    ): Promise<{ bagSummary: string }> => {
        return { bagSummary: createBagSummaryTemplate(await this.findCoinsPricesInUsd({ data })) };
    };

    findCoinPriceInUsd = async (coinOfficialName: string, amount: number): Promise<CoinPrice> => {
        const fullUnitPrice: string =
            (await findCoinSummaryFromCmc({ coinOfficialName }))
                .find(({ valueText }) => valueText)
                ?.value.replace(new RegExp(/[$,]/g), '') || '';

        return {
            coinFullName: coinOfficialName,
            fullUnitPrice,
            amountPrice: (amount * Number(fullUnitPrice)).toString(),
            currency: 'USD',
            amount: amount.toString(),
        } as CoinPrice;
    };

    findCoinsPricesInUsd: ({ data }: { data: { coinOfficialName: string; amount: number }[] }) => Promise<CoinsPrices> =
        async ({
            data,
        }: {
            data: {
                coinOfficialName: string;
                amount: number;
            }[];
        }): Promise<CoinsPrices> => {
            const btcPrice: CoinPrice = await this.findCoinPriceInUsd('bitcoin', 1);

            const prices: CoinPrice[] = await Promise.all(
                data.map(({ coinOfficialName, amount }) => this.findCoinPriceInUsd(coinOfficialName, amount)),
            );

            const totalValueInFiat: { amount: string; currency: string } = {
                amount: prices
                    .map(({ amountPrice }) => amountPrice)
                    .map(Number)
                    .reduce((a, b) => a + b)
                    .toString(),
                currency: prices.find((e) => e)?.currency || 'USD',
            };

            return {
                prices,
                totalValue: {
                    ...totalValueInFiat,
                    btc: Number(
                        (Number(totalValueInFiat.amount) / Number(btcPrice.fullUnitPrice)).toFixed(8),
                    ).toString(),
                },
                btcPrice: btcPrice,
            };
        };
}
