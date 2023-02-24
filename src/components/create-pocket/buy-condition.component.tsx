import { FC, useEffect } from "react";
import { Button, Input } from "@hamsterbox/ui-kit";
import { PlusIcon, DeleteIconCircle } from "@/src/components/icons";
import { CurrencyInput } from "@/src/components/currency-input";
import { WSOL_ADDRESS, PRICE_CONDITIONS } from "@/src/utils";
import { DropdownSelect } from "@/src/components/select";
import { PriceConditionType } from "@/src/entities/pocket.entity";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const BuyCondition: FC<{
  buyConditionDisplayed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { buyCondition, setBuyCondition } = useCreatePocketPage();

  /**
   * @dev Initialize buy condition when click add condition button.
   */
  useEffect(() => {
    if (!props.buyConditionDisplayed) return;
    setBuyCondition({
      tokenAddress: WSOL_ADDRESS,
      type: PriceConditionType.GT,
      value: [0],
    });
  }, [props.buyConditionDisplayed]);

  return (
    <div className="mt-[24px] ">
      <p className="text-dark10 text-[14px] normal-text">
        Buy at market price if
      </p>
      {!props.buyConditionDisplayed ? (
        <Button
          size="small"
          text="Add condition"
          className="!rounded-[100px] after:!rounded-[100px] !px-4 mt-[10px]"
          theme={{
            backgroundColor: "#7A6DFF",
            color: "#FFFFFF",
          }}
          icon={<PlusIcon />}
          onClick={props.toggle}
        />
      ) : (
        <div className="grid grid-cols-8 items-center justify-center mt-[16px] max-w-[600px]">
          <div className="col-span-1">
            <button onClick={props.toggle}>
              <DeleteIconCircle />
            </button>
          </div>
          <div className="col-span-2">
            <CurrencyInput
              currencyBadgeOnly={true}
              addressSelected={buyCondition?.tokenAddress || WSOL_ADDRESS}
              onAddressSelect={(val) =>
                setBuyCondition({ ...buyCondition, tokenAddress: val })
              }
              className="!mt-0"
              dropdownBadgeClassname="!top-[23px]"
            />
          </div>
          <div className="col-span-3 pl-[10px]">
            <DropdownSelect
              handleSelectValue={(val) =>
                setBuyCondition({
                  ...buyCondition,
                  type: val as PriceConditionType,
                })
              }
              value={buyCondition?.type}
              options={PRICE_CONDITIONS}
              className="w-full"
            />
          </div>
          <div className="col-span-2 pl-[10px] h-full">
            <Input
              containerClassName="app-input w-full !h-full"
              inputClassName="bg-dark90 !text-white w-full !h-full"
              value={`$${buyCondition?.value[0]}`}
              onValueChange={(val) => {
                setBuyCondition({
                  ...buyCondition,
                  value: [parseFloat(val.slice(1)) || 0],
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
