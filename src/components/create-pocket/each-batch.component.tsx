import { FC } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const BatchOption: FC = () => {
  /**
   * @dev Injected context.
   */
  const {
    baseTokenAddress,
    errorMsgs,
    createdEnable,
    mintOrderSize,
    setBatchVolume,
    setErrorMsgs,
  } = useCreatePocketPage();

  return (
    <div>
      <div>
        <p className="text-dark50 text-[20px] mobile:text-[14px] regular-text mb-1">
          Amount each batch
          <span className="text-red300 relative top-[-2px] right-[-2px]">
            *
          </span>
        </p>
        <CurrencyInput
          placeholder="Enter amount"
          addressSelected={baseTokenAddress?.[0]?.toBase58().toString()}
          disableDropdown={true}
          onAmountChange={(val) => {
            setErrorMsgs({
              ...errorMsgs,
              batchVolume:
                val < mintOrderSize &&
                `Batch volume must be greater than Mint Order Size (${mintOrderSize}) `,
            });
            // setErrorMsgs({
            //   ...errorMsgs,
            //   batchVolume: val < 0.05 && "Minimum deposit must be 0.05 SOL",
            // });
            setBatchVolume(val);
          }}
        />
        {errorMsgs?.batchVolume && createdEnable && (
          <ErrorLabel message={errorMsgs.batchVolume} />
        )}
      </div>
    </div>
  );
};
