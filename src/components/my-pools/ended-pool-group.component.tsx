import { FC, useCallback, useEffect, useState } from "react";
import { Input, toast } from "@hamsterbox/ui-kit";
import { DropdownSelect, FilterSelect } from "@/src/components/select";
import { SearchIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { useDispatch } from "react-redux";
import {
  getClosedPockets,
  syncWalletPockets,
} from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { RefreshButton } from "@/src/components/refresh-button";
import { useSelector } from "react-redux";
import { PoolItem } from "@/src/components/my-pools/pool-item";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import State from "@/src/redux/entities/state";
import { ChainId } from "@/src/entities/platform-config.entity";

export const EndedPoolGroupComponent: FC = () => {
  const dispatch = useDispatch();

  /** @dev Get fetched closed pools. */
  const closedPockets = useSelector((state: State) => state.closedPockets);

  const { walletAddress } = useAppWallet();
  const { chainId, pushRouterWithChainId } = usePlatformConfig();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(PocketTypes[0].value);
  const [sorter, setSorter] = useState([sortOptions[0].value]);

  const debouncedSearch: string = useDebounce<string>(search, 500);

  /** @dev Handle fetching data */
  const [fetching, setFetching] = useState(false);

  const handleFetch = useCallback(() => {
    if (!walletAddress) return;
    setFetching(true);
    dispatch(
      getClosedPockets(
        {
          limit: 999,
          ownerAddress: walletAddress,
          search,
          sortBy: sorter[0],
          statuses:
            selectedType === PocketTypes[2].value
              ? [PocketStatus.CLOSED, PocketStatus.ENDED]
              : [selectedType as PocketStatus.ENDED],
          chainId: chainId,
        },
        () => setFetching(false)
      )
    );
  }, [walletAddress, debouncedSearch, selectedType, sorter, chainId]);

  /** @dev The function to handle sync pockets. */
  const handleSync = useCallback(() => {
    if (!walletAddress) return;
    setFetching(true);
    dispatch(
      syncWalletPockets(
        {
          walletAddress,
          evm: chainId !== ChainId.sol,
          aptos: chainId.includes("aptos"),
          chainId: chainId,
        },
        () => {
          setFetching(false);
          handleFetch();
          toast("The latest data is now available", {
            theme: "dark",
          });
        }
      )
    );
  }, [walletAddress, debouncedSearch, selectedType, sorter, chainId]);

  useEffect(
    () => handleFetch(),
    [walletAddress, debouncedSearch, selectedType, sorter, chainId]
  );

  return (
    <section>
      <section className="mt-[60px]">
        <div className="md:flex md:justify-between md:items-center">
          <div className="flex items-center">
            <p className="md:text-[32px] text-[20px] text-white float-left">
              Closed & Ended Pockets
            </p>
            <RefreshButton
              handleClick={() => handleSync()}
              loading={fetching}
            />
          </div>
          <p
            className="text-purple underline md:text-[18px] text-[14px] cursor-pointer regular-text relative mobile:mt-[12px]"
            onClick={() => pushRouterWithChainId("/my-pockets")}
          >
            View Active Pockets
          </p>
        </div>
        <div className="flow-root mt-[32px]">
          <div className="md:float-left md:w-[442px] w-full mobile:grid mobile:grid-cols-3 gap-3">
            <Input
              containerClassName="app-input w-full mobile:hidden"
              inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
              placeholder="Search by Pocket name, ID, Token"
              icon={<SearchIcon />}
              onValueChange={(v) => setSearch(v)}
            />
            <div className="mobile:col-span-2 md:hidden">
              <Input
                containerClassName="app-input w-full"
                inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
                placeholder="Search by Pocket name, ID, Token"
                icon={<SearchIcon />}
                onValueChange={(v) => setSearch(v)}
              />
            </div>
            <div className="mobile:col-span-1 md:hidden">
              <FilterSelect
                className="text-center rounded-3xl text-sm h-full !h-[40px]"
                values={sorter}
                options={sortOptions}
                onChange={(value) => setSorter(value)}
                mode="multiple"
                placeholder="Filter"
              />
            </div>
          </div>
          <div className="md:float-right md:flex md:mt-0 mt-[12px] mobile:flow-root">
            <p className="md:hidden text-white text-[12px] float-left relative top-[5px] md:hidden">
              Sort by:
            </p>
            <div className="float-right md:hidden">
              <DropdownSelect
                options={PocketTypes}
                handleSelectValue={(v) => setSelectedType(v)}
                value={selectedType}
                className="!rounded-full !h-[48px] mr-4 max-w-[230px] !w-[210px]"
              />
            </div>
            <DropdownSelect
              options={PocketTypes}
              handleSelectValue={(v) => setSelectedType(v)}
              value={selectedType}
              className="!rounded-full !h-[48px] mr-4 max-w-[230px] !w-[210px] mobile:hidden"
            />
            <FilterSelect
              className="text-center rounded-3xl text-sm h-[50px] md:mt-0 mt-[12px] w-[228px] mobile:hidden"
              values={sorter}
              options={sortOptions}
              onChange={(value) => setSorter(value)}
            />
          </div>
        </div>
      </section>
      <section>
        {closedPockets.length ? (
          closedPockets.map((_: PocketEntity) => (
            <PoolItem data={_} key={_.id} handleFetch={handleFetch} />
          ))
        ) : (
          <div className="py-[70px]">
            <img
              src="/assets/images/empty-icon.png"
              className="w-[175px] h-[175px] mx-auto"
            />
            <p className="text-[20px] mt-[20px] text-dark50 text-center">
              You have no pocket
            </p>
          </div>
        )}
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
