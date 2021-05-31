import * as fs from 'fs';
import { ContractSummary } from '../../../../../src/process/contract-summary';
import { createSummaryTemplate } from '../../../../../src/api/bot/contract/create-summary-template';
import { expect } from 'chai';

describe('createSummaryTemplate', function () {
  it('Correct format', function () {
    const summary: ContractSummary = JSON.parse(
      fs.readFileSync(__dirname + '/test-contract-summary.json').toString(),
    );

    const actual = createSummaryTemplate(summary);

    const expected =
      'CumRocket/CUMMIES\n' +
      '      Current price: $0.044392\n' +
      '      Transactions (24h): 1122\n' +
      '      Volume: (24h): $313992.26\n' +
      '      Price change (24h): $-0.037662\n' +
      '      Liquidity: $961165.37\n' +
      '      Holders: N/A';
    expect(actual).to.equal(expected);
  });
});
