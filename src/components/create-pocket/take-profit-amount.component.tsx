import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const TakeProfitAmount: FC = () => {
  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, setTakeProfitAmount, errorMsgs, createdEnable } =
    useCreatePocketPage();

  return (
    <section>
      <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
        Take Profit
      </p>
      <div className="mt-2">
        <div className="mt-[24px]">
          <div>
            <p className="text-dark10 text-[14px] regular-text">
              At fixed price target
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
        {errorMsgs?.takeProfitAmount && createdEnable && (
          <ErrorLabel message={errorMsgs.takeProfitAmount} />
        )}
      </div>
    </section>
  );
};
