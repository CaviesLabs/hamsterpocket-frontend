import { FC, useState } from "react";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";
import { DropdownSelect } from "@/src/components/select";
import { TAKE_PROFIT_KIND_OPTIONS, TAKE_PROFIT_TYPE } from "@/src/utils";

export const TakeProfitOption: FC = () => {
  const [kindOption, setKindOption] = useState(
    TAKE_PROFIT_KIND_OPTIONS[0].value
  );
  /**
   * @dev Injected context.
   */
  const {
    baseTokenAddress,
    errorMsgs,
    mintOrderSize,
    createdEnable,
    setBatchVolume,
    setErrorMsgs,
  } = useCreatePocketPage();

  return (
    <div className="grid md:grid-cols-5 gap-3">
      <div className="md:col-span-2">
        <p className="text-dark10 text-[14px] regular-text mb-1">Take Profit</p>
        <p className="text-dark50 text-[12px] normal-text">
          Reference for Take Profit
        </p>
        <DropdownSelect
          className="mt-3 !min-w-[250px]"
          handleSelectValue={(val) => setKindOption(val as TAKE_PROFIT_TYPE)}
          options={TAKE_PROFIT_KIND_OPTIONS}
          autoValue={true}
        />
        <CurrencyInput
          placeholder="Input price take profit"
          addressSelected={baseTokenAddress?.[0]?.toBase58().toString()}
          disableDropdown={true}
          rightPrefixLabel={
            kindOption === TAKE_PROFIT_TYPE.ATPRICE
              ? "PRICE"
              : kindOption === TAKE_PROFIT_TYPE.TOTALTRADINGVOLUME
              ? "%"
              : "SOL"
          }
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
