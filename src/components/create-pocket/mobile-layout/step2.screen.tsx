import { FC } from "react";
import { DCAStrategy, StopCondition } from "@/src/components/create-pocket";

export const CreatePocketStep2: FC = () => {
  return (
    <>
      <DCAStrategy />
      <StopCondition />
    </>
  );
};
