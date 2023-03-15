import { useState, useCallback, useEffect } from "react";
import { useCreatePocketPage } from "./types";

/** @dev Define validated schemas. */
export interface ErrorValidateContext {
  pocketName: string;
  baseTokenAddress: string;
  targetTokenAddress: string;
  batchVersion: string;
  buyCondition: string;
  stopConditions: string;
  depositedAmount: string;
  batchVolume: string;
  startAt: string;
}

/**
 * @dev Use this hook to validate value before creating pool.
 */
export const useValidate = (): { errors: ErrorValidateContext } => {
  /** @dev Initialize erros data. */
  const [errors, setErrors] = useState<ErrorValidateContext>();

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
    pocketName,
    mintOrderSize,
    batchVolume,
    depositedAmount,
    startAt,
  } = useCreatePocketPage();

  /** @dev Init */
  useEffect(() => {
    setErrors({
      pocketName: "",
      baseTokenAddress: "",
      targetTokenAddress: "",
      batchVersion: "",
      buyCondition: "",
      stopConditions: "",
      depositedAmount: "",
      batchVolume: "",
      startAt: "",
    });
  }, []);

  /** @dev Watch changes in pocket name and validate it. */
  useEffect(() => {
    if (!createdEnable) return;
    modifyErrors(
      "pocketName",
      !pocketName ? "Pocket Name must be required" : ""
    );
  }, [pocketName, createdEnable]);

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
  // useEffect(() => {
  //   if (!createdEnable) return;
  //   modifyErrors(
  //     "stopConditions",
  //     !stopConditions.length ? "Must add at least one stop condition" : ""
  //   );
  // }, [stopConditions, createdEnable]);

  /** @dev Watch changes in stop condtions. */
  // useEffect(() => {
  //   if (!createdEnable) return;
  //   modifyErrors(
  //     "buyCondition",
  //     !buyCondition ? "Buy condition must be required" : ""
  //   );
  // }, [buyCondition, createdEnable]);

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

  return {
    errors,
  };
};
