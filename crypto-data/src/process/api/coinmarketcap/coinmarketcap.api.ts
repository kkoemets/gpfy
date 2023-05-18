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

export interface MarketCapSummary {
    mcap: string;
    volume24H: string;
    btcDominance: string;
    ethDominance: string;
}

export interface CoinSummary {
    coinName: string;
    price: string;
    _24hChange: string;
    _24High: string;
    _24TradingVolume: string;
    volumeMarketCapRatio: string;
    marketCapDominance: string;
    rank: string;
}

export interface CoinmarketcapApi {
    findMarketCapSummary: () => Promise<MarketCapSummary>;

    findCoinSummaryFromCmc: ({ coinOfficialName }: { coinOfficialName: string }) => Promise<CoinSummary>;

    findTrendingCoins: () => Promise<TrendingCoinData[]>;
}
