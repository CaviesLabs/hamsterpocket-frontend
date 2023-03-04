import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@hamsterbox/ui-kit";
import { DropdownSelect, FilterSelect } from "@/src/components/select";
import { SearchIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { useConnectedWallet } from "@saberhq/use-solana";
import { getClosedPockets } from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";

export const EndedPoolGroupComponent: FC = () => {
  /**
   * @dev Router injected.
   */
  const router = useRouter();
  const dispatch = useDispatch();

  const wallet = useConnectedWallet()?.publicKey.toString();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(PocketTypes[2].value);
  const [sorter, setSorter] = useState([sortOptions[0].value]);

  const debouncedSearch: string = useDebounce<string>(search, 500);

  useEffect(() => {
    if (!wallet) return;
    dispatch(
      getClosedPockets({
        ownerAddress: wallet,
        search,
        sortBy: sorter[0],
        statuses:
          selectedType === PocketTypes[2].value
            ? [PocketStatus.CLOSED, PocketStatus.ENDED]
            : [selectedType as PocketStatus.ENDED],
      })
    );
  }, [wallet, debouncedSearch, selectedType, sorter]);

  return (
    <section className="mt-[60px]">
      <div className="flow-root">
        <p className="md:text-[32px] text-[24px] text-white float-left">
          Closed & Ended Pockets
        </p>
        <p
          className="float-right text-purple underline md:text-[18px] text-[14px] cursor-pointer regular-text relative top-[6px]"
          onClick={() => router.push("/my-pockets")}
        >
          View Active Pockets
        </p>
      </div>
      <div className="flow-root mt-[32px]">
        <div className="md:float-left md:w-[442px] w-full">
          <Input
            containerClassName="app-input w-full"
            inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
            placeholder="Search by Pool name, ID, Token"
            icon={<SearchIcon />}
            onValueChange={(v) => setSearch(v)}
          />
        </div>
        <div className="md:float-right md:flex md:mt-0 mt-[20px]">
          <DropdownSelect
            options={PocketTypes}
            handleSelectValue={(v) => setSelectedType(v)}
            value={selectedType}
            className="!rounded-full !h-[48px] mr-4 max-w-[230px]"
          />
          <FilterSelect
            className="text-center rounded-3xl text-sm h-[50px] !px-12 md:mt-0 mt-[20px]"
            values={sorter}
            options={sortOptions}
            onChange={(value) => setSorter(value)}
          />
        </div>
      </div>
    </section>
  );
};

const PocketTypes = [
  {
    value: PocketStatus.CLOSED,
    label: "Closed",
  },
  {
    value: PocketStatus.ENDED,
    label: "Ended",
  },
  {
    value: "ALL",
    label: "Closed & Ended",
  },
];

const sortOptions = [
  {
    label: "Latest Closed Time",
    value: "DATE_START_DESC",
  },
  {
    label: "Earliest Created Time",
    value: "DATE_CREATED_DESC",
  },
];
