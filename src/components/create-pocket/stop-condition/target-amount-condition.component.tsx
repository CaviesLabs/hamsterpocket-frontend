import { FC, useState, useEffect } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { TooltipPrimaryComponent } from "./tooltip-primary.component";
import { BN } from "@project-serum/anchor";

export const TargetAmountCondition: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { targetTokenAddress, handleModifyStopConditions, stopConditions } =
    useCreatePocketPage();

  /**
   * @dev Check whether user want to add this condition into pool.
   */
  const [primary, setPrimary] = useState(false);

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState(0);

  /**
   * @dev Watch changes in excuted boolean condition.
   */
  useEffect(() => {
    handleModifyStopConditions(
      "quoteTokenAmountReach",
      new BN(currentValue * Math.pow(10, targetTokenAddress[1])),
      primary
    );
  }, [primary, currentValue]);

  /** @dev Default first is primary */
  useEffect(() => {
    if (stopConditions.length <= 0) {
      setPrimary(true);
    }
  }, [stopConditions]);

  return (
    <div className="mt-[24px] ">
      {/*  animate={{ x: 0 }} initial={{ x: -100 }} */}
      <p className="text-dark10 text-[14px] normal-text">
        Tokens bought
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <div className="grid grid-cols-12 gap-3 items-center justify-center mt-[16px] max-w-[600px]">
        <div className="col-span-2">
          <button
            onClick={() => {
              handleModifyStopConditions("baseTokenAmountReach", "delete");
              props.toggle();
            }}
            className="relative top-[3px]"
          >
            <DeleteIconCircle />
          </button>
        </div>
        <div className="col-span-8">
          <CurrencyInput
            addressSelected={targetTokenAddress[0]?.toBase58().toString()}
            disableDropdown={true}
            onAmountChange={(val) => setCurrentValue(val)}
          />
        </div>
        <div className="col-span-2">
          <TooltipPrimaryComponent>
            <button
              onClick={() => setPrimary(!primary)}
              className="relative top-[3px]"
              disabled={
                !primary &&
                stopConditions.filter(
                  (item: any) => item?.[Object.keys(item)?.[0] as any].primary
                ).length > 0
              }
            >
              <CircleCheckIcon
                size="27"
                color={primary ? "#3CBF7C" : "#7886A0"}
              />
            </button>
          </TooltipPrimaryComponent>
        </div>
      </div>
    </div>
  );
};
