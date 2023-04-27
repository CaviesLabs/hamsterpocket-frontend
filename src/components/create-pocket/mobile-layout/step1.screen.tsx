import { FC } from "react";
import {
  PoolInformation,
  DCAPPair,
  BatchOption,
  FrequencyOption,
  DCAStrategyMobileLayout,
  StopConditionMobile,
  TakeProfitOption,
  StopLossOption,
} from "@/src/components/create-pocket";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import dayjs from "dayjs";

export const CreatePocketStep1: FC = () => {
  /**
   * @dev Injected context.
   */
  const { setStartAt, setErrorMsgs, errorMsgs } = useCreatePocketPage();

  return (
    <>
      <PoolInformation />
      <DCAPPair />
      <div className="mt-[16px]">
        <FrequencyOption />
      </div>
      <div className="mt-[16px]">
        <BatchOption />
      </div>
      <div className="mt-[16px]">
        <p className="mt-2 text-dark20 text-[14px] md:text-[16px] regular-text italic">
          Select a time to execute the first batch of this Pocket
        </p>
        <p className="mt-6 text-dark10 text-[14px] regular-text">
          First batch time <span className="text-dark50">(+7Hrs)</span>
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
      </div>
      <div className="mt-[16px]">
        <DCAStrategyMobileLayout />
      </div>
      <div className="mt-[16px]">
        <StopConditionMobile />
      </div>
      <div className="mt-[16px]">
        <TakeProfitOption />
      </div>
      <div className="mt-[16px]">
        <StopLossOption />
      </div>
    </>
  );
};
