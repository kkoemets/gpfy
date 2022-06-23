import { toDocument } from '../document';
import { TrendingCoinData } from './coinmarketcap.api';

export const parseTrendingTable: ({ trendingHtmlPage }: { trendingHtmlPage: string }) => TrendingCoinData[] = ({
    trendingHtmlPage,
}: {
    trendingHtmlPage: string;
}) => {
    const document: Document = toDocument(trendingHtmlPage);
    const table: HTMLTableElement | undefined = Array.from(document.getElementsByTagName('table')).find(isTruthy);
    if (!table) {
        return [];
    }

    return createData(table);
};

const createData = (table: HTMLTableElement) => {
    const ignoredDataCells: number[] = [0, 9, 10];

    const isNameCell = (index: number): boolean => index === 1;

    return Array.from(Array.from(table.tBodies).find(isTruthy)?.rows || [])
        .map((row) => Array.from(row.getElementsByTagName('td')))
        .map((dataCells) => {
            const values = dataCells
                .filter((_, index) => !ignoredDataCells.includes(index))
                .map((cell, index) =>
                    index === 0 ? (Array.from(cell.getElementsByTagName('p')).find(isTruthy) as HTMLElement) : cell,
                )
                .map((cell, index) =>
                    isNameCell(index)
                        ? (Array.from(cell.getElementsByTagName('p')).find(isTruthy) as HTMLElement)
                        : cell,
                )
                .map((cell) => cell?.innerHTML || '')
                .map((value) => {
                    const priceChange = value.match('(?<=</span>)(.*?)(?=<!--)')?.find(isTruthy);
                    if (!priceChange) {
                        return value;
                    }
                    const isDown: boolean = value.includes('down');
                    return `${isDown ? '-' : ''}${priceChange}`;
                })
                .map((value) => value.match('(?<=<span>)(.*?)(?=</span>)')?.find(isTruthy) || value)
                .map((value: string) => value.replace(/\s{2,}/g, ' ').trim());

            return {
                position: values[0],
                coinName: values[1],
                price: values[2],
                _24hChange: `${values[3]}%`,
                _7dChange: `${values[4]}%`,
                _30Change: `${values[5]}%`,
                mcap: values[6],
                _24hVol: values[7],
            } as unknown as TrendingCoinData;
        });
};

const isTruthy = (el: never) => el;
