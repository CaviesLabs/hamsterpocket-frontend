import { FC, useState } from "react";
import { PlusIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import { EndTimeCondition } from "./end-time-condition.component";
import { TargetAmountCondition } from "./target-amount-condition.component";

export const StopCondition: FC = () => {
  /**
   * @dev Displayed end time condition.
   */
  const [endTimeDisplayed, setEndTimeDisplayed] = useState(false);

  /**
   * @dev Displayed end time condition.
   */
  const [targetAmountDisplayed, setTargetAmountDisplayed] = useState(false);

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text">
        Pocket end condition
      </p>
      <div className="mt-[16px]">
        <p className="text-dark20 text-[14px] normal-text italic">
          When one of the conditions below is met, the Pocket will stop running
          the DCA strategy automatically
        </p>
        <div className="mt-[24px]">
          <div>
            <p className="text-dark10 text-[14px] normal-text">
              Deposit amount
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
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
              <div className="mr-[12px]">
                <Button
                  size="small"
                  text="Add target SOL amount"
                  className="!rounded-[100px] after:!rounded-[100px] !px-4"
                  theme={{
                    backgroundColor: "#F47048",
                    color: "#FFFFFF",
                  }}
                  icon={<PlusIcon />}
                  // onClick={() => setIsAddGameItem(true)}
                />
              </div>
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
                  // onClick={() => setIsAddGameItem(true)}
                />
              </div>
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
        </div>
      </div>
    </section>
  );
};
