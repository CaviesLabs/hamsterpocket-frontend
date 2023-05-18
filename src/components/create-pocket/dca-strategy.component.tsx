import { FC, useState } from "react";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyConditionMobile } from "./buy-condition-mobile.component";
import { BatchOption } from "./each-batch.component";
import { FrequencyOption } from "./frequency.component";
import { StopConditionMobile } from "./stop-condition";
import { ErrorLabel } from "@/src/components/error-label";
// import { DepositAmount } from "./deposit-amount.component";
import { StopLossAmount } from "./stop-loss-amount.component";
import { TakeProfitAmount } from "./take-profit-amount.component";
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
        <div className="mt-6">
          <div className="md:grid md:grid-cols-2">
            <div className="md:col-span-1 max-w-[600px]">
              <BatchOption />
              <div className="mt-[40px]">
                <p className="mobile:text-[14px] text-[20px] text-dark50 regular-text">
                  First batch time (+7Hrs)
                </p>
                <div className="mt-[8px]">
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
                {errorMsgs?.startAt && (
                  <ErrorLabel message={errorMsgs.startAt} />
                )}
              </div>
              <div className="mt-[40px]">
                <BuyConditionMobile
                  buyConditionDisplayed={buyConditionDisplayed}
                  disabled={!targetTokenAddress.length}
                  toggle={() => {
                    setBuyCondition(null);
                    setBuyConditionDisplayed(!buyConditionDisplayed);
                  }}
                />
              </div>
              <div className="mt-[40px]">
                <TakeProfitAmount />
              </div>
            </div>
            <div className="md:col-span-1 max-w-[500px] md:pl-[20px]">
              <FrequencyOption />
              <div className="mt-[40px]">
                <StopConditionMobile />
              </div>
              <div className="mt-[40px]">
                <StopLossAmount />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <DepositAmount /> */}
    </>
  );
};
