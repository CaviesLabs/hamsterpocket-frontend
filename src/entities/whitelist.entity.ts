import { ChainId } from "@/src/entities/platform-config.entity";

export type WhitelistEntity = {
  _id: string;
  address: string;
  coinGeckoId: string;
  decimals: number;
  entityType: string;
  image: string;
  name: string;
  symbol: string;
  estimatedValue: number;
  realDecimals?: number;
  chainId: ChainId;
  aliasAddress?: string;
};
