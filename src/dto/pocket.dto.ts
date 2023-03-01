import { BN } from "@project-serum/anchor";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { PublicKey } from "@solana/web3.js";
import { IsString } from "class-validator";
import { Type } from "class-transformer";
// import { DurationObjectUnits } from "luxon";
import {
  BuyConditionOnChain,
  StopConditionsOnChain,
} from "@/src/entities/pocket.entity";

export interface PocketDto {}

/**
 * @dev Define list pocket dto
 */
export class GetPocketsDto {
  ownerAddress: string;
  statuses?: PocketStatus[];

  search?: string;
  sortBy?: string;
}

/**
 * @dev Define dto to create a pocket.
 */
export class CreatePocketDto {
  /**
   * @dev Unique UID of pocket.
   * @type {String}
   */
  @IsString()
  id: string;

  /**
   * @dev Name of pocket pool.
   * @type {String}
   */
  @IsString()
  name: string;

  /**
   * @dev The address of token which user setup for pool to DCA.
   * @type {PublicKey}
   */
  @Type(() => PublicKey)
  baseTokenAddress: PublicKey;

  /**
   * @dev The address of token which user setup for pool to DCA.
   * @type {PublicKey}
   */
  @Type(() => PublicKey)
  targetTokenAddress: PublicKey;

  /**
   * @dev Amout of each batch to buy.
   * @type {BN}
   */
  @Type(() => BN)
  batchVolume: BN;

  /**
   * @dev The date of pool will start.
   * @type {Date}
   */
  @Type(() => BN)
  startAt: BN;

  /**
   * @dev Fequency option to DCA token by amount which set in batch volume.
   * @type {DurationObjectUnits}
   */
  frequency: any;

  /**
   * @dev Buy condition.
   * @type {BuyConditionOnChain}
   */
  buyCondition: BuyConditionOnChain;

  /**
   * @dev Arrays of conditions that the pool will pause if the market siutuation match one in conditions.
   * @type {StopConditionsOnChain[]}
   */
  stopConditions: StopConditionsOnChain[];

  /**
   * @dev Amount of base token to deposit.
   * @type {BN}
   */
  depositedAmount: BN;
}
