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
        ownerAddress: wallet,
        sortBy: selectedType,
        search,
      })
    );
  }, [wallet, debouncedSearch, selectedType]);

  return (
    <div className="mt-10 flex justify-between">
      <div className="max-w-[440px]">
        <Input
          containerClassName="app-input w-full"
          inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
          placeholder="Search by Token, Address"
          icon={<SearchIcon />}
          onValueChange={(v) => setSearch(v)}
        />
      </div>
      <div className="flex">
        <FilterSelect
          className="rounded-3xl text-sm w-[185px] h-[44px] px-8 md:mt-0 mt-[20px]"
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
