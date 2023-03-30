import { CalendarIcon, SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
import { DatePicker } from "antd";
import { DropdownSelect } from "@/src/components/select";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getHistories } from "../../redux/actions/history/history.action";
import useDebounce from "../../hooks/useDebounce";
import { useConnectedWallet } from "@saberhq/use-solana";
import { PoolType } from "@/src/entities/history.entity";
import classnames from "classnames";
import styles from "./styles.module.scss";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const types = [
  { label: "All type", value: "ALL" },
  { label: "Create", value: PoolType.CREATE },
  { label: "Pause", value: PoolType.PAUSE },
  { label: "Resume", value: PoolType.CONTINUE },
  { label: "Deposit", value: PoolType.DEPOSIT },
  { label: "Swap", value: PoolType.SWAPPED },
  { label: "Close", value: PoolType.CLOSE },
  { label: "Withdraw", value: PoolType.WITHDRAW },
];
const PickerFormat = "DD/MM/YYYY";

export default function HistoryController() {
  const dispatch = useDispatch();
  /**
   * @desc Wallet injected
   */
  const wallet = useConnectedWallet()?.publicKey.toString();

  const [selectedType, setSelectedType] = useState<string>(types[0].value);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState([]);
  const debouncedSearch: string = useDebounce<string>(search, 500);

  useEffect(() => {
    if (!wallet) return;
    const [start, end] = date;
    dispatch(
      getHistories({
        limit: 999,
        ownerAddress: wallet,
        search,
        statuses: selectedType === types[0].value ? undefined : [selectedType],
        timeFrom: start
          ? dayjs(start, PickerFormat).startOf("days").toISOString()
          : undefined,
        timeTo: end
          ? dayjs(end, PickerFormat).endOf("days").toISOString()
          : undefined,
      })
    );
  }, [wallet, debouncedSearch, selectedType, date]);

  return (
    <div className="mt-8 md:flex md:justify-between">
      <div className="w-full md:max-w-[440px]">
        <Input
          containerClassName="app-input"
          inputClassName="bg-dark90 !text-white !rounded-[100px]"
          placeholder="Search by Pocket name/ID"
          icon={<SearchIcon />}
          onValueChange={(v) => setSearch(v)}
        />
      </div>
      <div className="md:flex mobile:mt-[10px]">
        <RangePicker
          format={PickerFormat}
          size="large"
          className={classnames(
            "rounded-full w-full min-w-[280px] px-[20px] bg-dark90 !h-[48px] mobile:!h-[40px] placeholder-gray-500 border-none !mt-0",
            styles.customDatePicker
          )}
          placeholder={["From", "To"]}
          onChange={(_, dateString) => setDate(dateString)}
          suffixIcon={<CalendarIcon />}
          clearIcon={null}
        />
        <DropdownSelect
          options={types}
          handleSelectValue={(v) => setSelectedType(v)}
          value={selectedType}
          className="!rounded-full !h-[48px] mobile:!h-[40px] md:ml-6 mobile:mt-[16px]"
        />
      </div>
    </div>
  );
}
