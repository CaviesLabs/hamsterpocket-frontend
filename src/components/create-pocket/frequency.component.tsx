import { FC, useCallback } from "react";
import { DropdownSelect } from "@/src/components/select";
import { TIME_CONDITIONS } from "@/src/utils";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { FrequencyConditionType } from "@/src/entities/pocket.entity";

export const FrequencyOption: FC = () => {
  /**
   * @dev Injected context.
   */
  const { frequency, setFrequency } = useCreatePocketPage();

  /**
   * @dev Handle modify frequency.
   */
  const handleModifyFrequency = useCallback(
    (val: string) => {
      switch (val) {
        case FrequencyConditionType.DAILY:
          setFrequency({ days: 1 });
          break;
        case FrequencyConditionType.WEEKLY:
          setFrequency({ weeks: 1 });
          break;
        case FrequencyConditionType.E2W:
          setFrequency({ weeks: 2 });
          break;
        case FrequencyConditionType.MONTHLY:
          setFrequency({ months: 1 });
          break;
        case FrequencyConditionType.E3M:
          setFrequency({ months: 3 });
          break;
        case FrequencyConditionType.E6M:
          setFrequency({ months: 6 });
          break;
        case FrequencyConditionType.YEARLY:
          setFrequency({ years: 1 });
          break;
      }
    },
    [frequency, setFrequency]
  );

  return (
    <div className="mt-[24px] ">
      <p className="text-dark10 text-[14px] normal-text">
        Frequency
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <DropdownSelect
        className="mt-[10px] !min-w-[250px]"
        handleSelectValue={(val) => handleModifyFrequency(val)}
        options={TIME_CONDITIONS}
        autoValue={true}
      />
    </div>
  );
};
