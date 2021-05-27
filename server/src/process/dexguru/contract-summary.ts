export interface ContractSummary {
  id: string;
  symbol: string;
  name: string;
  description: string;
  txns24h: number;
  txns24hChange: number;
  verified: boolean;
  decimals: number;
  volume24h: number;
  volume24hUSD: number;
  volume24hETH: number;
  volumeChange24h: number;
  liquidityUSD: number;
  liquidityETH: number;
  liquidityChange24h: number;
  priceUSD: number;
  priceETH: number;
  priceChange24h: number;
  timestamp: number;
  blockNumber: number;
  AMM: string;
  network: string;
}
