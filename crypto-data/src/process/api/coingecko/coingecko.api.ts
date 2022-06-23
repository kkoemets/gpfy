export interface CoingeckoApi {
  findContract: ({
    coinOfficialName,
  }: {
    coinOfficialName: string;
  }) => Promise<string | null>;
}
