import { useState, useCallback, useEffect } from "react";
import { useCreatePocketPage } from "./types";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";

/** @dev Define validated schemas. */
export interface ErrorValidateContext {
  baseTokenAddress: string;
  targetTokenAddress: string;
  batchVersion: string;
  buyCondition: string;
  stopConditions: string;
  depositedAmount: string;
  takeProfitAmount: string;
  stopLossAmount: string;
  batchVolume: string;
  startAt: string;
  pocketName: string;
}

/**
 * @dev Use this hook to validate value before creating pool.
 */
export const useValidate = (): { errors: ErrorValidateContext } => {
  /** @dev Initialize erros data. */
  const [errors, setErrors] = useState<ErrorValidateContext>();

  /** @dev Get chain info. */
  const { chainId } = usePlatformConfig();

  /** @dev The function to handle modifying error messageses. */
  const modifyErrors = useCallback(
    (key: keyof ErrorValidateContext, msg: string) => {
      setErrors((prev) => ({
        ...prev,
        [key]: msg,
      }));
    },
    [setErrors]
  );

  /** @dev Injected all modules to watch changes. */
  const {
    // buyCondition,
    createdEnable,
    mintOrderSize,
    batchVolume,
    depositedAmount,
    startAt,
    takeProfitAmount,
    stopLossAmount,
    pocketName,
  } = useCreatePocketPage();

  /** @dev Init */
  useEffect(() => {
    setErrors({
      baseTokenAddress: "",
      targetTokenAddress: "",
      batchVersion: "",
      buyCondition: "",
      stopConditions: "",
      depositedAmount: "",
      batchVolume: "",
      startAt: "",
      takeProfitAmount: "",
      stopLossAmount: "",
      pocketName: "",
    });
  }, []);

  /** @dev Watch changes in pocket name, required if chainId is SOL. */
  useEffect(() => {
    if (!createdEnable) return;
    if (chainId !== ChainId.sol) return;
    modifyErrors(
      "pocketName",
      !pocketName ? "Pocket name must be required" : ""
    );
  }, [pocketName, chainId]);

  /** @dev Watch changes in pocket start at. */
  useEffect(() => {
    if (!createdEnable) return;
    modifyErrors(
      "startAt",
      startAt.getTime() < Date.now()
        ? "Start date must be greather than now"
        : ""
    );
  }, [startAt, createdEnable]);

  /** @dev Watch changes in batch volume and validate it. */
  useEffect(() => {
    if (!createdEnable) return;
    if (batchVolume < mintOrderSize) {
      return modifyErrors(
        "batchVolume",
        batchVolume <= 0
          ? `Batch volume must be greater than Mint Order Size(${mintOrderSize})`
          : ""
      );
    }
    modifyErrors(
      "batchVolume",
      batchVolume <= 0 ? "Batch volume must be required" : ""
    );
  }, [batchVolume, createdEnable, mintOrderSize]);

  /** @dev Watch changes in stop condtions. */
  useEffect(() => {
    if (!createdEnable) return;

    /** @dev Raise error if user enter deposit amount smaller than batch amount. */
    if (depositedAmount < batchVolume) {
      return modifyErrors(
        "depositedAmount",
        "Deposited amount must be greater than batch amount"
      );
    }

    modifyErrors(
      "depositedAmount",
      depositedAmount <= 0 || !depositedAmount
        ? "Deposited amount must be larger than 0"
        : ""
    );
  }, [depositedAmount, createdEnable, batchVolume]);

  useEffect(() => {
    if (!createdEnable) return;
    modifyErrors(
      "takeProfitAmount",
      takeProfitAmount !== undefined && takeProfitAmount <= 0
        ? "Must to set token amount to take profit"
        : ""
    );
  }, [takeProfitAmount, createdEnable]);

  useEffect(() => {
    if (!createdEnable) return;
    modifyErrors(
      "stopLossAmount",
      stopLossAmount !== undefined && stopLossAmount <= 0
        ? "Must to set token amount stop loss"
        : ""
    );
  }, [stopLossAmount, createdEnable]);

  return {
    errors,
  };
};
