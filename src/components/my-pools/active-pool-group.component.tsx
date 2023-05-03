/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input, toast } from "@hamsterbox/ui-kit";
import { FilterSelect } from "@/src/components/select";
import { SearchIcon, CircleCheckIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { useConnectedWallet } from "@saberhq/use-solana";
import {
  getActivePockets,
  syncWalletPockets,
} from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import { useSelector } from "react-redux";
import { PoolItemRow } from "@/src/components/my-pools/pool-item/pool-item-row.component";
import { PocketEntity } from "@/src/entities/pocket.entity";
import State from "@/src/redux/entities/state";
import classnames from "classnames";
import { RefreshButton } from "@/src/components/refresh-button";
import { DropdownSelect } from "@/src/components/select";
import { PRICE_CONDITIONS } from "@/src/utils";

export const ActivePoolGroup: FC = () => {
  /**
   * @dev Router injected.
   */
  const router = useRouter();
  const dispatch = useDispatch();

  const wallet = useConnectedWallet()?.publicKey.toString();
  const [search, setSearch] = useState("");
  const [isPauseOnly, setIsPauseOnly] = useState(false);
  const [sorter, setSorter] = useState([sortOptions[0].value]);

  /**
   * @dev The condition to show pockets which already been ended.
   */
  const [endedSelect, setEndedSelect] = useState(false);

  const debouncedSearch: string = useDebounce<string>(search, 500);

  const activePockets = useSelector((state: State) => state.activePockets);

  /** @dev The function to handle request pockets from server. */
  const handleFetch = useCallback(() => {
    if (!wallet) return;
    dispatch(
      getActivePockets({
        limit: 999,
        ownerAddress: wallet,
        search,
        sortBy: sorter[0],
        statuses: isPauseOnly
          ? [PocketStatus.PAUSED]
          : !endedSelect
          ? [PocketStatus.PAUSED, PocketStatus.ACTIVE]
          : [PocketStatus.CLOSED, PocketStatus.ENDED],
      })
    );
  }, [wallet, debouncedSearch, isPauseOnly, sorter, endedSelect]);

  /** @dev Handle fetching data */
  const [fetching, setFetching] = useState(false);

  /** @dev The function to handle sync pockets. */
  const handleSync = useCallback(() => {
    if (!wallet) return;
    setFetching(true);
    dispatch(
      syncWalletPockets({ walletAddress: wallet }, () => {
        setFetching(false);
        handleFetch();
        toast("The latest data is now available", {
          theme: "dark",
        });
      })
    );
  }, [wallet, debouncedSearch, isPauseOnly, sorter]);

  useEffect(
    () => handleFetch(),
    [wallet, debouncedSearch, isPauseOnly, sorter, endedSelect]
  );

  return (
    <section>
      <section>
        <div className="md:flex justify-between items-center">
          <div className="flow-root md:flex items-center">
            <p className="float-left md:text-[32px] text-[20px] text-white">
              My Pockets
            </p>
            <div className="float-right">
              <RefreshButton
                handleClick={() => handleSync()}
                loading={fetching}
              />
            </div>
          </div>
          <p
            className="text-purple underline md:text-[18px] text-[14px] cursor-pointer regular-text relative"
            onClick={() => router.push("/ended-pockets")}
          >
            View Closed & Ended Pockets
          </p>
        </div>
        <div className="flex mt-[32px]">
          <div className="float-left w-[10%]">
            <DropdownSelect
              handleSelectValue={(val) => console.log(val)}
              value={"SOL"}
              className="w-full !h-[47px]"
              options={[
                {
                  value: "SOL",
                  label: "SOL",
                },
              ]}
            />
          </div>
          <div className="float-left w-full pl-[10px]">
            <Input
              containerClassName="app-input w-full"
              inputClassName="bg-dark90 !text-white !rounded-[8px] w-full"
              placeholder="Search by Pocket name, ID, Token"
              icon={<SearchIcon />}
              onValueChange={(v) => setSearch(v)}
            />
          </div>
        </div>
        <div className="float-root">
          <div className="flex flex-col md:flex-row flex-wrap border-solid border-b-[1px] border-[#1F2937] w-full rounded mt-4 normal-text">
            <span
              onClick={() => setEndedSelect(false)}
              className={classnames(
                "inline-block py-[8px] bg-[#121320] hover:bg-purple300 cursor-pointer normal-text px-[50px] rounded-t-[8px] text-dark50 hover:text-white",
                {
                  "bg-purple300 text-white": !endedSelect,
                }
              )}
            >
              Running
            </span>
            <span
              onClick={() => setEndedSelect(true)}
              className={classnames(
                "inline-block py-[8px] bg-[#121320] hover:bg-purple300 cursor-pointer normal-text px-[50px] rounded-t-[8px] text-dark50 hover:text-white",
                {
                  "bg-purple300 text-white": endedSelect,
                }
              )}
            >
              History
            </span>
          </div>
        </div>
      </section>
      <section className="mobile:hidden grid grid-cols-12 mt-[20px]">
        <div className="col-span-3">
          <p className="text-center text-dark50 normal-text">Blockasset</p>
        </div>
        <div className="col-span-2">
          <p className="text-center text-dark50 normal-text">Strategy</p>
        </div>
        <div className="col-span-1">
          <p className="text-center text-dark50 normal-text">Total invested</p>
        </div>
        <div className="col-span-2">
          <p className="text-center text-dark50 normal-text">APL(ROI)</p>
        </div>
        <div className="col-span-2">
          <p className="text-center text-dark50 normal-text">Average price</p>
        </div>
        <div className="col-span-2">
          <p className="text-center text-dark50 normal-text">Next batch time</p>
        </div>
      </section>
      <section className="mt-[10px]">
        {activePockets.length ? (
          activePockets.map((_: PocketEntity) => (
            <PoolItemRow data={_} key={_.id} handleFetch={handleFetch} />
          ))
        ) : (
          <div className="py-[70px]">
            <img
              src="/assets/images/empty-icon.png"
              className="w-[175px] h-[175px] mx-auto"
            />
            <p className="text-[20px] mt-[20px] text-dark50 text-center">
              You have no active pocket
            </p>
          </div>
        )}
      </section>
    </section>
  );
};

const sortOptions = [
  {
    label: "Date Started - Descending",
    value: "DATE_START_DESC",
  },
  {
    label: "Date Created - Descending",
    value: "DATE_CREATED_DESC",
  },
  {
    label: "Progress - Descending",
    value: "PROGRESS_DESC",
  },
  {
    label: "Progress - Ascending",
    value: "PROGRESS_ASC",
  },
];
