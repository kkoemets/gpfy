export interface RainbowGraphResponse {
  base64Img: string;
  originUrl: string;
}

export interface BlockChainCenterApi {
  findRainbowGraph: () => Promise<RainbowGraphResponse>;
}
