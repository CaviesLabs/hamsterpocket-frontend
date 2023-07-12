import { FC, useCallback } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useWallet } from "@/src/hooks/useWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import { formatCurrency } from "@/src/utils";
import { useAptosWallet } from "@/src/hooks/useAptos";

export const DepositAmount: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    baseTokenAddress,
    errorMsgs,
    createdEnable,
    batchVolume,
    setDepositedAmount,
    setErrorMsgs,
  } = useCreatePocketPage();

  const { nativeBalance: evmBalance } = useEvmWallet();
  const { balance: aptosBalance } = useAptosWallet();
  const { chainId } = usePlatformConfig();

  const { whiteLists, convertDecimalAmount } = useWhiteList();

  const baseToken = whiteLists[baseTokenAddress[0]?.toBase58()?.toString()];

  /** @dev Inject program service to use. */
  const { solBalance } = useWallet();

  const renderBalance = useCallback(() => {
    if (chainId === ChainId.sol) {
      return convertDecimalAmount(baseToken?.address, solBalance);
    } else if (chainId.includes("aptos")) {
      return aptosBalance;
    } else {
      return evmBalance;
    }
  }, [chainId, solBalance, evmBalance, aptosBalance]);

  return (
    <section>
      <p className="mt-[20px] md:mt-[48px] text-[14px] md:text-[20px] text-dark50 regular-text">
        Deposit amount
      </p>
      <div className="mt-2">
        <div>
          <CurrencyInput
            addressSelected={baseTokenAddress[0]?.toBase58().toString()}
            disableDropdown={true}
            placeholder="Enter amount"
            onAmountChange={(val) => {
              setDepositedAmount(val);
              setErrorMsgs({
                ...errorMsgs,
                depositedAmount:
                  val < batchVolume &&
                  "Deposit amount must be equal or greater than the each batch amount",
              });
            }}
          />
          <p className="mt-3 text-white text-[14px] md:text-[16px] regular-text flex">
            Available:
            <img
              src={baseToken?.image}
              alt="token balance"
              className="!w-6 mx-1 rounded w-[20px]"
            />
            {formatCurrency(renderBalance())} {baseToken?.symbol}
          </p>
        </div>
        {errorMsgs?.depositedAmount && createdEnable && (
          <ErrorLabel message={errorMsgs.depositedAmount} />
        )}
      </div>
    </section>
  );
};
