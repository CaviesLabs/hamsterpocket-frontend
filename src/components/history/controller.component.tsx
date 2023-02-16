import { CalendarIcon, SearchIcon } from "@/src/components/icons";
import { Input } from "@hamsterbox/ui-kit";
import { DatePicker } from "antd";
import { DropdownSelect } from "@/src/components/select";
import { useState } from "react";

const types = [
  "All type",
  "Create",
  "Pause",
  "Reactivate",
  "Deposit",
  "Buy",
  "Close",
  "Withdraw",
  "Fail transaction",
];

export default function HistoryController() {
  const [selectedType, setSelectedType] = useState(types[0]);

  return (
    <div className="mt-8 flex justify-between">
      <div className="max-w-[440px]">
        <Input
          containerClassName="app-input w-full"
          inputClassName="bg-dark90 !text-white !rounded-[100px] w-full"
          placeholder="Search by Pocket name/ID"
          icon={<SearchIcon />}
        />
      </div>
      <div className="flex">
        <DatePicker
          format="DD/MM/YYYY"
          size="large"
          className="rounded-full px-[20px] bg-dark90 !h-[48px] placeholder-gray-500 border-none col-span-2"
          placeholder="All time"
          onChange={(v) => {
            console.log("changed", v);
          }}
          suffixIcon={<CalendarIcon />}
          clearIcon={null}
        />
        <DropdownSelect
          options={types}
          handleSelectValue={(v) => setSelectedType(v)}
          value={selectedType}
          className="!rounded-full !h-[48px] ml-6"
        />
      </div>
    </div>
  );
}
