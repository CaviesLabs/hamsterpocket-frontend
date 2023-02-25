import { Type } from "class-transformer";
import { DurationObjectUnits } from "luxon";
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import "reflect-metadata";

export enum PocketStatus {
  CREATED = "POOL_STATUS::CREATED",
  ACTIVE = "POOL_STATUS::ACTIVE",
  PAUSED = "POOL_STATUS::PAUSED",
  CLOSED = "POOL_STATUS::CLOSED",
  ENDED = "POOL_STATUS::ENDED",
}

export enum PriceConditionType {
  GT = "gt",
  GTE = "gte",
  LT = "lt",
  LTE = "lte",
  /** Equal */
  EQ = "eq",
  /** Not Equal */
  NEQ = "neq",
  /** Between */
  BW = "bw",
  /** Not Between */
  NBW = "nbw",
}

export enum FrequencyConditionType {
  /** Daily */
  DAILY = "Daily",
  /** Weekly */
  WEEKLY = "Weekly",
  /** Every 2 Weeks */
  E2W = "Every 2 Weeks",
  /** Monthly */
  MONTHLY = "Monthly",
  /** Every 3 Months */
  E3M = "Every 3 Months",
  /** Every 6 Months */
  E6M = "Every 6 Months",
  /** Yearly */
  YEARLY = "Yearly",
}

export enum MainProgressBy {
  END_TIME = "MAIN_PROGRESS_BY::END_TIME",
  BASE_TOKEN = "MAIN_PROGRESS_BY::BASE_TOKEN",
  TARGET_TOKEN = "MAIN_PROGRESS_BY::TARGET_TOKEN",
  BATCH_AMOUNT = "MAIN_PROGRESS_BY::BATCH_AMOUNT",
}

export class BuyCondition {
  tokenAddress: string;
  type: PriceConditionType;
  value: BN;
}

export class BuyConditionOnChain {
  tokenAddress: PublicKey;
  condition: {
    [key: string]: {
      value: BN;
    };
  };
}

export class StopConditions {
  endTime?: Date;
  baseTokenReach?: number;
  targetTokenReach?: number;
  batchAmountReach?: number;
}
export class StopConditionsOnChain {
  endTime?: {
    value: BN;
  };
  baseTokenReach?: {
    value: BN;
  };
  targetTokenReach?: {
    value: BN;
  };
  batchAmountReach?: {
    value: BN;
  };
}

export class PocketEntity {
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

  frequency: DurationObjectUnits;

  @Type(() => BuyConditionOnChain)
  buyCondition: BuyConditionOnChain | undefined;

  @Type(() => StopConditions)
  stopConditions: StopConditions[] | [];

  /** Progression fields */
  currentBaseToken: number;

  remainingBaseTokenBalance: number;

  currentTargetToken: number;

  currentBatchAmount: number;

  mainProgressBy: MainProgressBy | undefined;

  progressPercent: number;
}
