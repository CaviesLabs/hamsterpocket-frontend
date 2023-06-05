import { FC, useCallback, useEffect, useState } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useValidate } from "@/src/hooks/pages/create-pocket/useValidate";
import { Carousel } from "react-responsive-carousel";
import { PublicKey } from "@solana/web3.js";
import { CreatePocketStep1Desktop } from "./desktop-layout/step1.screen";
import { CreatePocketStep2Desktop } from "./desktop-layout/step2.screen";
import { CreatePocketStep3Desktop } from "./desktop-layout/step3.screen";
import classNames from "classnames";

export const CreatePocketDesktopLayout: FC = () => {
  /** @dev Injected context to use. */
  const {
    handleCreatePocket,
    setErrorMsgs,
    processing,
    setTargetTokenAddress,
  } = useCreatePocketPage();

  /** @dev Define current step layout. */
  const [currentStep, setCurrentStep] = useState(0);

  /** @dev Validate all properties if each is not valid. */
  const { errors } = useValidate();

  /** @dev The function when click on action button. */
  const handleClickContinue = useCallback(() => {
    if (currentStep <= 1) {
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
      <div className="grid grid-cols-3 mt-[20px]">
        <div className="col-span-1 mr-[20px]">
          <p
            className={classNames("text-dark3 normal-text text-[14px]", {
              "!text-purple300": currentStep >= 0,
            })}
          >
            1. Select Pair
          </p>
          <div
            className={classNames("progress-cap", { active: currentStep >= 0 })}
          ></div>
        </div>
        <div className="col-span-1 mr-[20px]">
          <p
            className={classNames("text-dark3 normal-text text-[14px]", {
              "!text-purple300": currentStep >= 1,
            })}
          >
            2. Strategy
          </p>
          <div
            className={classNames("progress-cap", { active: currentStep >= 1 })}
          ></div>
        </div>
        <div className="col-span-1 mr-[20px]">
          <p
            className={classNames("text-dark3 normal-text text-[14px]", {
              "!text-purple300": currentStep >= 2,
            })}
          >
            3. Deposot & Confirm
          </p>
          <div
            className={classNames("progress-cap", { active: currentStep >= 2 })}
          ></div>
        </div>
      </div>
      <Carousel
        autoPlay={false}
        showIndicators={false}
        selectedItem={currentStep}
        showThumbs={false}
      >
        <CreatePocketStep1Desktop
          handleSelectToken={(_, address, decimals) => {
            setTargetTokenAddress([new PublicKey(address), decimals]);
            handleClickContinue();
          }}
        />
        <CreatePocketStep2Desktop />
        <CreatePocketStep3Desktop />
      </Carousel>
      <section className="mt-14 flow-root">
        <div className="float-right ml-[20px]">
          <Button
            className="float-right !w-[220px] !h-[56px] !text-[18px] mobile:!text-[14px] mobile:!w-[150px] mobile:!h-[40px] mobile:!py-0 normal-text font-semibold"
            text={currentStep > 1 ? "Create Pocket" : "Continue"}
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
