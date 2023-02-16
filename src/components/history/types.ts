export enum PoolType {
  CREATE = "CREATE",
  PAUSE = "PAUSE",
  CONTINUE = "CONTINUE",
  DEPOSIT = "DEPOSIT",
  BUY = "BUY",
  CLOSE = "CLOSE",
  WITHDRAW = "WITHDRAW",
}

export type HistoryDto = {
  id: string;
  name: string;
  token: {
    name: string;
    address: string;
  };
  type: PoolType;
  nativeTokenAmount: number;
  nativeTokenPrice: number;
  tokenAmount: number;
  tokenPrice: number;
  createdAt: Date;
};
