import { SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
import { DropdownSelect } from "@/src/components/select";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getHistories } from "../../redux/actions/history/history.action";
import useDebounce from "../../hooks/useDebounce";
import { PoolType } from "@/src/entities/history.entity";
import { useAppWallet } from "@/src/hooks/useAppWallet";
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
  const { walletAddress, chain } = useAppWallet();

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
        chainId:
          chain === "SOL"
            ? "solana"
            : process.env.EVM_CHAIN_ID === "matic"
            ? "mumbai"
            : "bsc_mainnet",
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
  }, [debouncedSearch, selectedType, date, walletAddress]);

  return (
    <div className="mt-8 md:justify-between">
      <div className="flex mt-[32px]">
        <div className="float-left md:w-[10%]">
          <DropdownSelect
            handleSelectValue={(val) => console.log(val)}
            className="w-full mobile:!h-[40px] px-[5px] md:!h-[48px]"
            value={
              chain === "SOL"
                ? "SOL"
                : process.env.EVM_CHAIN_ID === "matic"
                ? "MATIC"
                : "BNB"
            }
            options={
              chain === "SOL"
                ? [
                    {
                      value: "SOL",
                      label: "SOL",
                    },
                  ]
                : process.env.EVM_CHAIN_ID === "matic"
                ? [
                    {
                      value: "MATIC",
                      label: "MATIC",
                    },
                  ]
                : [
                    {
                      value: "BNB",
                      label: "BNB",
                    },
                  ]
            }
          />
        </div>
        <div className="float-left w-[90%] mobile:w-[80%] pr-[10px] ml-[10px]">
          <Input
            containerClassName="app-input psi w-full mobile:!h-[40px]"
            inputClassName="!bg-dark90 !text-white !rounded-[8px]"
            placeholder="Search by Pocket name/ID"
            icon={<SearchIcon />}
            onValueChange={(v) => setSearch(v)}
          />
        </div>
      </div>
    </div>
  );
}
