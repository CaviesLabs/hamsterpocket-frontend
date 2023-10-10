import { FC, useEffect, useState, useMemo } from "react";
import {
  CurrencyInputBadge,
  CurrencyBage,
} from "@/src/components/currency-input";
import { MobileExchangeIcon, TwoWayArrowIcon } from "@/src/components/icons";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { PublicKey } from "@solana/web3.js";
import { getPriceBySolana } from "@/src/services/coingecko";
import { TargetSelectTokenModal } from "./select-token-modal.component";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";

export const DCAPPair: FC = () => {
  /**
   * @dev Injected context.
   */
  const { chainId, platformConfig } = usePlatformConfig();
  const { whiteLists, analyzeDecimals } = useWhiteList();
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
    [baseTokenAddress, whiteLists]
  );
  const targetToken = useMemo(
    () => whiteLists?.[targetTokenAddress[0]?.toBase58()?.toString()],
    [targetTokenAddress, whiteLists]
  );

  const handleBaseTokenSelect = (address: string, decimals?: number) => {
    setBaseTokenAddress([new PublicKey(address), decimals]);
  };
  useEffect(() => {
    if (chainId === ChainId.sol) {
      const address = baseTokenAddress[0]?.toBase58()?.toString();
      getPriceBySolana(address).then((resp: any) =>
        setBaseTokenPrice(resp[address]?.usd)
      );
    } else {
      setBaseTokenPrice(baseToken?.estimatedValue);
    }
  }, [baseTokenAddress, baseToken, chainId]);

  const handleTargetTokenSelect = (address: string, decimals?: number) => {
    setTargetTokenAddress([new PublicKey(address), decimals]);
  };

  useEffect(() => {
    if (chainId === ChainId.sol) {
      const address = targetTokenAddress[0]?.toBase58()?.toString();
      if (!address) return;
      getPriceBySolana(address).then((resp: any) =>
        setTargetTokenPrice(resp[address]?.usd)
      );
    } else {
      setTargetTokenPrice(targetToken?.estimatedValue);
    }
  }, [targetTokenAddress, targetToken, chainId]);

  return (
    <section>
      <LayoutWrapper
        layout={
          <>
            <p className="mt-[20px] md:mt-[48px] text-[18px] md:text-[20px] text-dark50 normal-text font-[600]">
              DCA pair
            </p>
            <div className="mt-2 bg-dark100 rounded-[12px] py-[50px] px-[20px]">
              <div className="flex mt-[24px] justify-center">
                <div className="md:col-span-2">
                  <CurrencyBage
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
                  <p className="mt-1 text-dark50 text-[14px] regular-text">
                    Price: ~${analyzeDecimals(baseTokenPrice)}
                  </p>
                </div>
                <div className="md:col-span-1 flex items-center justify-center px-[100px]">
                  <div className="rounded-[50%] p-[10px] md:p-[20px] bg-dark90">
                    <TwoWayArrowIcon className="mobile:hidden" />
                    <TwoWayArrowIcon className="md:hidden" size="12" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <CurrencyBage
                    placeholder="Select Token"
                    currencyBadgeOnly={true}
                    addressSelected={targetTokenAddress?.[0]
                      ?.toBase58()
                      ?.toString()}
                    allowedTokens={availableTargetTokens}
                    disabledInput={true}
                    disableDropdown={true}
                    onClick={() => setTokenSelectDisplayed(true)}
                    dropdownIconDisplayed={false}
                    onAddressSelect={(address, decimals) =>
                      handleTargetTokenSelect(address, decimals)
                    }
                  />
                  <p className="mt-1 text-dark50 text-[14px] regular-text">
                    Price: ~${analyzeDecimals(targetTokenPrice)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flow-root mt-[16px]">
              <p className="text-[14px] regular-text float-left text-white">
                Provider
              </p>
              <div className="regular-text flex items-center float-right">
                <p className="text-white text-[14px] md:text-[16px] ml-[6px]">
                  <a
                    href={platformConfig?.whitelistedRouters[0].dexUrl}
                    target={"_blank"}
                  >
                    {platformConfig?.whitelistedRouters[0].ammName}
                  </a>
                </p>
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
                  <p className="text-white text-[14px] md:text-[16px] ml-[6px]">
                    <a
                      href={platformConfig?.whitelistedRouters[0].dexUrl}
                      target={"_blank"}
                    >
                      {platformConfig?.whitelistedRouters[0].ammName}
                    </a>
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
