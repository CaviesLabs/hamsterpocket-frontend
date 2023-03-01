import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@hamsterbox/ui-kit";
import { FilterSelect } from "@/src/components/select";
import { SearchIcon, CircleCheckIcon } from "@/src/components/icons";
import useDebounce from "@/src/hooks/useDebounce";
import { useDispatch } from "react-redux";
import { useConnectedWallet } from "@saberhq/use-solana";
import { getActivePockets } from "@/src/redux/actions/pocket/pocket.action";
import { PocketStatus } from "@/src/entities/pocket.entity";
import classnames from "classnames";

export const ActivePoolGroup: FC = () => {
  /**
   * @dev Router injected.
   */
  const router = useRouter();
  const dispatch = useDispatch();

  const wallet = useConnectedWallet()?.publicKey.toString();
  const [search, setSearch] = useState("");
  const [isPauseOnly, setIsPauseOnly] = useState(false);
  const [isDepositNeeded, setIsDepositNeeded] = useState(false);
  const [sorter, setSorter] = useState([sortOptions[0].value]);

  const debouncedSearch: string = useDebounce<string>(search, 500);

  useEffect(() => {
    if (!wallet) return;
    dispatch(
      getActivePockets({
        ownerAddress: wallet,
        search,
        sortBy: sorter[0],
        statuses: isPauseOnly
          ? [PocketStatus.PAUSED]
          : [PocketStatus.PAUSED, PocketStatus.ACTIVE, PocketStatus.CREATED],
      })
    );
  }, [wallet, debouncedSearch, isPauseOnly, sorter]);

  return (
    <section className="mt-[60px]">
      <div className="flow-root">
        <p className="md:text-[32px] text-[24px] text-white float-left">
          Active Pools
        </p>
        <p
          className="float-right text-purple underline md:text-[18px] text-[14px] cursor-pointer regular-text relative top-[6px]"
          onClick={() => router.push("/my-pools/closed")}
        >
          View closed & inactive pools
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
          <div className="flex">
            <div
              onClick={() => setIsPauseOnly(!isPauseOnly)}
              className="rounded-[100px] bg-dark90 flex items-center px-[35px] mr-[20px] relative cursor-pointer md:py-0 py-[8px] md:w-auto"
            >
              <CircleCheckIcon
                className="mr-2"
                color={isPauseOnly && "#B998FB"}
              />
              <p
                className={classnames(
                  "text-center text-[14px] normal-text",
                  isPauseOnly ? "text-[#B998FB]" : "text-dark50"
                )}
              >
                Paused only
              </p>
            </div>
            <div
              onClick={() => setIsDepositNeeded(!isDepositNeeded)}
              className="rounded-[100px] bg-dark90 flex items-center px-[35px] mr-[20px] relative cursor-pointer md:py-0 py-[8px] md:w-auto"
            >
              <CircleCheckIcon
                className="mr-2"
                color={isDepositNeeded && "#B998FB"}
              />
              <p
                className={classnames(
                  "text-center text-[14px] normal-text",
                  isDepositNeeded ? "text-[#B998FB]" : "text-dark50"
                )}
              >
                Need deposit for next buying
              </p>
            </div>
          </div>
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
