import { FC, useState, useEffect } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const EndTimeCondition: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { handleModifyStopConditions } = useCreatePocketPage();

  /**
   * @dev Check whether user want to add this condition into pool.
   */
  const [executed, setExecuted] = useState(false);

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState<Date>();

  /**
   * @dev Watch changes in excuted boolean condition.
   */
  useEffect(() => {
    handleModifyStopConditions(executed, "endTime", currentValue);
  }, [executed, currentValue]);

  return (
    <div className="mt-[24px] ">
      <p className="text-dark10 text-[14px] normal-text">
        End time
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <div className="grid grid-cols-12 gap-2 items-center justify-center mt-[16px] max-w-[600px]">
        <div className="col-span-2">
          <button onClick={props.toggle} className="relative top-[3px]">
            <DeleteIconCircle />
          </button>
        </div>
        <div className="col-span-8">
          <DatetimePicker onChange={(v) => setCurrentValue(v)} />
        </div>
        <div className="col-span-2">
          <button
            onClick={() => setExecuted(!executed)}
            className="relative top-[3px]"
          >
            <CircleCheckIcon
              size="27"
              color={executed ? "#3CBF7C" : "#7886A0"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
