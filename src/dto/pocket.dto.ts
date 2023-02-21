export interface PocketDto {}

export enum PocketStatus {
  "POOL_STATUS::CREATED" = "POOL_STATUS::CREATED",
  "POOL_STATUS::ACTIVE" = "POOL_STATUS::ACTIVE",
  "POOL_STATUS::PAUSED" = "POOL_STATUS::PAUSED",
  "POOL_STATUS::CLOSED" = "POOL_STATUS::CLOSED",
  "POOL_STATUS::ENDED" = "POOL_STATUS::ENDED",
}

export enum BuyConditionTypes {
  "GT" = "GT",
  "GTE" = "GTE",
  "LT" = "LT",
  "LTE" = "LTE",
  "EQ" = "EQ",
  "NEQ" = "NEQ",
  "BW" = "BW",
  "NBW" = "NBW",
}

export enum MainProgressTypes {
  "MAIN_PROGRESS_BY::END_TIME" = "MAIN_PROGRESS_BY::END_TIME",
  "MAIN_PROGRESS_BY::BASE_TOKEN" = "MAIN_PROGRESS_BY::BASE_TOKEN",
  "MAIN_PROGRESS_BY::TARGET_TOKEN" = "MAIN_PROGRESS_BY::TARGET_TOKEN",
  "MAIN_PROGRESS_BY::BATCH_AMOUNT" = "MAIN_PROGRESS_BY::BATCH_AMOUNT",
}

export interface PocketEntity {
  id: string;
  address: string;
  ownerAddress: string;
  name: string;
  status: PocketStatus;
  baseTokenAddress: string;
  targetTokenAddress: string;
  startTime: Date;
  depositedAmount: number;
  batchVolume: number;
  frequency: any;
  buyCondition: {
    tokenAddress: string;
    type: BuyConditionTypes;
    value: number[];
  };
  stopConditions: {
    endTime: Date;
    baseTokenReach: number;
    targetTokenReach: number;
    batchAmountReach: number;
  };
  currentBaseToken: number;
  remainingBaseTokenBalance: number;
  currentTargetToken: number;
  currentBatchAmount: number;
  mainProgressBy: MainProgressTypes;
  progressPercent: number;
}
