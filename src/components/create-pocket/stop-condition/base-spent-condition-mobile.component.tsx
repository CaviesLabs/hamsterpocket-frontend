import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { CircleCheckIcon, UnCollapseArrowIcon } from "@/src/components/icons";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BN } from "@project-serum/anchor";
import { TooltipPrimaryComponent } from "./tooltip-primary.component";
import { Collapse } from "react-collapse";

export const BaseAmountSpendConditionMobile: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { handleModifyStopConditions, stopConditions, baseTokenAddress } =
    useCreatePocketPage();

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState(0);

  /**
   * @dev Collapse condition.
   */
  const [collapsed, setCollapsed] = useState(true);

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
  useEffect(() => {
    if (currentValue && !collapsed && handleChange) {
      handleChange(primary);
    }
  }, [currentValue, collapsed, handleChange]);

  return (
    <div className="mt-[24px]">
      <div className="bg-[#121320] rounded-[16px] py-[16px] px-[16px]">
        <div className="flow-root">
          <div
            className="float-left flex items-center"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <div className="float-left rounded-[50%] bg-dark3">
              <UnCollapseArrowIcon />
            </div>
            <p className="float-left text-[12px] text-white normal-text ml-[12px] relative">
              Add target SOL amount
            </p>
          </div>
          {!curCondition ? (
            <button className="float-right bg-[#7886A033] px-[8px] py-[4px] rounded-[19px] normal-text text-dark50 text-[12px]">
              Clear
            </button>
          ) : (
            <button
              className="float-right bg-[#F4494933] px-[8px] py-[4px] rounded-[19px] normal-text text-red200 text-[12px]"
              onClick={() => {
                props.toggle();
                setCurrentValue(0);
                setCollapsed(true);
              }}
            >
              Clear
            </button>
          )}
        </div>
        <Collapse isOpened={!collapsed}>
          <div className="grid grid-cols-12 gap-2 items-center justify-center mt-[16px] max-w-[600px]">
            <div className="col-span-10">
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
                    className="mobile:hidden"
                  />
                  <CircleCheckIcon
                    size="24"
                    color={primary ? "#3CBF7C" : "#7886A0"}
                    className="md:hidden"
                  />
                </button>
              </TooltipPrimaryComponent>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
    // {/* </AnimatePresence> */}
  );
};