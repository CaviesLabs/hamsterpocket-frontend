import { FC, useState } from "react";
import { EndTimeConditionMobile } from "./end-time-condition-mobile.component";
import { BaseAmountSpendConditionMobile } from "./base-spent-condition-mobile.component";
import { TargetAmountConditionMobile } from "./target-amount-condition-mobile.component";
import { ErrorLabel } from "@/src/components/error-label";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const StopConditionMobile: FC = () => {
  /**
   * @dev Displayed end time condition.
   */
  const [endTimeDisplayed, setEndTimeDisplayed] = useState(false);

  /**
   * @dev Displayed end time condition.
   */
  const [targetAmountDisplayed, setTargetAmountDisplayed] = useState(false);

  /**
   * @dev Displayed end time condition.
   */
  const [baseTokenSpentDisplayed, setBaseTokenSpentDisplayed] = useState(false);

  /**
   * @dev Displayed end time condition.
   */
  // const [batchAmountDisplayed, setBatchAmountDisplayed] = useState(false);

  /**
   * @dev Injected context.
   */
  const { errorMsgs, createdEnable, handleModifyStopConditions } =
    useCreatePocketPage();

  return (
    <section>
      <p className="mt-[48px] text-[20px] mobile:text-[14px] text-dark50 normal-text">
        Close pocket when reach
      </p>
      {errorMsgs?.stopConditions && createdEnable && (
        <ErrorLabel message={errorMsgs.stopConditions} />
      )}
      <div className="mt-2">
        <div className="mt-[24px]">
          <EndTimeConditionMobile
            displyed={endTimeDisplayed}
            toggle={() => {
              handleModifyStopConditions("endTimeReach", "delete");
              setEndTimeDisplayed(false);
            }}
          />
          <BaseAmountSpendConditionMobile
            displyed={baseTokenSpentDisplayed}
            toggle={() => {
              handleModifyStopConditions("spentBaseTokenAmountReach", "delete");
              setBaseTokenSpentDisplayed(false);
            }}
          />
          <TargetAmountConditionMobile
            displyed={targetAmountDisplayed}
            toggle={() => {
              handleModifyStopConditions("quoteTokenAmountReach", "delete");
              setTargetAmountDisplayed(false);
            }}
          />
        </div>
      </div>
    </section>
  );
};
