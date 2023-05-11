import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const TakeProfitAmount: FC = () => {
  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, setTakeProfitAmount, errorMsgs } =
    useCreatePocketPage();

  return (
    <section>
      <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
        Take Profit
      </p>
      <div className="mt-2">
        <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] regular-text">
              At fixed price target
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              addressSelected={baseTokenAddress[0]?.toBase58().toString()}
              disableDropdown={true}
              onAmountChange={(val) => {
                setTakeProfitAmount(val);
              }}
              placeholder="Enter amount"
            />
          </div>
        </div>
        {errorMsgs?.takeProfitAmount && (
          <ErrorLabel message={errorMsgs.takeProfitAmount} />
        )}
      </div>
    </section>
  );
};