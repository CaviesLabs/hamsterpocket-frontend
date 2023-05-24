import { RangePickerProps } from "antd/es/date-picker";
import { Dayjs } from "dayjs";

export type DatetimePickerProps = {
  value?: Dayjs;
  onChange?: (expiredData: Date) => void;
  disabledDate?: RangePickerProps["disabledDate"];
  backgroundColor?: string;
};
