export interface PlatformConfigEntity {
  rpcUrl: string;
  chainId?: number;
  programAddress?: string;
  vaultAddress?: string;
  registryAddress?: string;
  mainDex?: string;
  explorerUrl?: string;
  whitelistedRouters?: {
    address: string;
    isV3: boolean;
    ammTag: string;
    dexUrl: string;
  }[];
}

export enum ChainId {
  bnb = "bnb",
  polygon_mumbai = "polygon_mumbai",
  okt = "okt",
  xdc = "xdc",
  sol = "solana",
}
