import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { TooltipPrimaryComponent } from "./tooltip-primary.component";
import { BN } from "@project-serum/anchor";

export const BatchAmountCondition: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { handleModifyStopConditions, stopConditions } = useCreatePocketPage();

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState(0);

  /** @dev Get current condition */
  const curCondition = useMemo(() => {
    return stopConditions.find((item) => item.batchAmountReach !== undefined)
      ?.batchAmountReach;
  }, [stopConditions]);
  const primary = useMemo(
    () => (curCondition?.primary == undefined ? false : curCondition?.primary),
    [curCondition]
  );
  const handleChange = useCallback(
    (isPrimary: boolean) => {
      handleModifyStopConditions(
        "batchAmountReach",
        new BN(currentValue),
        isPrimary
      );
    },
    [currentValue]
  );

  /**
   * @dev Watch changes in excuted boolean condition.
   */
  useEffect(() => {
    handleChange(primary);
  }, [currentValue]);

  return (
    <div className="mt-[24px]">
      <p className="text-dark10 text-[14px] normal-text">
        Batches bought (including skipped batches)
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <div className="grid grid-cols-12 gap-2 items-center justify-center mt-[16px] max-w-[600px]">
        <div className="col-span-2">
          <button
            onClick={() => {
              handleModifyStopConditions("endTimeReach", "delete");
              props.toggle();
            }}
            className="relative top-[3px]"
          >
            <DeleteIconCircle className="mobile:hidden" />
            <DeleteIconCircle className="md:hidden" size="34" />
          </button>
        </div>
        <div className="col-span-8">
          <CurrencyInput
            addressSelected={"BATCH"}
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
    </div>
    // {/* </AnimatePresence> */}
  );
};
