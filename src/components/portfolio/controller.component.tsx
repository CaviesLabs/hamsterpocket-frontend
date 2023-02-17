import { SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
import { FilterSelect } from "@/src/components/select";
import { useState } from "react";

const options = [
  {
    value: "Newest",
  },
  {
    value: "Highest",
  },
  {
    value: "Lowest",
  },
  {
    value: "Pocket ID ASC",
  },
  {
    value: "Pocket ID DESC",
  },
];

export default function PortfolioController() {
  const [selectedType, setSelectedType] = useState([options[0].value]);

  return (
    <div className="mt-10 flex justify-between">
      <div className="max-w-[440px]">
        <Input
          containerClassName="app-input w-full"
          inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
          placeholder="Search by Token, Address"
          icon={<SearchIcon />}
        />
      </div>
      <div className="flex">
        <FilterSelect
          className="rounded-3xl text-sm w-[185px] h-[44px] px-[80px] md:mt-0 mt-[20px]"
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
