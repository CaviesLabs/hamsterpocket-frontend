import { FC, useEffect, useState, useMemo } from "react";
import {
  CurrencyInput,
  CurrencyInputBadge,
} from "@/src/components/currency-input";
import { MobileExchangeIcon, TwoWayArrowIcon } from "@/src/components/icons";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { PublicKey } from "@solana/web3.js";
import { getPriceBySolana } from "@/src/services/coingecko";
import { TargetSelectTokenModal } from "./select-token-modal.component";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useAppWallet } from "@/src/hooks/useAppWallet";

export const DCAPPair: FC = () => {
  /**
   * @dev Injected context.
   */
  const { chain } = useAppWallet();
  const { whiteLists } = useWhiteList();
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
  const baseToken = useMemo(
    () => whiteLists?.[baseTokenAddress[0]?.toBase58()?.toString()],
    [baseTokenAddress]
  );
  const targetToken = useMemo(
    () => whiteLists?.[targetTokenAddress[0]?.toBase58()?.toString()],
    [targetTokenAddress]
  );

  const handleBaseTokenSelect = (address: string, decimals?: number) => {
    setBaseTokenAddress([new PublicKey(address), decimals]);
  };
  useEffect(() => {
    if (chain === "SOL") {
      const address = baseTokenAddress[0]?.toBase58()?.toString();
      getPriceBySolana(address).then((resp: any) =>
        setBaseTokenPrice(resp[address]?.usd)
      );
    } else {
      setBaseTokenPrice(baseToken?.estimatedValue);
    }
  }, [baseTokenAddress, baseToken, chain]);

  const handleTargetTokenSelect = (address: string, decimals?: number) => {
    setTargetTokenAddress([new PublicKey(address), decimals]);
  };

  useEffect(() => {
    if (chain === "SOL") {
      const address = targetTokenAddress[0]?.toBase58()?.toString();
      if (!address) return;
      getPriceBySolana(address).then((resp: any) =>
        setTargetTokenPrice(resp[address]?.usd)
      );
    } else {
      setTargetTokenPrice(targetToken?.estimatedValue);
    }
  }, [targetTokenAddress, targetToken, chain]);

  return (
    <section>
      <LayoutWrapper
        layout={
          <>
            <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
              DCA pair
            </p>
            <div className="mt-2">
              <p className="text-dark20 text-[14px] md:text-[16px] regular-text italic mobile:hidden">
                Enter the buy and sell token pair for this pool
              </p>
              <div className="grid md:grid-cols-5 md:gap-3 mt-[24px]">
                <div className="md:col-span-2">
                  <p className="text-dark10 text-[14px] regular-text">
                    From
                    <span className="text-red300 relative top-[-2px] right-[-2px]">
                      *
                    </span>
                  </p>
                  <CurrencyInput
                    addressSelected={baseTokenAddress[0]
                      ?.toBase58()
                      ?.toString()}
                    allowedTokens={availableBaseTokens}
                    disabledInput={true}
                    disableDropdown={true}
                    onAddressSelect={(address, decimals) =>
                      handleBaseTokenSelect(address, decimals)
                    }
                  />
                  <p className="mt-1 text-dark10 text-[14px] md:text-[16px] regular-text">
                    Price: ~${baseTokenPrice?.toFixed(2)}
                  </p>
                </div>
                <div className="md:col-span-1 flex items-center justify-center">
                  <div className="rounded-[50%] p-[10px] md:p-[20px] bg-dark90">
                    <TwoWayArrowIcon className="mobile:hidden" />
                    <TwoWayArrowIcon className="md:hidden" size="12" />
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
                    addressSelected={targetTokenAddress?.[0]
                      ?.toBase58()
                      ?.toString()}
                    allowedTokens={availableTargetTokens}
                    disabledInput={true}
                    disableDropdown={true}
                    onClick={() => setTokenSelectDisplayed(true)}
                    dropdownIconDisplayed={true}
                    onAddressSelect={(address, decimals) =>
                      handleTargetTokenSelect(address, decimals)
                    }
                  />
                  <p className="mt-1 text-dark10 text-[14px] md:text-[16px] regular-text">
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
          </>
        }
        mobileLayout={
          <>
            <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[24px] text-white normal-text font-[600]">
              DCA pair
            </p>
            <div className="relative">
              <CurrencyInputBadge
                addressSelected={baseTokenAddress[0]?.toBase58()?.toString()}
                allowedTokens={availableBaseTokens}
                disabledInput={true}
                disableDropdown={true}
                onAddressSelect={(address, decimals) =>
                  handleBaseTokenSelect(address, decimals)
                }
              />
              <div
                className="absolute right-0 left-0 text-center top-[30%]"
                style={{ zIndex: 4 }}
              >
                <MobileExchangeIcon className="mx-auto" />
              </div>
              <CurrencyInputBadge
                placeholder="Select Token"
                currencyBadgeOnly={true}
                addressSelected={targetTokenAddress?.[0]
                  ?.toBase58()
                  ?.toString()}
                allowedTokens={availableTargetTokens}
                disabledInput={true}
                disableDropdown={true}
                onClick={() => setTokenSelectDisplayed(true)}
                dropdownIconDisplayed={true}
                onAddressSelect={(address, decimals) =>
                  handleTargetTokenSelect(address, decimals)
                }
              />
              <div className="flow-root mt-[16px]">
                <p className="text-[14px] regular-text float-left text-white">
                  Provider
                </p>
                <div className="regular-text flex items-center float-right">
                  <img
                    src="/assets/images/raydium.png"
                    className="w-[20px] h-[20px]"
                  />
                  <p className="text-white text-[14px] md:text-[16px] ml-[6px]">
                    Raydium
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
          </>
        }
      />
    </section>
  );
};
