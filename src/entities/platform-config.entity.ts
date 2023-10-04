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
  wagmiKey?: string;
  whitelistedRouters?: {
    address: string;
    isV3: boolean;
    ammTag: string;
    dexUrl: string;
    inputTag: string;
    outputTag: string;
    routerVersion: string;
  }[];
}

export enum ChainId {
  bnb = "bnb",
  polygon_mumbai = "polygon_mumbai",
  okt = "okt",
  xdc = "xdc",
  sol = "solana",
  gnosis = "gnosis",
  aptos = "aptos",
  avaxc = "avaxc",
}
