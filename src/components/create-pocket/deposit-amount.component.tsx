import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const DepositAmount: FC = () => {
  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, setDepositedAmount, errorMsgs } =
    useCreatePocketPage();

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text">
        Deposit amount
      </p>
      <div className="mt-[16px]">
        <p className="text-dark20 text-[14px] normal-text italic">
          Deposit amount must be equal or greater than the each batch amount
        </p>
        <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] normal-text">
              Deposit amount
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              addressSelected={baseTokenAddress[0]?.toBase58().toString()}
              disableDropdown={true}
              onAmountChange={(val) => {
                setDepositedAmount(val);
              }}
              placeholder="Enter amount"
            />
          </div>
        </div>
        {errorMsgs?.depositedAmount && (
          <ErrorLabel message={errorMsgs.depositedAmount} />
        )}
      </div>
    </section>
  );
};
