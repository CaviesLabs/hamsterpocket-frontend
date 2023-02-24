import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { TwoWayArrowIcon } from "@/src/components/icons";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { PublicKey } from "@solana/web3.js";

export const DCAPPair: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    baseTokenAddress,
    targetTokenAddress,
    setBaseTokenAddress,
    setTargetTokenAddress,
  } = useCreatePocketPage();

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text">DCA ppair</p>
      <div className="mt-[16px]">
        <p className="text-dark20 text-[14px] normal-text italic">
          Enter the pair on Raydium
        </p>
        <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] normal-text">
              From
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              placeholder="Enter SOL amount"
              addressSelected={baseTokenAddress?.toBase58()?.toString()}
              onAddressSelect={(address) =>
                setBaseTokenAddress(new PublicKey(address))
              }
            />
          </div>
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="rounded-[50%] p-[20px] bg-dark90">
              <TwoWayArrowIcon />
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-dark10 text-[14px] normal-text">
              To
              <span className="text-red300 relative top-[-2px] right-[-2px]">
                *
              </span>
            </p>
            <CurrencyInput
              placeholder="Select token"
              currencyBadgeOnly={true}
              addressSelected={targetTokenAddress?.toBase58()?.toString()}
              onAddressSelect={(address) =>
                setTargetTokenAddress(new PublicKey(address))
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};
