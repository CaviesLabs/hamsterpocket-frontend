import { FC, useEffect } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import {
  // PoolInformation,
  DCAPPair,
  DCAStrategy,
  StopCondition,
  TakeProfitAmount,
  StopLossAmount,
} from "@/src/components/create-pocket";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useValidate } from "@/src/hooks/pages/create-pocket/useValidate";

export const CreatePocketDesktopLayout: FC = () => {
  /** @dev Injected context to use. */
  const { handleCreatePocket, setErrorMsgs, processing } =
    useCreatePocketPage();

  /** @dev Validate all properties if each is not valid. */
  const { errors } = useValidate();

  /** @dev Update error messages in context when having changes. */
  useEffect(() => setErrorMsgs(errors), [errors, setErrorMsgs]);

  return (
    <LayoutSection className="md:pt-[100px] pb-[100px]">
      <p className="md:text-[32px] text-[18px] text-white mt-[24px]">
        Create a new Pocket
      </p>
      {/* <PoolInformation /> */}
      <DCAPPair />
      <DCAStrategy />
      <TakeProfitAmount />
      <StopLossAmount />
      <StopCondition />
      <section className="mt-14 flow-root">
        <div className="float-right ml-[20px]">
          <Button
            className="float-right !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0 normal-text font-semibold"
            text="Create pocket"
            loading={processing}
            onClick={() => handleCreatePocket()}
          />
        </div>
        <div className="float-right">
          <Button
            className="float-right !border-solid !border-purple !border-[2px]  !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0  normal-text font-semibold"
            theme={{
              backgroundColor: "transparent",
              color: "#B998FB",
              hoverColor: "#B998FB",
            }}
            text="Back"
          />
        </div>
      </section>
    </LayoutSection>
  );
};
