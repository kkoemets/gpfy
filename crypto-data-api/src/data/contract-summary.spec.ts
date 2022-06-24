import * as fs from 'fs';
import { ContractSummary } from 'crypto-data/lib/src/process/crypto-data';
import { createSummaryTemplate } from './contract-summary';

describe('contactSummary', function () {
    it('Correct format', function () {
        const summary: ContractSummary = JSON.parse(
            fs.readFileSync(__dirname + '/../../test/resources/test-contract-summary.json').toString(),
        );

        const actual = createSummaryTemplate(summary);

        const expected =
            'CumRocket/CUMMIES\n' +
            '      💵Current price: \n' +
            '            $0.03421\n' +
            '      💳Transactions (24h): \n' +
            '            1008\n' +
            '      ↔Volume: (24h): \n' +
            '            $212257.5\n' +
            '      🧐Price change (24h): \n' +
            '            $0.051202\n' +
            '      💸Liquidity: \n' +
            '            $1312827.51\n' +
            '      🤴🏼Holders (BSC): \n' +
            '            N/A \n' +
            '      📈Stats provided by: \n' +
            '            PANCAKESWAP';
        expect(actual).toEqual(expected);
    });
});
