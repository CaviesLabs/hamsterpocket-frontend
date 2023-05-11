/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input, toast } from "@hamsterbox/ui-kit";
import { SearchIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { useDispatch } from "react-redux";
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
import { useAppWallet } from "@/src/hooks/useAppWallet";

export const ActivePoolGroup: FC = () => {
  /**
   * @dev Router injected.
   */
  const router = useRouter();
  const dispatch = useDispatch();

  const { walletAddress, chain } = useAppWallet();
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
    if (!walletAddress) return;
    dispatch(
      getActivePockets({
        chainId: chain === "SOL" ? "solana" : "mumbai",
        limit: 999,
        ownerAddress: walletAddress,
        search,
        sortBy: sorter[0],
        statuses: isPauseOnly
          ? [PocketStatus.PAUSED]
          : !endedSelect
          ? [PocketStatus.PAUSED, PocketStatus.ACTIVE]
          : [PocketStatus.CLOSED, PocketStatus.ENDED],
      })
    );
  }, [debouncedSearch, isPauseOnly, sorter, endedSelect, walletAddress, chain]);

  /** @dev Handle fetching data */
  const [fetching, setFetching] = useState(false);

  /** @dev The function to handle sync pockets. */
  const handleSync = useCallback(() => {
    console.log(walletAddress);
    if (!walletAddress) return;
    setFetching(true);
    dispatch(
      syncWalletPockets({ walletAddress, evm: chain === "ETH" }, () => {
        setFetching(false);
        handleFetch();
        toast("The latest data is now available", {
          theme: "dark",
        });
      })
    );
  }, [walletAddress, debouncedSearch, isPauseOnly, sorter, chain]);

  useEffect(
    () => handleFetch(),
    [walletAddress, debouncedSearch, isPauseOnly, sorter, endedSelect]
  );

  return (
    <section className="my-pockets-container">
      <section className="pool-group">
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
          {/* <p
            className="text-purple underline md:text-[18px] text-[14px] cursor-pointer regular-text relative"
            onClick={() => router.push("/ended-pockets")}
          >
            View Closed & Ended Pockets
          </p> */}
        </div>
        <div className="float-root md:hidden">
          <div className="grid grid-cols-2 w-full rounded mt-4 normal-text bg-[#121320] py-[8px] px-[10px] text-[14px] rounded-[12px]">
            <span
              onClick={() => setEndedSelect(false)}
              className={classnames(
                "inline-block py-[8px] hover:bg-purple300 cursor-pointer normal-text px-[50px] rounded-[8px] text-dark50 hover:text-white col-span-1 text-center",
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
                "inline-block py-[8px] hover:bg-purple300 cursor-pointer normal-text px-[50px] rounded-[8px] text-dark50 hover:text-white col-span-1 text-center",
                {
                  "bg-purple300 text-white": endedSelect,
                }
              )}
            >
              History
            </span>
          </div>
        </div>
        <div className="flex mt-[32px]">
          <div className="float-left w-[90%] mobile:w-[80%] pr-[10px]">
            <Input
              containerClassName="app-input psi w-full mobile:!h-[40px]"
              inputClassName="bg-dark90 !text-white !rounded-[8px]"
              placeholder="Search by Pocket name, ID, Token"
              icon={<SearchIcon />}
              onValueChange={(v) => setSearch(v)}
            />
          </div>
          <div className="float-left md:w-[10%]">
            <DropdownSelect
              handleSelectValue={(val) => console.log(val)}
              value={"SOL"}
              className="w-full mobile:!h-[40px] px-[5px] md:!h-[48px]"
              options={[
                {
                  value: "SOL",
                  label: "SOL",
                },
              ]}
            />
          </div>
        </div>
        <div className="float-root mobile:hidden">
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
          <p className="text-center text-dark50 normal-text">Pair</p>
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
            <PoolItemRow data={_} key={_.id} handleFetch={handleSync} />
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
