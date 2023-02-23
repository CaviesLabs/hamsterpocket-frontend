import { ReactNode, useState } from "react";
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
  const [stopConditions] = useState<StopConditions[]>([]);

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
        setPocketName,
        setBaseTokenAddress,
        setTargetTokenAddress,
        setBatchVolume,
        setStartAt,
        setFrequency,
        setBuyCondition,
      }}
    >
      {props.children}
    </CreatePocketContext.Provider>
  );
};