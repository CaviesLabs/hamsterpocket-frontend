import { FC, useEffect, useState, useCallback } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useValidate } from "@/src/hooks/pages/create-pocket/useValidate";
import { LeftArrowIcon } from "@/src/components/icons";
import { Carousel } from "react-responsive-carousel";
import { CreatePocketStep1, CreatePocketStep2 } from "./mobile-layout";

export const CreatePocketMobileLayout: FC = () => {
  /** @dev Injected context to use. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleCreatePocket, setErrorMsgs, processing } =
    useCreatePocketPage();

  /**
   * @dev Define step state.
   */
  const [currentStep, setCurrentStep] = useState(0);

  /** @dev Validate all properties if each is not valid. */
  const { errors } = useValidate();

  /**
   * @dev The function to process when click next.
   * @returns {Function}
   */
  const handleNextStep = useCallback(async () => {
    try {
      if (currentStep === 2) {
        /**
         * @dev validate user has entered expire time
         * before going to next step
         */
        // await formProposal.validateFields();
      }
      setCurrentStep((prev) => prev + 1);
      // stepperRef.current.nextHandler();
    } catch {}
  }, [currentStep]);

  /**
   * @dev The function to process when click previous.
   * @returns {Function}
   */
  const handleBackStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
    // stepperRef.current.prevHandler();
  }, [currentStep]);

  /** @dev Update error messages in context when having changes. */
  useEffect(() => setErrorMsgs(errors), [errors, setErrorMsgs]);

  return (
    <LayoutSection className="mobile:mt-0 mobile:pt-0 pb-[100px]">
      <div className="flex items-center">
        {currentStep > 0 && (
          <button onClick={() => handleBackStep()} className="mr-[20px]">
            <LeftArrowIcon />
          </button>
        )}
        <p className="md:text-[32px] text-[18px] text-white">
          Create auto-invest DCA
        </p>
      </div>
      <Carousel
        autoPlay={false}
        showIndicators={false}
        selectedItem={currentStep}
      >
        <CreatePocketStep1 />
        <CreatePocketStep2 />
      </Carousel>
      <section className="mt-14 flow-root">
        <div className="float-right ml-[20px]">
          <Button
            className="float-right !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0 normal-text font-semibold"
            text={currentStep > 0 ? "Create pocket" : "Continue"}
            loading={processing}
            onClick={() =>
              currentStep ? handleCreatePocket() : handleNextStep()
            }
          />
        </div>
        {currentStep > 0 && (
          <div className="float-right">
            <Button
              className="float-right !border-solid !border-purple300 !border-[2px]  !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0  normal-text font-semibold"
              theme={{
                backgroundColor: "transparent",
                color: "#735CF7",
                hoverColor: "#735CF7",
              }}
              text="Back"
              onClick={handleBackStep}
            />
          </div>
        )}
      </section>
    </LayoutSection>
  );
};
