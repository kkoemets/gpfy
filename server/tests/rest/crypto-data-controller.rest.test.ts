import * as chai from 'chai';
import 'mocha';
import { server } from '../../src/app';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('CryptoDataController', function () {
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

  it('Should return response on call', function () {
    return chai
      .request(server)
      .get(
        '/bot/contract/summary?contract=0x27ae27110350b98d564b9a3eed31baebc82d878d',
      )
      .set('userid', 'kek')
      .set('username', 'usr')
      .then((res) => {
        expect(res.text).to.contains('CumRocket/CUMMIES');
      });
  });

  it('Should return response on call by coin full name - cumrocket', function () {
    return chai
      .request(server)
      .get('/bot/contract/summary?coinFullName=cumrocket')
      .set('userid', 'kek')
      .set('username', 'usr')
      .then((res) => {
        expect(res.text).to.contains('CumRocket/CUMMIES');
      });
  });

  it('Should return response on call by coin full name - ethereum', function () {
    return chai
      .request(server)
      .get('/bot/contract/summary?coinFullName=ethereum')
      .set('userid', 'kek')
      .set('username', 'usr')
      .then((res) => {
        expect(res.text).to.contains('Ethereum Token/ETH');
      });
  });
});
