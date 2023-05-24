import { SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
import { useEffect, useState } from "react";
import { getPortfolios } from "@/src/redux/actions/portfolio/portfolio.action";
import { useDispatch } from "react-redux";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";
import useDebounce from "@/src/hooks/useDebounce";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";

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
  const [selectedType] = useState([options[0].value]);

  const [search, setSearch] = useState("");
  const { walletAddress } = useAppWallet();
  const { chainId } = usePlatformConfig();
  const debouncedSearch: string = useDebounce<string>(search, 500);

  const portfoliosData = useSelector((state: State) => state.portfolios);

  useEffect(() => {
    if (!walletAddress) return;
    dispatch(
      getPortfolios({
        limit: 999,
        ownerAddress: walletAddress,
        sortBy: selectedType,
        search,
        chainId,
      })
    );
  }, [walletAddress, debouncedSearch, selectedType, chainId]);

  return (
    <div className="mt-10 flow-root md:justify-between">
      <p className="float-left text-white text-[16px] relative top-[5px]">
        Assets ({portfoliosData.length})
      </p>
      <div className="max-w-[440px] float-right">
        <Input
          containerClassName="app-input w-full md:w-[450px]"
          inputClassName="bg-dark100 !text-white !rounded-[100px] w-full"
          placeholder="Search by Token, Address"
          icon={<SearchIcon />}
          onValueChange={(v) => setSearch(v)}
        />
      </div>
    </div>
  );
}
