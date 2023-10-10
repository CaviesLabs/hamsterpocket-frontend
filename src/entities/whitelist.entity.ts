export type WhitelistEntity = {
  _id: string;
  name: string;
  image: string;
  symbol: string;
  address: string;
  chainId: string;
  decimals: number;
  entityType: string;
  coinGeckoId: string;
  estimatedValue: number;
  realDecimals?: number;
  aliasAddress?: string;
  isNativeCoin: boolean;
};
