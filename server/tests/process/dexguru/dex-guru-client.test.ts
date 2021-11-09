import { findContractSummary } from "../../../src/process/dexguru/dex-guru-client";
import { expect } from "chai";
import { DexContractSummary } from "../../../src/process/dexguru/dex-contract-summary";

describe("dexGuruClient", function () {
  it("Fetch contract summary - cumrocket", async function () {
    const contract = "0x27ae27110350b98d564b9a3eed31baebc82d878d";
    const contractSummary: DexContractSummary = await findContractSummary({
      contract,
    });

    expect(contractSummary.symbol).to.equal("CUMMIES");
    expect(contractSummary.name).to.equal("CumRocket");
  });

  it("Fetch contract summary - ethereum", async function () {
    const contract = "0x2170ed0880ac9a755fd29b2688956bd959f933f8";
    const contractSummary: DexContractSummary = await findContractSummary({
      contract,
    });

    expect(contractSummary.symbol).to.equal("ETH");
    expect(contractSummary.name).to.equal("Ethereum Token");
  });

  it("Fetch contract summary - binance coin", async function () {
    const contract = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
    const contractSummary: DexContractSummary = await findContractSummary({
      contract,
    });

    expect(contractSummary.symbol).to.equal("BNB");
    expect(contractSummary.name).to.equal("BNB");
  });
});
