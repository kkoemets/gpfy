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
}
