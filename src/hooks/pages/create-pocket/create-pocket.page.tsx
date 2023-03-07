/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useState } from "react";
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
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ErrorValidateContext } from "./useValidate";
import { SideMethod } from "@/src/dto/pocket.dto";
import { union } from "lodash";

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

  /** @dev Avalabible tokens when choose base. */
  const [availableBaseTokens, setAvailableBaseTokens] = useState<string[]>([]);

  /** @dev Avalabible tokens when choose target. */
  const [availableTargetTokens, setAvailableTargetTokens] = useState<string[]>(
    []
  );

  /** @dev Inject functions from whitelist hook to use. */
  const { findPairLiquidity, whiteLists, liquidities } = useWhiteList();

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
    return (
      Object.keys(errorMsgs).filter(
        (key) => errorMsgs?.[key as keyof ErrorValidateContext]
      ).length === 0
    );
  }, [errorMsgs]);

  /** @dev The function to modify stop conditions. */
  const handleModifyStopConditions = useCallback(
    (key: keyof StopConditions, value: any | "delete", primary = false) => {
      setStopConditions((prev) => {
        if (value === "delete") {
          return prev.filter((item) => item[key] === undefined);
        }

        return [
          ...prev.filter((item) => item[key] === undefined),
          { [key]: { value, primary } },
        ];
      });
    },
    [stopConditions]
  );

  /** @dev The function to execute pocket creation. */
  const handleCreatePocket = useCallback(async () => {
    try {
      /** @dev Enable UX when processing. */
      setProcessing(true);

      /** @dev Turn createdEnable when first click to create. */
      !createdEnable && setCreatedEnable(true);

      /** @dev Return when wallet not connected. */
      if (!solanaWallet) return;

      /** @dev Validate if all form be valid. */
      if (!validateForms()) {
        throw new Error("NOT::VALIDATION");
      }

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
        batchVolume: new BN(batchVolume * Math.pow(10, baseTokenAddress[1])),
        depositedAmount: new BN(
          depositedAmount * Math.pow(10, baseTokenAddress[1])
        ),
        side: sideMethod,
        marketId,
        buyCondition: {
          [buyCondition.type]: buyCondition?.fromValue
            ? {
                fromValue: buyCondition.fromValue,
                toValue: buyCondition.toValue,
              }
            : {
                value: buyCondition.value,
              },
        },
        stopConditions: processedStopConditions.map((item) => ({
          [Object.keys(item)[0]]: {
            value: (item as any)[Object.keys(item)[0] as string]?.value,
            primary: (item as any)[Object.keys(item)[0] as string]?.primary,
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

  /**
   * @dev dynamically update a list of available base tokens based on
   * the available liquidity data.
   */
  useEffect(() => {
    setAvailableBaseTokens(() => {
      return union(
        liquidities?.map((item) => [item.baseMint, item.quoteMint]).flat(1)
      );
    });
  }, [liquidities]);

  /**
   * @dev dynamically update a list of available target tokens based on
   * the selected base token and the available liquidity data.
   */
  useEffect(() => {
    setAvailableTargetTokens(() => {
      return union(
        liquidities
          ?.filter(
            (item) =>
              item.baseMint === baseTokenAddress[0].toBase58().toString() ||
              item.quoteMint === baseTokenAddress[0].toBase58().toString()
          )
          .map((item) => [item.baseMint, item.quoteMint])
          .flat(1)
          .filter((item) => item !== baseTokenAddress[0].toBase58().toString())
      );
    });
  }, [liquidities, baseTokenAddress]);

  /**
   * @dev dynamically update the targetTokenAddress state variable based on
   * the selected target token and the available whiteLists data.
   * */
  useEffect(() => {
    if (availableTargetTokens.length) {
      setTargetTokenAddress([
        new PublicKey(availableTargetTokens[0]),
        whiteLists[availableTargetTokens[0]]?.decimals,
      ]);
    }
  }, [availableTargetTokens, whiteLists]);

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
        availableBaseTokens,
        availableTargetTokens,
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
        okMessage="Back to Home"
        message="You have created pocket and deposited successful"
      />
    </CreatePocketContext.Provider>
  );
};
