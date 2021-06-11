import * as chai from 'chai';
import 'mocha';
import { server } from '../../src/app';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('CoinmarketcapControllerRestTest', function () {
  it('Find market cap summary', function () {
    return chai
      .request(server)
      .get('/coinmarketcap/mcap-summary')
      .set('userid', 'kek')
      .set('username', 'usr')
      .then((res) => {
        expect(res.text).to.be.not.null;
      });
  });
});
