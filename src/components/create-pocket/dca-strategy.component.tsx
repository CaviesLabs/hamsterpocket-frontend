import { FC, useState } from "react";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyCondition } from "./buy-condition.component";
import { BatchOption } from "./each-batch.component";
import { FrequencyOption } from "./frequency.component";
import { DepositAmount } from "./deposit-amount.component";
import dayjs from "dayjs";

export const DCAStrategy: FC = () => {
  /**
   * @dev Injected context.
   */
  const { setStartAt, setBuyCondition } = useCreatePocketPage();

  /**
   * @dev Buy condition display.
   */
  const [buyConditionDisplayed, setBuyConditionDisplayed] = useState(false);

  return (
    <>
      <section>
        <p className="mt-[48px] text-[24px] text-white normal-text font-[600]">
          Pool start time
        </p>
        <p className="mt-2 text-dark20 text-[14px] normal-text italic">
          Select a time to execute the first batch of this Pocket
        </p>
        <p className="mt-6 text-dark10 text-[14px] normal-text">
          Start time (UTC)
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
              onChange={(v) => setStartAt(v)}
            />
          </div>
        </div>
      </section>
      <section>
        <p className="mt-[48px] text-[24px] text-white normal-text font-[600]">
          DCA strategy
        </p>
        <div className="mt-[16px]">
          <BatchOption />
          <p className="text-dark20 text-[14px] normal-text italic mt-[24px]">
            Set the conditions that must be met before each batch of tokens
            purchase is executed
          </p>
          <BuyCondition
            buyConditionDisplayed={buyConditionDisplayed}
            toggle={() => {
              setBuyCondition(null);
              setBuyConditionDisplayed(!buyConditionDisplayed);
            }}
          />
          <div className="grid md:grid-cols-5 gap-3">
            <div className="col-span-1">
              <FrequencyOption />
            </div>
          </div>
        </div>
      </section>
      <DepositAmount />
    </>
  );
};
