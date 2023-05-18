import { SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
// import { DropdownSelect } from "@/src/components/select";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PoolType } from "@/src/entities/history.entity";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { getHistories } from "@/src/redux/actions/history/history.action";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import useDebounce from "@/src/hooks/useDebounce";
import dayjs from "dayjs";

const types = [
  { label: "All type", value: "ALL" },
  { label: "Create", value: PoolType.CREATED },
  { label: "Pause", value: PoolType.PAUSED },
  { label: "Resume", value: PoolType.CONTINUE },
  { label: "Deposit", value: PoolType.DEPOSITED },
  { label: "Swap", value: PoolType.SWAPPED },
  { label: "Close", value: PoolType.CLOSED },
  { label: "Withdraw", value: PoolType.WITHDRAWN },
];
const PickerFormat = "DD/MM/YYYY";

export default function HistoryController() {
  const dispatch = useDispatch();
  /**
   * @desc Wallet injected
   */
  const { walletAddress } = useAppWallet();
  const { chainId } = usePlatformConfig();

  const [selectedType] = useState<string>(types[0].value);
  const [search, setSearch] = useState("");
  const [date] = useState([]);
  const debouncedSearch: string = useDebounce<string>(search, 500);

  useEffect(() => {
    if (!walletAddress) return;
    const [start, end] = date;
    dispatch(
      getHistories({
        limit: 999,
        ownerAddress: walletAddress,
        chainId: chainId,
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
  }, [debouncedSearch, selectedType, date, walletAddress, chainId]);

  return (
    <div className="mt-8 md:justify-between">
      <div className="flex mt-[32px]">
        <div className="float-left w-[100%] mobile:w-[100%] pr-[10px] ml-[10px]">
          <Input
            containerClassName="app-input psi w-full mobile:!h-[40px]"
            inputClassName="!bg-dark100 !text-white !rounded-[8px]"
            placeholder="Search by Pocket name/ID"
            icon={<SearchIcon />}
            onValueChange={(v) => setSearch(v)}
          />
        </div>
      </div>
    </div>
  );
}
