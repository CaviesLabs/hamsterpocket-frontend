import { PoolEntity } from "@/src/entities/pool.entity";
import { PocketEntity } from "@/src/entities/pocket.entity";

export enum PoolType {
  CREATE = "ACTIVITY_TYPE::CREATED",
  PAUSE = "ACTIVITY_TYPE::PAUSED",
  CONTINUE = "ACTIVITY_TYPE::CONTINUE",
  DEPOSIT = "ACTIVITY_TYPE::DEPOSITED",
  BUY = "BUY",
  CLOSE = "ACTIVITY_TYPE::CLOSED",
  WITHDRAW = "ACTIVITY_TYPE::WITHDRAWN",
  SWAPPED = "ACTIVITY_TYPE::SWAPPED",
  SKIPPED = "ACTIVITY_TYPE::SKIPPED",
  VAULT_CREATED = "ACTIVITY_TYPE::VAULT_CREATED",
  POCKET_CONFIG_UPDATED = "ACTIVITY_TYPE::POCKET_CONFIG_UPDATED",
}

export type HistoryEntity = {
  poolId: string;
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

  /** @dev Pool detail */
  pool_docs: PocketEntity[];
};
