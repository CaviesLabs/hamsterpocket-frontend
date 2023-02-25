import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const BatchOption: FC = () => {
  /**
   * @dev Injected context.
   */
  const { targetTokenAddress, setBatchVolume } = useCreatePocketPage();

  return (
    <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
      <div className="md:col-span-2">
        <p className="text-dark10 text-[14px] normal-text">
          Amount each batch
          <span className="text-red300 relative top-[-2px] right-[-2px]">
            *
          </span>
        </p>
        <CurrencyInput
          addressSelected={targetTokenAddress[0]?.toBase58().toString()}
          disableDropdown={true}
          onAmountChange={(val) => setBatchVolume(val)}
        />
      </div>
    </div>
  );
};
