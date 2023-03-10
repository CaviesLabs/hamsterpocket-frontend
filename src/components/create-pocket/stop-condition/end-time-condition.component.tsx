import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
// import { motion, AnimatePresence } from "framer-motion";
import { BN } from "@project-serum/anchor";
import { TooltipPrimaryComponent } from "./tooltip-primary.component";

export const EndTimeCondition: FC<{
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
  const [currentValue, setCurrentValue] = useState<Date>(new Date());

  /** @dev Get current condition */
  const curCondition = useMemo(() => {
    return stopConditions.find((item) => item.endTimeReach !== undefined)
      ?.endTimeReach;
  }, [stopConditions]);
  const primary = useMemo(
    () => (curCondition?.primary == undefined ? false : curCondition?.primary),
    [curCondition]
  );
  const handleChange = useCallback(
    (isPrimary: boolean) => {
      handleModifyStopConditions(
        "endTimeReach",
        new BN(parseInt((currentValue.getTime() / 1000).toString()).toString()),
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
    // <AnimatePresence>
    <div
      // animate={{ x: 0 }}
      // initial={{ x: -100 }}
      // exit={{ x: -100 }}
      className="mt-[24px] "
    >
      <p className="text-dark10 text-[14px] normal-text">
        End time
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
            <DeleteIconCircle />
          </button>
        </div>
        <div className="col-span-8">
          <DatetimePicker onChange={(v) => setCurrentValue(v)} />
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
    // {/* </AnimatePresence> */}
  );
};
