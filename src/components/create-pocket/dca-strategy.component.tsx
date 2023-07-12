import { FC, useState } from "react";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BuyConditionMobile } from "./buy-condition-mobile.component";
import { BatchOption } from "./each-batch.component";
import { FrequencyOption } from "./frequency.component";
import { StopConditionMobile } from "./stop-condition";
import { ErrorLabel } from "@/src/components/error-label";
import { PoolInformation } from "./pool-informationn.component";
import { StopLossAmount } from "./stop-loss-amount.component";
import { TakeProfitAmount } from "./take-profit-amount.component";
import dayjs from "dayjs";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { Collapse } from "react-collapse";
import {
  DropdownIconAdvancedSetting,
  UnDropdownIconAdvancedSetting,
} from "@/src/components/icons";

export const DCAStrategy: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    setStartAt,
    setBuyCondition,
    setErrorMsgs,
    setTakeProfitAmount,
    setStopLossAmount,
    handleModifyStopConditions,
    errorMsgs,
    createdEnable,
    targetTokenAddress,
  } = useCreatePocketPage();
  const { chainId } = usePlatformConfig();

  /**
   * @dev Buy condition display.
   */
  const [buyConditionDisplayed, setBuyConditionDisplayed] = useState(false);
  const [advanced, setAdvanced] = useState(false);

  return (
    <>
      <section>
        <div className="mt-6">
          <div className="md:grid md:grid-cols-2">
            <div className="md:col-span-1 max-w-[600px]">
              {chainId === ChainId.sol && (
                <div className="mb-[40px]">
                  <PoolInformation />
                </div>
              )}
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
                {errorMsgs?.startAt && createdEnable && (
                  <ErrorLabel message={errorMsgs.startAt} />
                )}
              </div>
            </div>
            <div className="md:col-span-1 max-w-[500px] md:pl-[20px]">
              <FrequencyOption />
            </div>
          </div>
          <div
            className="mt-[40px] flex justify-center items-center"
            onClick={() => setAdvanced(!advanced)}
          >
            <p className="text-center text-purple300 mr-[10px]">
              Advance setup
            </p>
            {advanced ? (
              <DropdownIconAdvancedSetting className="ml-[10px]" />
            ) : (
              <UnDropdownIconAdvancedSetting className="ml-[10px]" />
            )}
          </div>
          {/* {advanced === true && ( */}
          <Collapse isOpened={advanced}>
            <div className="md:grid md:grid-cols-2">
              <div className="md:col-span-1 max-w-[600px]">
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
                {chainId !== ChainId.sol && (
                  <div className="mt-[40px]">
                    <TakeProfitAmount />
                  </div>
                )}
              </div>
              <div className="md:col-span-1 max-w-[500px] md:pl-[20px]">
                <div className="mt-[40px]">
                  <StopConditionMobile />
                </div>
                {chainId !== ChainId.sol && (
                  <div className="mt-[40px]">
                    <StopLossAmount />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-[40px]">
              <button
                className="flex items-center justify-center rounded-[30px] mobile:w-full w-[300px] border-red300 border-[2px] border-solid py-[12px] text-red300 text-[14px] normal-text"
                onClick={() => {
                  setAdvanced(false);

                  /**
                   * @dev Reset settings.
                   */
                  setBuyCondition(null);
                  setTakeProfitAmount(null);
                  setStopLossAmount(null);

                  /**
                   * @dev Reset stop conditions.
                   */
                  handleModifyStopConditions("endTimeReach", "delete");
                  handleModifyStopConditions("baseTokenAmountReach", "delete");
                  handleModifyStopConditions("quoteTokenAmountReach", "delete");
                  handleModifyStopConditions(
                    "spentQuoteTokenAmountReach",
                    "delete"
                  );
                  handleModifyStopConditions("batchAmountReach", "delete");
                }}
              >
                Remove Advance Setup
                <svg
                  className="ml-[10px]"
                  width="19"
                  height="21"
                  viewBox="0 0 19 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.7871 3.74199C18.1761 3.74199 18.5 4.06499 18.5 4.47598V4.85598C18.5 5.25698 18.1761 5.58997 17.7871 5.58997H1.21385C0.82386 5.58997 0.5 5.25698 0.5 4.85598V4.47598C0.5 4.06499 0.82386 3.74199 1.21385 3.74199H4.12957C4.72185 3.74199 5.2373 3.321 5.37054 2.727L5.52323 2.04501C5.76054 1.11602 6.5415 0.499023 7.43527 0.499023H11.5647C12.4488 0.499023 13.2385 1.11602 13.467 1.99601L13.6304 2.726C13.7627 3.321 14.2781 3.74199 14.8714 3.74199H17.7871ZM16.3058 17.6331C16.6102 14.7961 17.1432 8.05615 17.1432 7.98815C17.1626 7.78215 17.0955 7.58715 16.9623 7.43015C16.8193 7.28316 16.6384 7.19616 16.4391 7.19616H2.56852C2.36818 7.19616 2.17756 7.28316 2.04529 7.43015C1.91108 7.58715 1.84494 7.78215 1.85467 7.98815C1.85646 8.00064 1.87558 8.23805 1.90755 8.63496C2.04958 10.3982 2.44517 15.3092 2.70079 17.6331C2.88168 19.345 4.00498 20.421 5.63206 20.46C6.88763 20.489 8.18112 20.499 9.50379 20.499C10.7496 20.499 12.0149 20.489 13.3094 20.46C14.9929 20.431 16.1152 19.374 16.3058 17.6331Z"
                    fill="#F44949"
                  />
                </svg>
              </button>
            </div>
          </Collapse>
          {/* )} */}
        </div>
      </section>
      {/* <DepositAmount /> */}
    </>
  );
};
