import { FC, useEffect, useState } from "react";
import { DatePicker } from "antd";
import { CalendarIcon } from "@/src/components/icons";
import { DropdownSelect } from "@/src/components/select";
import { TIME_ARRAYS } from "@/src/utils";
import { DatetimePickerProps } from "./types";
import dayjs, { Dayjs } from "dayjs";

/**
 * @description
 * This component will be wrapped by From.Item,
 * so, it must have value & onChange attribute.
 * the `value` will store the full datetime value
 * the `onChange` will be triggered when value of each component changed
 */
export const DatetimePicker: FC<DatetimePickerProps> = (props) => {
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs("2022-08-08"));

  /**
   * @dev
   * Modify time
   * Split value to get hour & minute for modifying
   * @param {string} timeSelected
   */
  const handleSelectTime = (timeSelected: string) => {
    const [hour, minute] = timeSelected.split(":");
    const newValue = dateTime
      ?.set("hour", parseInt(hour) | 0)
      ?.set("minute", parseInt(minute) | 0);

    setDateTime(newValue);
  };

  /**
   * @dev Modify date value in datetime.
   * @param _date
   */
  const handleSelectDate = (_date: any) => {
    const date = new Date(_date);
    const newValue = dateTime
      ?.set("date", date.getDate())
      ?.set("year", date.getUTCFullYear())
      ?.set("month", date.getMonth());
    setDateTime(newValue);
  };

  useEffect(() => {
    setDateTime(dayjs(Date.now()));
  }, []);

  useEffect(() => {
    props.onChange(dateTime.toDate());
  }, [dateTime]);

  return (
    <div className="grid grid-cols-3">
      <DatePicker
        format="DD/MM/YYYY"
        size="large"
        className="rounded-[16px] px-[50px] bg-dark90 !h-[63px] text-dark10 border-none col-span-2"
        placeholder="dd/mm/yyyy"
        defaultValue={dayjs(Date.now())}
        onChange={(v) => handleSelectDate(v)}
        suffixIcon={<CalendarIcon />}
        clearIcon={null}
        disabledDate={props.disabledDate}
      />
      <div className="ml-[20px] relative col-span-1">
        <DropdownSelect
          options={TIME_ARRAYS}
          value={dateTime.toISOString()}
          handleSelectValue={(value) => handleSelectTime(value)}
          format={() =>
            dateTime
              ? `${dateTime.format("HH")}:${dateTime.format("mm")}`
              : "00:00"
          }
        />
      </div>
    </div>
  );
};
