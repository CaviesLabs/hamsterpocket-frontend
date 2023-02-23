import { Type } from "class-transformer";
import { DurationObjectUnits } from "luxon";
import "reflect-metadata";

export enum PocketStatus {
  CREATED = "POOL_STATUS::CREATED",
  ACTIVE = "POOL_STATUS::ACTIVE",
  PAUSED = "POOL_STATUS::PAUSED",
  CLOSED = "POOL_STATUS::CLOSED",
  ENDED = "POOL_STATUS::ENDED",
}

export enum PriceConditionType {
  GT = "GT",
  GTE = "GTE",
  LT = "LT",
  LTE = "LTE",
  /** Equal */
  EQ = "EQ",
  /** Not Equal */
  NEQ = "NEQ",
  /** Between */
  BW = "BW",
  /** Not Between */
  NBW = "NBW",
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

  value: number[];
}

export class StopConditions {
  endTime?: Date;

  baseTokenReach?: number;

  targetTokenReach?: number;

  batchAmountReach?: number;
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

  @Type(() => BuyCondition)
  buyCondition: BuyCondition | undefined;

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