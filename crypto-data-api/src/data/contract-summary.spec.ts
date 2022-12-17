import * as fs from 'fs';
import { ContractSummary } from 'crypto-data/lib/src/process/crypto-data';
import { createBagSummaryTemplate, createSummaryTemplate } from './contract-summary';
import { CoinsPrices } from './data.service';

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

    it('Bag summary', function () {
        const data: CoinsPrices = JSON.parse(
            fs.readFileSync(__dirname + '/../../test/resources/test-bag-data.json').toString(),
        );

        const actual = createBagSummaryTemplate(data);

        const expected =
            '💰Bag value: 5064.01$\n' +
            '  1. BITCOIN\n' +
            '    💲Unit price: $16715.52\n' +
            '    🏧Amount: 0.17275\n' +
            '    💹Price: $2887.60\n' +
            '  2. ETHEREUM\n' +
            '    💲Unit price: $1181.00\n' +
            '    🏧Amount: 0.6639\n' +
            '    💹Price: $784.06\n' +
            '  3. CHAINLINK\n' +
            '    💲Unit price: $6.00\n' +
            '    🏧Amount: 11.995\n' +
            '    💹Price: $71.97\n' +
            '  4. POLKADOT\n' +
            '    💲Unit price: $4.69\n' +
            '    🏧Amount: 131.1\n' +
            '    💹Price: $614.85\n' +
            '  5. BNB\n' +
            '    💲Unit price: $238.93\n' +
            '    🏧Amount: 1.337\n' +
            '    💹Price: $319.44\n' +
            '  6. DASH\n' +
            '    💲Unit price: $42.72\n' +
            '    🏧Amount: 1.9279\n' +
            '    💹Price: $82.35\n' +
            '  7. SOLANA\n' +
            '    💲Unit price: $12.32\n' +
            '    🏧Amount: 4.002\n' +
            '    💹Price: $49.30\n' +
            '  8. DOGECOIN\n' +
            '    💲Unit price: $0.0775\n' +
            '    🏧Amount: 651.3\n' +
            '    💹Price: $50.47\n' +
            '  9. MONERO\n' +
            '    💲Unit price: $142.73\n' +
            '    🏧Amount: 0.81973086\n' +
            '    💹Price: $117.00\n' +
            '  10. IOTA\n' +
            '    💲Unit price: $0.1697\n' +
            '    🏧Amount: 512.556\n' +
            '    💹Price: $86.98';
        expect(actual).toEqual(expected);
    });
});
