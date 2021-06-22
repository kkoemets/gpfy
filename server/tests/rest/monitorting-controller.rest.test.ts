import * as chai from 'chai';
import 'mocha';
import { server } from '../../src/app';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('MonitoringControllerRestTest', function () {
  it('Should return response on call', function () {
    return chai
      .request(server)
      .get('/monitoring')
      .then((res) => {
        expect(res.text).to.equal('Health: Good');
      });
  });
});
