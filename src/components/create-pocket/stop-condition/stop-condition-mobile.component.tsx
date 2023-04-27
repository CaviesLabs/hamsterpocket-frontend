import { FC, useState } from "react";
import { EndTimeConditionMobile } from "./end-time-condition-mobile.component";
import { TargetAmountCondition } from "./target-amount-condition.component";
import { BaseAmountSpendCondition } from "./base-spent-condition.component";
// import { BatchAmountCondition } from "./batch-amount-condition";
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
  const { errorMsgs, handleModifyStopConditions } = useCreatePocketPage();

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text font-[600]">
        Close pocket when reach
      </p>
      {errorMsgs?.stopConditions && (
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
          {targetAmountDisplayed && (
            <TargetAmountCondition
              displyed={targetAmountDisplayed}
              toggle={() => {
                handleModifyStopConditions("quoteTokenAmountReach", "delete");
                setTargetAmountDisplayed(false);
              }}
            />
          )}
          {baseTokenSpentDisplayed && (
            <BaseAmountSpendCondition
              displyed={baseTokenSpentDisplayed}
              toggle={() => {
                handleModifyStopConditions(
                  "spentBaseTokenAmountReach",
                  "delete"
                );
                setBaseTokenSpentDisplayed(false);
              }}
            />
          )}
          {/* {batchAmountDisplayed && (
            <BatchAmountCondition
              displyed={batchAmountDisplayed}
              toggle={() => setBatchAmountDisplayed(false)}
            />
          )} */}
        </div>
      </div>
    </section>
  );
};
