type TopTokenEntity = {
  symbol: string;
  percent: number;
  price: number;
};

export type PortfolioStatisticEntity = {
  totalPoolsBalance: number;
  totalPoolsBalanceValue: number;
  topTokens: TopTokenEntity[];
};

export type PortfolioEntity = {
  tokenName: string;
  tokenSymbol: string;
  ownerAddress: string;
  tokenAddress: string;
  value: number;
  total: number;
  image?: string; // for developing
  usdValue?: number;
};
