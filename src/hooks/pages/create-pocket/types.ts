import { createContext, useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";

/** @dev Export state contained in page interface */
export interface CreatePocketContextState {
  /**
   * @dev Pocket name state.
   * @type {String}
   */
  pocketName: string;

  /**
   * @dev The token which user want to use to DCA.
   * @type {PublicKey}
   */
  baseTokenAddress: PublicKey;

  /**
   * @dev The token which user want to DCA.
   * @type {PublicKey}
   */
  targetTokenAddress: PublicKey;

  /**
   * @dev Amout of each batch to buy.
   * @type {number}
   */
  batchVolume: number;

  /**
   * @dev The date of pool will start.
   * @type {Date}
   */
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

  /**
   * @dev The amount of base token which user want to deposit into pool.
   * @type {number}
   */
  depositedAmount: number;

  /**
   * @dev The function to modify pocket name state.
   * @param {String}
   */
  setPocketName(v: string): void;

  /**
   * @dev The function to modify token which user want to use to DCA.
   * @param {PublicKey}
   */
  setBaseTokenAddress(v: PublicKey): void;

  /**
   * @dev The function to modify token which user want to DCA.
   * @param {PublicKey}
   */
  setTargetTokenAddress(v: PublicKey): void;

  /**
   * @dev The function to modify amout of each batch to buy.
   * @param {number}
   */
  setBatchVolume(v: number): void;

  /**
   * @dev The function to modify date of pool will start.
   * @param {Date}
   */
  setStartAt(v: Date): void;

  /**
   * @dev The function to modify fequency option to DCA token by amount which set in batch volume.
   * @param {DurationObjectUnits}
   */
  setFrequency(v: DurationObjectUnits): void;

  /**
   * @dev The function to modify buy condition.
   * @param {BuyCondition}
   */
  setBuyCondition(v: BuyCondition): void;

  /**
   * @dev The function to modify deposited amount.
   * @param {number}
   */
  setDepositedAmount(v: number): void;

  // /**
  //  * @dev Arrays of conditions that the pool will pause if the market siutuation match one in conditions.
  //  * @type {StopConditions[]}
  //  */
  // stopConditions: StopConditions[];
}

/** @dev Create context */
export const CreatePocketContext =
  createContext<CreatePocketContextState>(null);

/** @dev Export use context function */
export const useCreatePocketPage = () => {
  const context = useContext(CreatePocketContext);
  if (context === undefined) {
    throw new Error("Muse be in context provider");
  }
  return context;
};
