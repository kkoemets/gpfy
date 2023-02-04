import * as fs from 'fs';
import { createBagSummaryTemplate, createTrendingCoinsSummary } from './summary';
import { CoinsPrices } from '../data/data.service';

describe('contactSummary', function () {
    it('Bag summary', function () {
        const data: CoinsPrices = JSON.parse(
            fs.readFileSync(__dirname + '/../../test/resources/test-bag-data.json').toString(),
        );

        const actual = createBagSummaryTemplate(data);

        const expected =
            '💰Bag value: $5064.01 / ₿1.432400\n' +
            '  1. BITCOIN\n' +
            '    💲Unit price: $16715.52\n' +
            '    🏧Amount: 0.17275\n' +
            '    💹Price: $2887.60\n' +
            '      ₿ 0.17274964\n' +
            '  2. ETHEREUM\n' +
            '    💲Unit price: $1181.00\n' +
            '    🏧Amount: 0.6639\n' +
            '    💹Price: $784.06\n' +
            '      ₿ 0.04690611\n' +
            '  3. CHAINLINK\n' +
            '    💲Unit price: $6.00\n' +
            '    🏧Amount: 11.995\n' +
            '    💹Price: $71.97\n' +
            '      ₿ 0.00430558\n' +
            '  4. POLKADOT\n' +
            '    💲Unit price: $4.69\n' +
            '    🏧Amount: 131.1\n' +
            '    💹Price: $614.85\n' +
            '      ₿ 0.03678318\n' +
            '  5. BNB\n' +
            '    💲Unit price: $238.93\n' +
            '    🏧Amount: 1.337\n' +
            '    💹Price: $319.44\n' +
            '      ₿ 0.01911038\n' +
            '  6. DASH\n' +
            '    💲Unit price: $42.72\n' +
            '    🏧Amount: 1.9279\n' +
            '    💹Price: $82.35\n' +
            '      ₿ 0.00492656\n' +
            '  7. SOLANA\n' +
            '    💲Unit price: $12.32\n' +
            '    🏧Amount: 4.002\n' +
            '    💹Price: $49.30\n' +
            '      ₿ 0.00294935\n' +
            '  8. DOGECOIN\n' +
            '    💲Unit price: $0.07\n' +
            '    🏧Amount: 651.3\n' +
            '    💹Price: $50.47\n' +
            '      ₿ 0.00301935\n' +
            '  9. MONERO\n' +
            '    💲Unit price: $142.73\n' +
            '    🏧Amount: 0.81973086\n' +
            '    💹Price: $117.00\n' +
            '      ₿ 0.00699948\n' +
            '  10. IOTA\n' +
            '    💲Unit price: $0.16\n' +
            '    🏧Amount: 512.556\n' +
            '    💹Price: $86.98\n' +
            '      ₿ 0.00520355\n' +
            '  11. KNOW\n' +
            '    💲Unit price: $0.00012\n' +
            '    🏧Amount: 512.556\n' +
            '    💹Price: $0.00012\n' +
            '      ₿ 0.00000001\n' +
            '  12. NOME\n' +
            '    💲Unit price: $0.001232\n' +
            '    🏧Amount: 512.556\n' +
            '    💹Price: $0.001232\n' +
            '      ₿ 0.00000007\n' +
            '  13. SAYIN\n' +
            '    💲Unit price: $0.1\n' +
            '    🏧Amount: 512.1\n' +
            '    💹Price: $0.1\n' +
            '      ₿ 0.00000598';
        expect(actual).toEqual(expected);
    });

    it('Trending coins summary', function () {
        const data = JSON.parse(
            fs.readFileSync(__dirname + '/../../test/resources/test-trending-coins.json').toString(),
        );

        const actual = createTrendingCoinsSummary(data);

        const expected =
            '#1 Solana\n' +
            '      💵$16.48\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$6,103,417,330 \n' +
            '#2 Bitcoin\n' +
            '      💵$18,853.29\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$363,117,708,279 \n' +
            '#3 BNB\n' +
            '      💵$287.17\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$45,936,298,850 \n' +
            '#4 Fetch.ai\n' +
            '      💵$0.21\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$172,003,431 \n' +
            '#5 PancakeSwap\n' +
            '      💵$3.51\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$569,469,743 \n' +
            '#6 Shiba Inu\n' +
            '      💵$0.000009427\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$5,176,186,431 \n' +
            '#7 Polygon\n' +
            '      💵$0.9116\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$7,962,101,091 \n' +
            '#8 Terra Classic\n' +
            '      💵$0.0001681\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$1,009,388,632 \n' +
            '#9 SingularityNET\n' +
            '      💵$0.09639\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$111,186,004 \n' +
            '#10 Ethereum\n' +
            '      💵$1,427.53\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$174,692,974,993 \n' +
            '#11 dYdX\n' +
            '      💵$1.40\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$91,963,500 \n' +
            '#12 XRP\n' +
            '      💵$0.3768\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$19,076,326,741 \n' +
            '#13 Moonbeam\n' +
            '      💵$0.3541\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$192,773,371 \n' +
            '#14 FLARE\n' +
            '      💵$0.04423\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$530,795,010 \n' +
            '#15 Aptos\n' +
            '      💵$6.41\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$833,488,521 \n' +
            '#16 WOO Network\n' +
            '      💵$0.1707\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$279,470,937 \n' +
            '#17 Ocean Protocol\n' +
            '      💵$0.2478\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$151,914,089 \n' +
            '#18 Illuvium\n' +
            '      💵$51.58\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$100,598,478 \n' +
            '#19 DigiByte\n' +
            '      💵$0.009488\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$151,238,485 \n' +
            '#20 Waves\n' +
            '      💵$1.75\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$192,605,388 \n' +
            '#21 Terra\n' +
            '      💵$1.58\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$201,713,004 \n' +
            '#22 Civic\n' +
            '      💵$0.08696\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$86,963,717 \n' +
            '#23 SafePal\n' +
            '      💵$0.4164\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$135,077,767 \n' +
            '#24 Litecoin\n' +
            '      💵$85.41\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$6,152,522,592 \n' +
            '#25 UNUS SED LEO\n' +
            '      💵$3.46\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$3,296,804,556 \n' +
            '#26 STEPN\n' +
            '      💵$0.3422\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$205,308,974 \n' +
            '#27 FTX Token\n' +
            '      💵$1.37\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$451,090,911 \n' +
            '#28 API3\n' +
            '      💵$1.29\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$92,723,596 \n' +
            '#29 0x\n' +
            '      💵$0.1831\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$155,172,108 \n' +
            '#30 Cardano\n' +
            '      💵$0.3311\n' +
            '      2️⃣4️⃣↕️undefined\n' +
            '      🐂$11,429,078,362 ';

        expect(actual).toEqual(expected);
    });
});
