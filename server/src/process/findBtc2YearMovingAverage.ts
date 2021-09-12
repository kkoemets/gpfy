import { findBtc2YearMovingAverageGraph } from "./lookintobitcoin/look-into-bitcoin-client";

export interface Btc2YearMovingAverage {
  base64Img: string;
  originUrl: string
}

export const findBtc2YearMovingAverage: () => Promise<Btc2YearMovingAverage> = async () => {
  return findBtc2YearMovingAverageGraph();
};