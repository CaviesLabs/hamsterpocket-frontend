import { DurationObjectUnits } from "luxon";
import { BN } from "@project-serum/anchor";
import "reflect-metadata";

/**
 * @dev Export all entities for aptos chain.
 */
export * from "./pocket.aptos.entity";

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
  HOURLY = "Hourly",
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
  SPENT_BASE_TOKEN = "MAIN_PROGRESS_BY::SPENT_BASE_TOKEN",
  RECEIVED_TARGET_TOKEN = "MAIN_PROGRESS_BY::RECEIVED_TARGET_TOKEN",
  BATCH_AMOUNT = "MAIN_PROGRESS_BY::BATCH_AMOUNT",
}

export class BuyCondition {
  tokenAddress: string;
  type: PriceConditionType;
  value: BN;
  fromValue?: BN;
  toValue?: BN;
}

export class BuyConditionOnChain {
  [key: string]: {
    value?: BN;
    fromValue?: BN;
    toValue?: BN;
  };
}

export interface StopConditions {
  endTimeReach?: { primary: boolean; value: Date };
  baseTokenAmountReach?: { primary: boolean; value: number };
  quoteTokenAmountReach?: { primary: boolean; value: number };
  spentBaseTokenAmountReach?: { primary: boolean; value: number };
  spentQuoteTokenAmountReach?: { primary: boolean; value: number };
  batchAmountReach?: { primary: boolean; value: number };
}
export interface OffChainStopConditions {
  endTimeReach?: Date;
  targetTokenAmountReach?: number;
  baseTokenAmountReach?: number;
  batchAmountReach?: number;
}
export interface StopConditionsOnChain {
  endTime?: {
    value: BN;
    isPrimary: boolean;
  };
  baseTokenAmountReach?: {
    value: BN;
    isPrimary: boolean;
  };
  quoteTokenAmountReach?: {
    value: BN;
    isPrimary: boolean;
  };
  spentBaseTokenAmountReach?: {
    value: BN;
    isPrimary: boolean;
  };
  spentQuoteTokenAmountReach?: {
    value: BN;
    isPrimary: boolean;
  };
  batchAmountReach?: {
    value: BN;
    isPrimary: boolean;
  };
}

export class PocketEntity {
  id?: string;
  _id?: string;

  address: string;

  ownerAddress: string;

  name: string;

  status: PocketStatus;

  baseTokenAddress: string;

  targetTokenAddress: string;

  startTime: Date;

  endedAt: Date;

  updatedAt: Date;

  nextExecutionAt: Date;

  closedAt: Date;

  depositedAmount: number;

  batchVolume: number;

  frequency: DurationObjectUnits;

  buyCondition:
    | {
        tokenAddress: string;
        type: PriceConditionType;
        value: [number, number?];
      }
    | undefined;

  stopConditions: {
    endTime?: Date;
    receivedTargetTokenReach?: number;
    baseTokenReach?: number;
    batchAmountReach?: number;
    spentBaseTokenReach?: number;
  };

  /** Progression fields */
  currentSpentBaseToken: number;

  remainingBaseTokenBalance: number;

  currentReceivedTargetToken: number;

  currentBatchAmount: number;

  mainProgressBy: MainProgressBy | undefined;

  progressPercent: number;

  /** ROI */
  currentTargetTokenBalance: number;
  currentROIValue: number;
  currentROI: number;
  realizedROI: number;
  realizedROIValue: number;

  stopLossCondition: { stopType: string; value: number };
  takeProfitCondition: { stopType: string; value: number };
  chainId: string;
}
