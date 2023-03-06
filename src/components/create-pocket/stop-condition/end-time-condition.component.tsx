import { FC, useState, useEffect } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
// import { motion, AnimatePresence } from "framer-motion";
import { BN } from "@project-serum/anchor";

export const EndTimeCondition: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { handleModifyStopConditions, stopConditions } = useCreatePocketPage();

  /**
   * @dev Check whether user want to add this condition into pool.
   */
  const [primary, setPrimary] = useState(false);

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState<Date>(new Date());

  /**
   * @dev Watch changes in excuted boolean condition.
   */
  useEffect(() => {
    handleModifyStopConditions(
      "endTimeReach",
      new BN(currentValue.getTime().toString()),
      primary
    );
  }, [primary, currentValue]);

  /** @dev Default first is primary */
  useEffect(() => {
    if (stopConditions.length <= 1) {
      setPrimary(true);
    }
  }, [stopConditions]);

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
          <button
            onClick={() => setPrimary(!primary)}
            className="relative top-[3px]"
          >
            <CircleCheckIcon
              size="27"
              color={primary ? "#3CBF7C" : "#7886A0"}
            />
          </button>
        </div>
      </div>
    </div>
    // {/* </AnimatePresence> */}
  );
};
