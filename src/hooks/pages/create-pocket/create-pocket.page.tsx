/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { CreatePocketContext } from "./types";
import { BN } from "@project-serum/anchor";
import { ProgramService } from "@/src/services/program.service";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WSOL_ADDRESS, convertDurationsTimeToHours } from "@/src/utils";

export const CreatePocketProvider = (props: { children: ReactNode }) => {
  const [pocketName, setPocketName] = useState("");
  const [baseTokenAddress, setBaseTokenAddress] = useState<[PublicKey, number]>(
    [new PublicKey(WSOL_ADDRESS), 9]
  );
  const [targetTokenAddress, setTargetTokenAddress] = useState<
    [PublicKey, number]
  >([new PublicKey(WSOL_ADDRESS), 9]);
  const [batchVolume, setBatchVolume] = useState<number>(0);
  const [startAt, setStartAt] = useState<Date>(new Date());
  const [frequency, setFrequency] = useState<DurationObjectUnits>(null);
  const [buyCondition, setBuyCondition] = useState<BuyCondition>();
  const [stopConditions, setStopConditions] = useState<StopConditions[]>([]);
  const [depositedAmount, setDepositedAmount] = useState<BN>();
  const [processing, setProcessing] = useState(false);

  /** @dev Inject wallet provider. */
  const { solanaWallet, programService } = useWallet();

  /** @dev The function to modify stop conditions. */
  const handleModifyStopConditions = useCallback(
    (excuted = false, key: string, value: any) => {
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

      if (!solanaWallet) return;
      const response = await programService.createPocket(solanaWallet, {
        id: ProgramService.generatePocketId(),
        name: pocketName,
        baseTokenAddress: baseTokenAddress[0],
        targetTokenAddress: targetTokenAddress[0],
        startAt: new BN(startAt.getTime().toString()),
        frequency: convertDurationsTimeToHours(frequency),
        batchVolume: new BN(batchVolume * Math.pow(10, targetTokenAddress[1])),
        depositedAmount,
        buyCondition: {
          tokenAddress: new PublicKey(buyCondition.tokenAddress),
          condition: {
            [buyCondition.type]: {
              value: buyCondition.value,
            },
          },
        },
        stopConditions: stopConditions.map((item) => ({
          [Object.keys(item)[0]]: {
            value: (item as any)[Object.keys(item)[0] as string],
          },
        })),
      });

      console.log(response);
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
      }}
    >
      {props.children}
    </CreatePocketContext.Provider>
  );
};
