import { FC, useState } from "react";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyCondition } from "./buy-condition.component";
import { BatchOption } from "./each-batch.component";
import { FrequencyOption } from "./frequency.component";
import { DepositAmount } from "./deposit-amount.component";

export const DCAStrategy: FC = () => {
  /**
   * @dev Injected context.
   */
  const { setStartAt } = useCreatePocketPage();

  /**
   * @dev Buy condition display.
   */
  const [buyConditionDisplayed, setBuyConditionDisplayed] = useState(false);

  return (
    <>
      <section>
        <p className="mt-[48px] text-[24px] text-white normal-text">
          Pool start time
        </p>
        <div className="mt-[16px]">
          <p className="text-dark20 text-[14px] normal-text italic">
            Select a time to execute the first batch of this Pocket
          </p>
        </div>
        <div className="mt-[24px] md:grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <DatetimePicker onChange={(v) => setStartAt(v)} />
          </div>
        </div>
      </section>
      <section>
        <p className="mt-[48px] text-[24px] text-white normal-text">
          DCA strategy
        </p>
        <div className="mt-[16px]">
          <p className="text-dark20 text-[14px] normal-text italic">
            Set the conditions that must be met before each batch of tokens
            purchase is executed
          </p>
          <BuyCondition
            buyConditionDisplayed={buyConditionDisplayed}
            toggle={() => setBuyConditionDisplayed(!buyConditionDisplayed)}
          />
          <BatchOption />
          <FrequencyOption />
        </div>
      </section>
      <DepositAmount />
    </>
  );
};
