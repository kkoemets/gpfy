import * as fs from 'fs';
import { ContractSummary } from '../../../../src/process/contract-summary';
import { createSummaryTemplate } from '../../../../src/api/bot/contract/create-summary-template';
import { expect } from 'chai';

describe('createSummaryTemplate', function () {
  it('Correct format', function () {
    const summary: ContractSummary = JSON.parse(
      fs.readFileSync(__dirname + '/test-contract-summary.json').toString(),
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
    expect(actual).to.equal(expected);
  });
});
