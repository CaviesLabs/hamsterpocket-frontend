import { BN } from "@project-serum/anchor";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { PublicKey } from "@solana/web3.js";
import { IsString } from "class-validator";
import { Type } from "class-transformer";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";

export interface PocketDto {}

/**
 * @dev Define list pocket dto
 */
export class GetPocketsDto {
  ownerAddress: string;
  statuses?: PocketStatus[];
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
  @Type(() => Date)
  startAt: Date;

  /**
   * @dev Fequency option to DCA token by amount which set in batch volume.
   * @type {DurationObjectUnits}
   */
  frequency: DurationObjectUnits;

  /**
   * @dev Buy condition.
   * @type {BuyCondition}
   */
  buyCondition: BuyCondition;

  /**
   * @dev Arrays of conditions that the pool will pause if the market siutuation match one in conditions.
   * @type {StopConditions[]}
   */
  stopConditions: StopConditions[];
}
