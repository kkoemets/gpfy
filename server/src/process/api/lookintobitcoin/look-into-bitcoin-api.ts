export interface Btc2YearMovingAverageResponse {
  base64Img: string;
  originUrl: string;
}

export interface LookIntoBitcoinApi {
  findBtc2YearMovingAverageGraph: () => Promise<Btc2YearMovingAverageResponse>;
}
