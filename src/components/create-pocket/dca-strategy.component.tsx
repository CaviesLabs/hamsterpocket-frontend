import { FC, useState } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyCondition } from "./buy-condition.component";
import { BatchOption } from "./each-batch.component";
import { FrequencyOption } from "./frequency.component copy";

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
      <section>
        <p className="mt-[48px] text-[24px] text-white normal-text">
          Deposit amount
        </p>
        <div className="mt-[16px]">
          <p className="text-dark20 text-[14px] normal-text italic">
            Deposit {">="} amount each batch
          </p>
          <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
            <div className="md:col-span-2">
              <p className="text-dark10 text-[14px] normal-text">
                Deposit amount
                <span className="text-red300 relative top-[-2px] right-[-2px]">
                  *
                </span>
              </p>
              <CurrencyInput />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
