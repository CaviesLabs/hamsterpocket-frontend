import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useWallet } from "@/src/hooks/useWallet";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import { formatCurrency } from "@/src/utils";

export const DepositAmount: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    baseTokenAddress,
    setDepositedAmount,
    errorMsgs,
    setErrorMsgs,
    batchVolume,
  } = useCreatePocketPage();

  const { nativeBalance: evmBalance } = useEvmWallet();
  const { chain } = useAppWallet();

  const { whiteLists, convertDecimalAmount } = useWhiteList();

  const baseToken = whiteLists[baseTokenAddress[0]?.toBase58()?.toString()];

  /** @dev Inject program service to use. */
  const { solBalance } = useWallet();

  return (
    <section>
      <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
        Deposit amount
      </p>
      <div className="mt-2">
        <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] regular-text">
              Deposit amount
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              addressSelected={baseTokenAddress[0]?.toBase58().toString()}
              disableDropdown={true}
              onAmountChange={(val) => {
                setErrorMsgs({
                  ...errorMsgs,
                  depositedAmount:
                    val < batchVolume &&
                    "Deposit amount must be equal or greater than the each batch amount",
                });
                setDepositedAmount(val);
              }}
              placeholder="Enter amount"
            />
            <p className="mt-3 text-white text-[14px] md:text-[16px] regular-text flex">
              Available:
              <img
                src={baseToken?.image}
                alt="token balance"
                className="!w-6 mx-1 rounded w-[20px]"
              />
              {formatCurrency(
                chain === "SOL"
                  ? convertDecimalAmount(baseToken?.address, solBalance)
                  : evmBalance
              )}{" "}
              {baseToken?.symbol}
            </p>
          </div>
        </div>
        {errorMsgs?.depositedAmount && (
          <ErrorLabel message={errorMsgs.depositedAmount} />
        )}
      </div>
    </section>
  );
};
