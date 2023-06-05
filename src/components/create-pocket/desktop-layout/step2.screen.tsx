import { FC } from "react";
import { DCAPPair } from "@/src/components/create-pocket";
import { DCAStrategy } from "../dca-strategy.component";

export const CreatePocketStep2Desktop: FC = () => {
  return (
    <>
      <DCAPPair />
      <DCAStrategy />
    </>
  );
};
