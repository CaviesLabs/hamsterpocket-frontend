import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const StopLossAmount: FC = () => {
  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, setStopLossAmount, errorMsgs } =
    useCreatePocketPage();

  return (
    <section>
      <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
        Stop Loss
      </p>
      <div className="mt-2">
        <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] regular-text">
              At fixed price stop loss
            </p>
            <CurrencyInput
              addressSelected={baseTokenAddress[0]?.toBase58().toString()}
              disableDropdown={true}
              onAmountChange={(val) => {
                setStopLossAmount(val);
              }}
              placeholder="Enter amount"
            />
          </div>
        </div>
        {errorMsgs?.stopLossAmount && (
          <ErrorLabel message={errorMsgs.stopLossAmount} />
        )}
      </div>
    </section>
  );
};
