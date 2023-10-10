import { createContext, useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";
import { ErrorValidateContext } from "./useValidate";

/** @dev Export state contained in page interface */
export interface CreatePocketContextState {
  /**
   * @dev Pocket name state.
   * @type {String}
   */
  pocketName: string;

  /**
   * @dev The token which user want to use to DCA.
   * @type {PublicKey} mintAcount
   * @type {number} decimals
   */
  baseTokenAddress: [PublicKey, number];

  /**
   * @dev The token which user want to DCA.
   * @type {PublicKey} mintAcount
   * @type {number} decimals
   */
  targetTokenAddress: [PublicKey?, number?];

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
   * @dev The amount of base token which user want take profit.
   * @type {number}
   */
  takeProfitAmount: number;

  /**
   * @dev The amount of base token which user want stop loss.
   * @type {number}
   */
  stopLossAmount: number;

  /**
   * @dev The value is true if user click create pocket.
   * @type {boolean}
   */
  processing: boolean;

  /**
   * @dev The value present if user click create pocket.
   */
  createdEnable: boolean;

  /**
   * @dev Contains error messages.
   */
  errorMsgs: ErrorValidateContext;

  /**
   * @dev Avalable list of tokens to select for base.
   */
  availableBaseTokens: string[];

  /**
   * @dev Mint batch amount volume.
   */
  mintOrderSize: number;

  /**
   * @dev Avalable list of tokens to select for target.
   */
  availableTargetTokens: string[];

  /**
   * @dev The function to modify pocket name state.
   * @param {String}
   */
  setPocketName(v: string): void;

  /**
   * @dev The function to modify token which user want to use to DCA.
   * @param {[PublicKey, number]} [mintAcccount, decimals]
   */
  setBaseTokenAddress(v: [PublicKey, number]): void;

  /**
   * @dev The function to modify token which user want to DCA.
   * @param {[PublicKey, number]} [mintAcccount, decimals]
   */
  setTargetTokenAddress(v: [PublicKey, number]): void;

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

  /**
   * @dev The function to modify take-profit amount.
   * @param {number}
   */
  setTakeProfitAmount(v: number): void;

  /**
   * @dev The function to modify stop-loss amount.
   * @param {number}
   */
  setStopLossAmount(v: number): void;

  /**
   * @dev The function to modify arrays of conditions that the pool will pause if the market siutuation match one in conditions.
   * @param key
   * @param value
   * @param primary
   */
  handleModifyStopConditions(
    key: keyof StopConditions,
    value: any | "delete",
    primary?: boolean
  ): void;

  /**
   * @dev The function to execute pocket creation.
   */
  handleCreatePocket(): Promise<void>;

  /**
   * @dev The function to update error messageses.
   */
  setErrorMsgs(v: ErrorValidateContext): void;
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
