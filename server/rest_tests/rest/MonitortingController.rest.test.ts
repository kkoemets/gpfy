import * as chai from 'chai';
import 'mocha';
import chaiHttp = require('chai-http');
import { server } from '../../src/app';

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
