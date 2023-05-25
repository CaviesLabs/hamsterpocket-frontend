export interface PlatformConfigEntity {
  chainName: string;
  chainLogo: string;
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
  gnosis = "gnosis",
}

export const chainInfos: { [key in ChainId]: number } = {
  okt: 66,
  bnb: 56,
  polygon_mumbai: 80001,
  xdc: 50,
  solana: 0,
  gnosis: 100,
};
