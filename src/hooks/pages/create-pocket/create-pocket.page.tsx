import { ReactNode, useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";
import { CreatePocketContext } from "./types";

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

  /**
   * @dev The function to modify stop conditions.
   */
  const handleModifyStopConditions = useCallback(
    (excuted = false, key: string, value: any) => {
      setStopConditions((prev) => {
        /**
         * @dev Reset conditions arrays by removing asset.
         */
        const newConditions = prev.filter((item) => {
          return !Object.keys(item).includes(key);
        });

        /** @dev Add condition. */
        if (excuted) {
          newConditions.push({ [key]: value });
        }

        return newConditions;
      });
    },
    [stopConditions]
  );

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
      }}
    >
      {props.children}
    </CreatePocketContext.Provider>
  );
};
