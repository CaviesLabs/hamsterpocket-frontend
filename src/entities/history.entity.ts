import { PocketEntity } from "@/src/entities/pocket.entity";

export enum PoolType {
  CREATED = "ACTIVITY_TYPE::CREATED",
  PAUSED = "ACTIVITY_TYPE::PAUSED",
  CONTINUE = "ACTIVITY_TYPE::CONTINUE",
  CLOSED = "ACTIVITY_TYPE::CLOSED",
  DEPOSITED = "ACTIVITY_TYPE::DEPOSITED",
  WITHDRAWN = "ACTIVITY_TYPE::WITHDRAWN",
  SWAPPED = "ACTIVITY_TYPE::SWAPPED",
  UPDATED = "ACTIVITY_TYPE::UPDATED",
  RESTARTED = "ACTIVITY_TYPE::RESTARTED",
  CLOSED_POSITION = "ACTIVITY_TYPE::CLOSED_POSITION",
  STOP_LOSS = "ACTIVITY_TYPE::STOP_LOSS",
  TAKE_PROFIT = "ACTIVITY_TYPE::TAKE_PROFIT",
  SKIPPED = "ACTIVITY_TYPE::SKIPPED",
  /** Other events */
  VAULT_CREATED = "ACTIVITY_TYPE::VAULT_CREATED",
  POCKET_CONFIG_UPDATED = "ACTIVITY_TYPE::POCKET_CONFIG_UPDATED",
}

export enum PoolActivityStatus {
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

export type HistoryEntity = {
  _id: string;
  poolId: string;
  name: string;
  type: PoolType;
  createdAt: Date;
  transactionId: string;
  /** @dev Pool detail */
  pool_docs: PocketEntity[];
  /** Swapped data */
  baseTokenAmount?: number;
  targetTokenAmount?: number;
  status: PoolActivityStatus;
};
