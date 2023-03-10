import { FC, useEffect, useState } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { TwoWayArrowIcon } from "@/src/components/icons";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { PublicKey } from "@solana/web3.js";
import { getPriceBySolana } from "@/src/services/coingecko";
import { TargetSelectTokenModal } from "./select-token-modal.component";

export const DCAPPair: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    baseTokenAddress,
    targetTokenAddress,
    availableBaseTokens,
    availableTargetTokens,
    setBaseTokenAddress,
    setTargetTokenAddress,
  } = useCreatePocketPage();

  /**
   * @desc Define state of token price for base and target
   */
  const [baseTokenPrice, setBaseTokenPrice] = useState<number>(0);
  const [targetTokenPrice, setTargetTokenPrice] = useState<number>(0);

  /** @dev Condition to show modal to select target token. */
  const [tokenSelectDisplayed, setTokenSelectDisplayed] = useState(false);

  /**
   * @desc handle change token and update token price from coingecko
   */

  const handleBaseTokenSelect = (address: string, decimals?: number) => {
    setBaseTokenAddress([new PublicKey(address), decimals]);
  };
  useEffect(() => {
    const address = baseTokenAddress[0]?.toBase58()?.toString();
    getPriceBySolana(address).then((resp: any) =>
      setBaseTokenPrice(resp[address]?.usd)
    );
  }, [baseTokenAddress]);

  const handleTargetTokenSelect = (address: string, decimals?: number) => {
    setTargetTokenAddress([new PublicKey(address), decimals]);
  };
  useEffect(() => {
    const address = targetTokenAddress[0]?.toBase58()?.toString();
    if (!address) return;
    getPriceBySolana(address).then((resp: any) =>
      setTargetTokenPrice(resp[address]?.usd)
    );
  }, [targetTokenAddress]);

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text font-[600]">
        DCA pair
      </p>
      <div className="mt-2">
        <p className="text-dark20 text-[16px] regular-text italic">
          Enter the buy and sell token pair for this pool
        </p>
        <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] regular-text">
              From
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              addressSelected={baseTokenAddress[0]?.toBase58()?.toString()}
              allowedTokens={availableBaseTokens}
              disabledInput={true}
              disableDropdown={true}
              onAddressSelect={(address, decimals) =>
                handleBaseTokenSelect(address, decimals)
              }
            />
            <p className="mt-1 text-dark10 text-[16px] regular-text">
              Price: ~${baseTokenPrice?.toFixed(2)}
            </p>
          </div>
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="rounded-[50%] p-[20px] bg-dark90">
              <TwoWayArrowIcon />
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] regular-text">
              To
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              placeholder="Select Token"
              currencyBadgeOnly={true}
              addressSelected={targetTokenAddress?.[0]?.toBase58()?.toString()}
              allowedTokens={availableTargetTokens}
              disabledInput={true}
              disableDropdown={true}
              onClick={() => setTokenSelectDisplayed(true)}
              dropdownIconDisplayed={true}
              onAddressSelect={(address, decimals) =>
                handleTargetTokenSelect(address, decimals)
              }
            />
            <p className="mt-1 text-dark10 text-[16px] regular-text">
              Price: ~${targetTokenPrice?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <TargetSelectTokenModal
        isModalOpen={tokenSelectDisplayed}
        handleCancel={() => setTokenSelectDisplayed(false)}
        handleOk={(_, address, decimals) => {
          setTokenSelectDisplayed(false);
          handleTargetTokenSelect(address, decimals);
        }}
      />
    </section>
  );
};
