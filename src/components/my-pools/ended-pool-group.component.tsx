import { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@hamsterbox/ui-kit";
import { DropdownSelect, FilterSelect } from "@/src/components/select";
import { SearchIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { useConnectedWallet } from "@saberhq/use-solana";
import { getClosedPockets } from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { useSelector } from "react-redux";
import { PoolItem } from "@/src/components/my-pools/pool-item";
import { PocketEntity } from "@/src/entities/pocket.entity";
import State from "@/src/redux/entities/state";
import { SyncOutlined } from "@ant-design/icons";

export const EndedPoolGroupComponent: FC = () => {
  /**
   * @dev Router injected.
   */
  const router = useRouter();
  const dispatch = useDispatch();

  const closedPockets = useSelector((state: State) => state.closedPockets);

  const wallet = useConnectedWallet()?.publicKey.toString();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(PocketTypes[2].value);
  const [sorter, setSorter] = useState([sortOptions[0].value]);

  const debouncedSearch: string = useDebounce<string>(search, 500);

  /** @dev Handle fetching data */
  const [fetching, setFetching] = useState(false);

  const handleFetch = useCallback(() => {
    if (!wallet) return;
    setFetching(true);
    dispatch(
      getClosedPockets(
        {
          ownerAddress: wallet,
          search,
          sortBy: sorter[0],
          statuses:
            selectedType === PocketTypes[2].value
              ? [PocketStatus.CLOSED, PocketStatus.ENDED]
              : [selectedType as PocketStatus.ENDED],
        },
        () => setFetching(false)
      )
    );
  }, [wallet, debouncedSearch, selectedType, sorter]);

  useEffect(
    () => handleFetch(),
    [wallet, debouncedSearch, selectedType, sorter]
  );

  return (
    <section className="mt-[60px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="md:text-[32px] text-[24px] text-white float-left">
            Closed & Ended Pockets
          </p>
          <button
            className="relative ml-4 bg-dark90 text-dark40 hover:text-white rounded-full px-4 py-2 flex items-center"
            onClick={handleFetch}
          >
            <SyncOutlined spin={fetching} style={{ fontSize: 18 }} />
            <p className="font-normal ml-4">Refresh</p>
          </button>
        </div>
        <p
          className="text-purple underline md:text-[18px] text-[14px] cursor-pointer regular-text relative"
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
      <section>
        {closedPockets.map((_: PocketEntity) => (
          <PoolItem data={_} key={_.id} handleFetch={() => handleFetch()} />
        ))}
      </section>
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
