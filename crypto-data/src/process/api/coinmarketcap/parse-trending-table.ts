import { toDocument } from '../document';
import { TrendingCoinData } from './coinmarketcap.api';

export const parseTrendingTable: ({ trendingHtmlPage }: { trendingHtmlPage: string }) => TrendingCoinData[] = ({
    trendingHtmlPage,
}: {
    trendingHtmlPage: string;
}) => {
    const document: Document = toDocument(trendingHtmlPage);
    const trendingCoinsTable: HTMLTableElement | undefined = Array.from(document.getElementsByTagName('table')).find(
        isTruthy,
    );
    if (!trendingCoinsTable) {
        return [];
    }

    return createData(trendingCoinsTable);
};

const createData = (trendingCoinsTable: HTMLTableElement) => {
    const ignoredCoinsDataCells: number[] = [0, 9, 10];

    const isCoinNameCell = (index: number): boolean => index === 1;

    return Array.from(Array.from(trendingCoinsTable.tBodies).find(isTruthy)?.rows || [])
        .map((row) => Array.from(row.getElementsByTagName('td')))
        .map((tableDataCells) => {
            const formattedTrendingData = tableDataCells
                .filter((_, index) => !ignoredCoinsDataCells.includes(index))
                .map((cell, index) =>
                    index === 0 ? (Array.from(cell.getElementsByTagName('p')).find(isTruthy) as HTMLElement) : cell,
                )
                .map((cell, index) =>
                    isCoinNameCell(index)
                        ? (Array.from(cell.getElementsByTagName('p')).find(isTruthy) as HTMLElement)
                        : cell,
                )
                .map((cell) => cell?.innerHTML || '')
                .map((value) => {
                    const priceChange = value.match('(?<=</span>)(.*?)(?=</span>)')?.find(isTruthy);
                    if (!priceChange) {
                        return value;
                    }
                    const isDown: boolean = value.includes('down');
                    return `${isDown ? '-' : ''}${priceChange}`;
                })
                .map((value) => value.match('(?<=<span>)(.*?)(?=</span>)')?.find(isTruthy) || value)
                .map((value) => value.match('(?<=">)(.*)(?=<\\/p>)')?.find(isTruthy) || value)
                .map((value: string) => value.replace(/\s{2,}/g, ' ').trim());

            return {
                position: formattedTrendingData[0],
                coinName: formattedTrendingData[1],
                price: formattedTrendingData[2],
                _24hChange: `${formattedTrendingData[3]}`,
                _7dChange: `${formattedTrendingData[4]}`,
                _30Change: `${formattedTrendingData[5]}`,
                mcap: formattedTrendingData[6],
                _24hVol: formattedTrendingData[7],
            } as unknown as TrendingCoinData;
        });
};

const isTruthy = (el: never) => el;
