import { FC, useState } from "react";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyCondition } from "./buy-condition.component";
import { BatchOption } from "./each-batch.component";
import { FrequencyOption } from "./frequency.component";
import { DepositAmount } from "./deposit-amount.component";
import { ErrorLabel } from "@/src/components/error-label";
import dayjs from "dayjs";

export const DCAStrategy: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    setStartAt,
    setBuyCondition,
    setErrorMsgs,
    errorMsgs,
    targetTokenAddress,
  } = useCreatePocketPage();

  /**
   * @dev Buy condition display.
   */
  const [buyConditionDisplayed, setBuyConditionDisplayed] = useState(false);

  return (
    <>
      <section>
        <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
          Pool start time
        </p>
        <p className="mt-2 text-dark20 text-[14px] md:text-[16px] regular-text italic">
          Select a time to execute the first batch of this Pocket
        </p>
        <p className="mt-6 text-dark10 text-[14px] regular-text">
          Start time (Local time: UTC {dayjs().format("Z")})
          <span className="text-red300 relative top-[-2px] right-[-2px]">
            *
          </span>
        </p>
        <div className="mt-3 md:grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <DatetimePicker
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              onChange={(v) => {
                setErrorMsgs({
                  ...errorMsgs,
                  startAt:
                    v.getTime() < Date.now() &&
                    "Date start must be larger than now.",
                });
                setStartAt(v);
              }}
            />
          </div>
        </div>
        {errorMsgs?.startAt && <ErrorLabel message={errorMsgs.startAt} />}
      </section>
      <section>
        <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
          DCA strategy
        </p>
        <p className="text-dark20 text-[14px] md:text-[16px] regular-text italic mt-2">
          Set the conditions that must be met before each batch of tokens
          purchase is executed
        </p>
        <div className="mt-6">
          <BatchOption />
          <div className="grid md:grid-cols-5 gap-3">
            <div className="col-span-1">
              <FrequencyOption />
            </div>
          </div>
          <BuyCondition
            buyConditionDisplayed={buyConditionDisplayed}
            disabled={!targetTokenAddress.length}
            toggle={() => {
              setBuyCondition(null);
              setBuyConditionDisplayed(!buyConditionDisplayed);
            }}
          />
        </div>
      </section>
      <DepositAmount />
    </>
  );
};
