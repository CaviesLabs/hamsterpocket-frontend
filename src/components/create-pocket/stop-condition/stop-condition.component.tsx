import { FC, useState } from "react";
import { PlusIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import { EndTimeCondition } from "./end-time-condition.component";
import { TargetAmountCondition } from "./target-amount-condition.component";
import { BaseAmountSpendCondition } from "./base-spent-condition.component";
import { BatchAmountCondition } from "./batch-amount-condition";
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
  const [batchAmountDisplayed, setBatchAmountDisplayed] = useState(false);

  /**
   * @dev Injected context.
   */
  const { errorMsgs } = useCreatePocketPage();

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text font-[600]">
        Pocket end condition
      </p>
      {errorMsgs?.stopConditions && (
        <ErrorLabel message={errorMsgs.stopConditions} />
      )}
      <div className="mt-[16px]">
        <p className="text-dark20 text-[14px] normal-text italic">
          When one of the conditions below is met, the Pocket will stop running
          the DCA strategy automatically
        </p>
        <div className="mt-[24px]">
          <div>
            <div className="mt-[10px] inline-flex">
              {!endTimeDisplayed && (
                <div className="float-left mr-[12px]">
                  <Button
                    size="small"
                    text="Add End time"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4"
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
                <div className="mr-[12px]">
                  <Button
                    size="small"
                    text="Add target token amount"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4"
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
                <div className="mr-[12px]">
                  <Button
                    size="small"
                    text="Add target token spent amount"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4"
                    theme={{
                      backgroundColor: "#F47048",
                      color: "#FFFFFF",
                    }}
                    icon={<PlusIcon />}
                    onClick={() => setBaseTokenSpentDisplayed(true)}
                  />
                </div>
              )}
              {!batchAmountDisplayed && (
                <div className="mr-[12px]">
                  <Button
                    size="small"
                    text="Add target batches purchased"
                    className="!rounded-[100px] after:!rounded-[100px] !px-4"
                    theme={{
                      backgroundColor: "#97B544",
                      color: "#FFFFFF",
                    }}
                    icon={<PlusIcon />}
                    onClick={() => setBatchAmountDisplayed(true)}
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
              toggle={() => setEndTimeDisplayed(false)}
            />
          )}
          {targetAmountDisplayed && (
            <TargetAmountCondition
              displyed={targetAmountDisplayed}
              toggle={() => setTargetAmountDisplayed(false)}
            />
          )}
          {baseTokenSpentDisplayed && (
            <BaseAmountSpendCondition
              displyed={baseTokenSpentDisplayed}
              toggle={() => setBaseTokenSpentDisplayed(false)}
            />
          )}
          {batchAmountDisplayed && (
            <BatchAmountCondition
              displyed={batchAmountDisplayed}
              toggle={() => setBatchAmountDisplayed(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
};
