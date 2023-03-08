import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const BatchOption: FC = () => {
  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, setBatchVolume, errorMsgs } = useCreatePocketPage();

  return (
    <div className="grid md:grid-cols-5 gap-3">
      <div className="md:col-span-2">
        <p className="text-dark10 text-[14px] normal-text">
          Amount each batch
          <span className="text-red300 relative top-[-2px] right-[-2px]">
            *
          </span>
        </p>
        <CurrencyInput
          addressSelected={baseTokenAddress?.[0]?.toBase58().toString()}
          disableDropdown={true}
          isPositiveOnly={true}
          onAmountChange={(val) => {
            setBatchVolume(val);
            console.log(val);
          }}
        />
        {errorMsgs?.batchVolume && (
          <ErrorLabel message={errorMsgs.batchVolume} />
        )}
      </div>
    </div>
  );
};
