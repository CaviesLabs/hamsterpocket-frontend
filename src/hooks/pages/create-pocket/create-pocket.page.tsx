import { ReactNode, useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { CreatePocketContext } from "./types";
import { BN } from "@project-serum/anchor";
import { ProgramService } from "@/src/services/program.service";

export const CreatePocketProvider = (props: { children: ReactNode }) => {
  const [pocketName, setPocketName] = useState("");
  const [baseTokenAddress, setBaseTokenAddress] = useState<PublicKey>();
  const [targetTokenAddress, setTargetTokenAddress] = useState<PublicKey>();
  const [batchVolume, setBatchVolume] = useState(0);
  const [startAt, setStartAt] = useState<Date>(new Date());
  const [frequency, setFrequency] = useState<DurationObjectUnits>(null);
  const [buyCondition, setBuyCondition] = useState<BuyCondition>();
  const [stopConditions, setStopConditions] = useState<StopConditions[]>([]);
  const [depositedAmount, setDepositedAmount] = useState(0);

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
    if (!solanaWallet) return;
    const response = await programService.createPocket(solanaWallet, {
      id: ProgramService.generatePocketId(),
      name: pocketName,
      baseTokenAddress,
      targetTokenAddress,
      batchVolume: new BN(batchVolume),
      startAt,
      frequency,
      buyCondition,
      stopConditions,
    });

    console.log(response);
  }, [solanaWallet]);

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
