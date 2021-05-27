import * as chai from 'chai';
import 'mocha';
import { server } from '../../src/app';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('ContractControllerRestTest', function () {
  it('Should return response on call', function () {
    return chai
      .request(server)
      .get(
        '/bot/contract/summary?contract=0x27ae27110350b98d564b9a3eed31baebc82d878d',
      )
      .then((res) => {
        expect(res.text).to.equal(
          '{"summaryText":"CumRocket/CUMMIES\\n      Current price: 0.043241119100730904\\n      Transactions (24h): 1051\\n      Volume: (24h): 291844.9814440587\\n      Price change (24h): -0.04643978807789007\\n      Liquidity: 932791.2377609357"}',
        );
      });
  });
});
