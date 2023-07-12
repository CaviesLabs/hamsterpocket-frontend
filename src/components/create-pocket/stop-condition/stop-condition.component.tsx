import { FC, useState } from "react";
import { PlusIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import { EndTimeCondition } from "./end-time-condition.component";
import { TargetAmountCondition } from "./target-amount-condition.component";
import { BaseAmountSpendCondition } from "./base-spent-condition.component";
// import { BatchAmountCondition } from "./batch-amount-condition";
import { ErrorLabel } from "@/src/components/error-label";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const StopCondition: FC = () => {
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
      <p className="mt-[48px] text-[24px] text-white normal-text font-[600]">
        Pocket end condition
      </p>
      {errorMsgs?.stopConditions && createdEnable && (
        <ErrorLabel message={errorMsgs.stopConditions} />
      )}
      <div className="mt-2">
        <p className="text-dark20 text-[14px] regular-text italic">
          When one of the conditions below is met, the Pocket will stop running
          the DCA strategy automatically
        </p>
        <div className="mt-[24px]">
          <div>
            <div className="mt-[10px] md:inline-flex">
              {!endTimeDisplayed && (
                <div className="md:float-left mr-[12px]">
                  <Button
                    size="small"
                    text="Add End time"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4 normal-text font-semibold"
                    theme={{
                      backgroundColor: "#7A6DFF",
                      color: "#FFFFFF",
                    }}
                    icon={<PlusIcon />}
                    onClick={() => setEndTimeDisplayed(true)}
                  />
                </div>
              )}
              {!targetAmountDisplayed && (
                <div className="mr-[12px] mobile:mt-[16px]">
                  <Button
                    size="small"
                    text="Add target token amount"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4 normal-text font-semibold"
                    theme={{
                      backgroundColor: "#41ADD1",
                      color: "#FFFFFF",
                    }}
                    icon={<PlusIcon />}
                    onClick={() => setTargetAmountDisplayed(true)}
                  />
                </div>
              )}
              {!baseTokenSpentDisplayed && (
                <div className="mr-[12px] mobile:mt-[16px]">
                  <Button
                    size="small"
                    text="Add target token spent amount"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4 normal-text font-semibold"
                    theme={{
                      backgroundColor: "#F47048",
                      color: "#FFFFFF",
                    }}
                    icon={<PlusIcon />}
                    onClick={() => setBaseTokenSpentDisplayed(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-[24px]">
          {endTimeDisplayed && (
            <EndTimeCondition
              displyed={endTimeDisplayed}
              toggle={() => {
                handleModifyStopConditions("endTimeReach", "delete");
                setEndTimeDisplayed(false);
              }}
            />
          )}
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
