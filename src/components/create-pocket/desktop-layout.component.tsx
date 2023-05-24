import { FC, useCallback, useEffect, useState } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import { DCAPPair } from "@/src/components/create-pocket";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useValidate } from "@/src/hooks/pages/create-pocket/useValidate";
import { Carousel } from "react-responsive-carousel";
import { CreatePocketStep1Desktop } from "./desktop-layout/step1.screen";
import { CreatePocketStep2Desktop } from "./desktop-layout/step2.screen";

export const CreatePocketDesktopLayout: FC = () => {
  /** @dev Injected context to use. */
  const { handleCreatePocket, setErrorMsgs, processing } =
    useCreatePocketPage();

  /** @dev Define current step layout. */
  const [currentStep, setCurrentStep] = useState(0);

  /** @dev Validate all properties if each is not valid. */
  const { errors } = useValidate();

  /** @dev The function when click on action button. */
  const handleClickContinue = useCallback(() => {
    if (currentStep <= 0) {
      return setCurrentStep(currentStep + 1);
    } else {
      return handleCreatePocket();
    }
  }, [currentStep, setCurrentStep, handleCreatePocket]);

  /** @dev Update error messages in context when having changes. */
  useEffect(() => setErrorMsgs(errors), [errors, setErrorMsgs]);

  return (
    <LayoutSection className="md:pt-[100px] pb-[100px]">
      <p className="md:text-[32px] text-[18px] text-white mt-[24px]">
        Create auto-invest DCA
      </p>
      <DCAPPair />
      <Carousel
        autoPlay={false}
        showIndicators={false}
        selectedItem={currentStep}
      >
        <CreatePocketStep1Desktop />
        <CreatePocketStep2Desktop />
      </Carousel>
      <section className="mt-14 flow-root">
        <div className="float-right ml-[20px]">
          <Button
            className="float-right !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0 normal-text font-semibold"
            text={currentStep > 0 ? "Create Pocket" : "Continue"}
            loading={!processing ? false : true}
            onClick={() => handleClickContinue()}
          />
        </div>
        {currentStep > 0 && (
          <div className="float-right">
            <Button
              className="float-right !border-solid !border-purple300 !border-[2px]  !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0  normal-text font-semibold"
              onClick={() => setCurrentStep(0)}
              theme={{
                backgroundColor: "transparent",
                color: "#735CF7",
                hoverColor: "#735CF7",
              }}
              text="Back"
            />
          </div>
        )}
      </section>
    </LayoutSection>
  );
};
