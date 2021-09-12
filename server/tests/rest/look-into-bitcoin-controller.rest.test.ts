import * as chai from "chai";
import "mocha";
import { server } from "../../src/app";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);
const { expect } = chai;

describe("LookIntoBitcoinController", function() {
  it("2 year moving average", function() {
    return chai
      .request(server)
      .get(
        "/bot/lookIntoBitcoin/2YearMovingAvg"
      )
      .set("userid", "kek")
      .set("username", "usr")
      .then((res) => {
        expect(res.text).to.contains("https://www.lookintobitcoin.com/charts/bitcoin-investor-tool/");
      });
  });
});
