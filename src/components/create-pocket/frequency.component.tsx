import { FC, useCallback, useState } from "react";
import { TIME_CONDITIONS } from "@/src/utils";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { FrequencyConditionType } from "@/src/entities/pocket.entity";
import { RiQuestionnaireFill } from "react-icons/ri";
import { ToolTip } from "@/src/components/tooltip";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import classNames from "classnames";

export const FrequencyOption: FC = () => {
  /**
   * @dev Injected context.
   */
  const { frequency, setFrequency } = useCreatePocketPage();

  /**
   * @dev Init text value state to adjusting UI.
   */
  const [textValue, setTextValue] = useState(TIME_CONDITIONS[0].value);

  /**
   * @dev Handle modify frequency.
   */
  const handleModifyFrequency = useCallback(
    (val: string) => {
      setTextValue(val);
      switch (val) {
        case FrequencyConditionType.HOURLY:
          setFrequency({ hours: 1 });
          break;
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
    <div>
      <p className="text-dark50 text-[20px] mobile:text-[14px] regular-text flex">
        Frequency
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
        <ToolTip message="1 week = 7 days 1 month = 30 days 1 year = 365 days">
          <RiQuestionnaireFill />
        </ToolTip>
      </p>
      <LayoutWrapper
        layout={
          <div className="flex items-center flex-wrap">
            {TIME_CONDITIONS.map((item, index) => (
              <p
                key={`mobile-option-frequency-${index}`}
                onClick={() => handleModifyFrequency(item.value)}
                className={classNames(
                  "px-[16px] py-[6px] rounded-[30px] text-dark50 bg-dark3 mr-[16px] mt-[16px] normal-text text-[14px] cursor-pointer",
                  {
                    "!bg-purple300 !text-white": textValue === item.value,
                  }
                )}
              >
                {item.label}
              </p>
            ))}
          </div>
        }
      />
    </div>
  );
};
