import { DurationObjectUnits } from "luxon";

/**
 * @dev Export entity for pool.
 */
export class PoolEntity {
  /**
   * @dev Number if of pool.
   * @type {number}
   */
  numberId: number;

  /**
   * @dev Contract address of pool.
   * * @type {string}
   */
  address: string;

  /**
   * @dev Solana wallet address of pool owner.
   * * @type {string}
   */
  ownerAddress: string;

  /**
   * @dev Name of pool.
   * @type {string}
   */
  name: string;

  /**
   * @dev Time which pool will start at.
   * @type {Date}
   */
  startTime: Date;

  /**
   * @dev The amout condition of pool.
   * @type {number}
   */
  paxAmount: number;

  /**
   * @dev Second duration.
   * @type {DurationObjectUnits}
   */
  frequency: DurationObjectUnits;

  /**
   * @dev Condition to buy of pool.
   * @type {BuyCondition}
   */
  buyCondition: BuyCondition | undefined;

  /**
   * @dev Condition to stop buying of pool.
   * @type {StopConditions}
   */
  stopConditions: StopConditions | undefined;
}

/**
 * @dev Enum of condition.
 */
export enum PriceConditionType {
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  IS_BETWEEN = "IS_BETWEEN",
  IS_NOT_BETWEEN = "IS_NOT_BETWEEN",
}

/**
 * @dev Export interface of condition to buy of pool.
 */
export class BuyCondition {
  /**
   * @dev Specific of token which condition excute.
   * @type {string}
   */
  token: string;

  /**
   * @dev Type of condition.
   * @type {PriceConditionType}
   */
  type: PriceConditionType;

  /**
   * @dev Amount of token to buy when condition be executed.
   * @type {number}
   * @type {number[]}
   */
  value: number | number[];
}

/**
 * @dev Enum of progression type.
 */
export enum ProgressionType {
  END_TIME = "END_TIME",
  TARGET_BASE_AMOUNT = "TARGET_BASE_AMOUNT",
  TARGET_TOKEN_AMOUNT = "TARGET_TOKEN_AMOUNT",
  TIMES = "TIMES",
}

/**
 * @dev Export interface of condition to stop the pool.
 */
export class StopConditions {
  /**
   * @dev Conditions to stop the pool will excute if the pool reach out this time.
   * @type {Date}
   */
  endTime?: Date;

  /**
   * @dev Stop buying.
   * @type {number}
   */
  baseAmount?: number;

  /**
   * @dev Stop buying.
   * @type {number}
   */
  tokenAmount?: number;

  /**
   * @dev Stop buying.
   * @type {number}
   */
  times?: number;

  /**
   * @dev Stop buying.
   * @type {number}
   */
  progressionBy?: ProgressionType;
}
