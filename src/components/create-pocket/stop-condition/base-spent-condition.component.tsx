import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BN } from "@project-serum/anchor";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { TooltipPrimaryComponent } from "./tooltip-primary.component";

export const BaseAmountSpendCondition: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  const { whiteLists } = useWhiteList();

  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, handleModifyStopConditions, stopConditions } =
    useCreatePocketPage();

  /**
   * @dev Check whether user want to add this condition into pool.
   */
  // const [primary, setPrimary] = useState(false);

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState(0);

  /** @dev Get current condition */
  const curCondition = useMemo(() => {
    return stopConditions.find(
      (item) => item.spentBaseTokenAmountReach !== undefined
    )?.spentBaseTokenAmountReach;
  }, [stopConditions]);
  const primary = useMemo(
    () => (curCondition?.primary == undefined ? false : curCondition?.primary),
    [curCondition]
  );
  const handleChange = useCallback(
    (isPrimary: boolean) => {
      handleModifyStopConditions(
        "spentBaseTokenAmountReach",
        new BN(currentValue * Math.pow(10, baseTokenAddress[1])),
        isPrimary
      );
    },
    [currentValue]
  );

  /**
   * @dev Watch changes in excuted boolean condition.
   */
  useEffect(() => handleChange(primary), [currentValue]);

  return (
    <div className="mt-[24px] ">
      {/*  animate={{ x: 0 }} initial={{ x: -100 }} */}
      <p className="text-dark10 text-[14px] normal-text">
        {whiteLists[baseTokenAddress[0].toBase58().toString()]?.symbol} spent
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
            addressSelected={baseTokenAddress[0]?.toBase58().toString()}
            disableDropdown={true}
            onAmountChange={(val) => setCurrentValue(val)}
          />
        </div>
        <div className="col-span-2">
          <TooltipPrimaryComponent>
            <button
              onClick={() => handleChange(!primary)}
              className="relative top-[3px]"
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
