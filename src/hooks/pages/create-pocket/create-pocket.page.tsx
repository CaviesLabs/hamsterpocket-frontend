/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { ReactNode, useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { CreatePocketContext } from "./types";
import { BN } from "@project-serum/anchor";
import { ProgramService } from "@/src/services/program.service";
import {
  WSOL_ADDRESS,
  BONK_ADDRESS,
  convertDurationsTimeToHours,
  processStopConditions,
} from "@/src/utils";
import { SuccessTransactionModal } from "@/src/components/create-pocket/success-modal.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ErrorValidateContext } from "./useValidate";
import { SideMethod } from "@/src/dto/pocket.dto";

export const CreatePocketProvider = (props: { children: ReactNode }) => {
  const [pocketName, setPocketName] = useState("");
  const [baseTokenAddress, setBaseTokenAddress] = useState<[PublicKey, number]>(
    [new PublicKey(WSOL_ADDRESS), 9]
  );
  const [targetTokenAddress, setTargetTokenAddress] = useState<
    [PublicKey, number]
  >([new PublicKey(BONK_ADDRESS), 5]);
  const [batchVolume, setBatchVolume] = useState<number>(0);
  const [startAt, setStartAt] = useState<Date>(new Date());
  const [buyCondition, setBuyCondition] = useState<BuyCondition>();
  const [stopConditions, setStopConditions] = useState<StopConditions[]>([]);
  const [depositedAmount, setDepositedAmount] = useState<number>(0);
  const [createdEnable, setCreatedEnable] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<ErrorValidateContext>();

  /** @dev Inject functions from whitelist hook to use. */
  const { findPairLiquidity } = useWhiteList();

  /** @dev Default is every day */
  const [frequency, setFrequency] = useState<DurationObjectUnits>({ days: 1 });

  /** @dev Define variable presenting for successful pocket creation. */
  const [successCreated, setSuccessCreated] = useState(false);

  /** @dev Define variable presenting whenther program is creating pool. */
  const [processing, setProcessing] = useState(false);

  /** @dev Inject router to use. */
  const router = useRouter();

  /** @dev Inject wallet provider. */
  const { solanaWallet, programService } = useWallet();

  /** @dev The function to validate. */
  const validateForms = useCallback(() => {
    return !Object.keys(errorMsgs).filter(
      (key) => errorMsgs?.[key as keyof ErrorValidateContext]
    ).length;
  }, [errorMsgs]);

  /** @dev The function to modify stop conditions. */
  const handleModifyStopConditions = useCallback(
    (excuted = false, key: keyof StopConditions, value: any) => {
      setStopConditions((prev) => {
        /** @dev Reset conditions arrays by removing asset. */
        const newConditions = prev.filter((item) => {
          return !Object.keys(item).includes(key);
        });

        /** @dev Add condition. */
        excuted && newConditions.push({ [key]: value });
        return newConditions;
      });
    },
    [stopConditions]
  );

  /** @dev The function to execute pocket creation. */
  const handleCreatePocket = useCallback(async () => {
    try {
      /** @dev Enable UX when processing. */
      setProcessing(true);

      /** @dev Return when wallet not connected. */
      if (!solanaWallet) return;

      /** @dev Validate if all form be valid. */
      // if (!validateForms()) {
      //   throw new Error("NOT::VALIDATION");
      // }

      /** @dev Turn createdEnable when first click to create. */
      !createdEnable && setCreatedEnable(true);

      /** @dev Convert address to string. */
      const [baseAddress, targetAddress] = await Promise.all([
        baseTokenAddress[0].toBase58().toString(),
        targetTokenAddress[0].toBase58().toString(),
      ]);

      /** @dev Get base and qoute address in liquidity pool. */
      const [liqBase, liqQoute, marketId] = findPairLiquidity(
        baseAddress,
        targetAddress
      );

      /** @dev Handle to attract side method of pool.  */
      const sideMethod: SideMethod =
        liqBase === baseAddress ? { sell: {} } : { buy: {} };
      console.log(liqBase, baseAddress);

      /** @dev Process stopConditions. */
      const processedStopConditions = stopConditions.map((condition) =>
        processStopConditions(condition, sideMethod)
      );

      const response = await programService.createPocket(solanaWallet, {
        id: ProgramService.generatePocketId(),
        name: pocketName,
        baseTokenAddress: new PublicKey(baseAddress),
        quoteTokenAddress: new PublicKey(liqQoute),
        startAt: new BN(startAt.getTime().toString()),
        frequency: convertDurationsTimeToHours(frequency),
        batchVolume: new BN(batchVolume * Math.pow(10, targetTokenAddress[1])),
        depositedAmount: new BN(
          depositedAmount * Math.pow(10, baseTokenAddress[1])
        ),
        side: sideMethod,
        marketId,
        buyCondition: {
          [buyCondition.type]: {
            value: buyCondition.value,
          },
        },
        stopConditions: processedStopConditions.map((item) => ({
          [Object.keys(item)[0]]: {
            value: (item as any)[Object.keys(item)[0] as string],
          },
        })),
      });

      console.log(response);
      setSuccessCreated(true);
    } catch (err) {
      console.log(err);
    } finally {
      /** @dev Disable UX after processing. */
      setProcessing(false);
    }
  }, [
    solanaWallet,
    pocketName,
    baseTokenAddress,
    targetTokenAddress,
    batchVolume,
    startAt,
    frequency,
    buyCondition,
    stopConditions,
    depositedAmount,
    createdEnable,
    validateForms,
  ]);

  return (
    <CreatePocketContext.Provider
      value={{
        pocketName,
        baseTokenAddress,
        targetTokenAddress,
        batchVolume,
        startAt,
        frequency,
        buyCondition,
        stopConditions,
        depositedAmount,
        processing,
        createdEnable,
        errorMsgs,
        setPocketName,
        setBaseTokenAddress,
        setTargetTokenAddress,
        setBatchVolume,
        setStartAt,
        setFrequency,
        setBuyCondition,
        setDepositedAmount,
        handleModifyStopConditions,
        handleCreatePocket,
        setErrorMsgs,
      }}
    >
      {props.children}
      <SuccessTransactionModal
        isModalOpen={successCreated}
        handleOk={() => router.push("/my-pockets")}
        handleCancel={() => {}}
      />
    </CreatePocketContext.Provider>
  );
};
