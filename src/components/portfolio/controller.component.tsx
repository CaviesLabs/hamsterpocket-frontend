import { SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
import { FilterSelect } from "@/src/components/select";
import { useEffect, useState } from "react";
import { useConnectedWallet } from "@saberhq/use-solana";
import { getPortfolios } from "@/src/redux/actions/portfolio/portfolio.action";
import { useDispatch } from "react-redux";
import useDebounce from "@/src/hooks/useDebounce";

const options = [
  {
    label: "Highest value",
    value: "VALUE_DESC",
  },
  {
    label: "Lowest value",
    value: "VALUE_ASC",
  },
];

export default function PortfolioController() {
  const dispatch = useDispatch();
  const wallet = useConnectedWallet()?.publicKey.toString();
  const [selectedType, setSelectedType] = useState([options[0].value]);

  const [search, setSearch] = useState("");
  const debouncedSearch: string = useDebounce<string>(search, 500);

  useEffect(() => {
    if (!wallet) return;
    dispatch(
      getPortfolios({
        limit: 999,
        ownerAddress: wallet,
        sortBy: selectedType,
        search,
      })
    );
  }, [wallet, debouncedSearch, selectedType]);

  return (
    <div className="mt-10 md:flex md:justify-between">
      <div className="max-w-[440px]">
        <Input
          containerClassName="app-input w-full md:w-[450px]"
          inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
          placeholder="Search by Token, Address"
          icon={<SearchIcon />}
          onValueChange={(v) => setSearch(v)}
        />
      </div>
      <div className="flex mobile:flow-root">
        <p className="md:hidden text-white text-[12px] float-left relative top-[8px] ml-[12px]">
          Sort by:
        </p>
        <FilterSelect
          className="rounded-3xl text-sm w-[215px] h-[40px] md:h-[44px] px-[30px] md:mt-0 mobile:float-right"
          placeholder={
            <div className="pl-5 w-full regular-text">Highest value</div>
          }
          values={selectedType}
          options={options}
          onChange={(value) => setSelectedType(value)}
        />
      </div>
    </div>
  );
}
