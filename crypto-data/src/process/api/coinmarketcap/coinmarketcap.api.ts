export type TrendingCoinData = {
  position: string;
  coinName: string;
  price: string;
  _24hChange: string;
  _7dChange: string;
  _30Change: string;
  mcap: string;
  _24hVol: string;
};

export interface CoinmarketcapApi {
  findMarketCapSummary: () => Promise<{
    mcap: string;
    volume24H: string;
    btcDominance: string;
    ethDominance: string;
  }>;

  findContract: ({
    coinOfficialName,
  }: {
    coinOfficialName: string;
  }) => Promise<string | null>;

  findCoinSummaryFromCmc: ({
    coinOfficialName,
  }: {
    coinOfficialName: string;
  }) => Promise<{ valueText: string; value: string }[]>;

  findTrendingCoins: () => Promise<TrendingCoinData[]>;
}
