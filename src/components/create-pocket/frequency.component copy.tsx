import { FC } from "react";
import { DropdownSelect } from "@/src/components/select";
import { TIME_CONDITIONS } from "@/src/utils";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const FrequencyOption: FC = () => {
  /**
   * @dev Injected context.
   */
  const {} = useCreatePocketPage();

  return (
    <div className="mt-[24px] ">
      <p className="text-dark10 text-[14px] normal-text">
        Frequency
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <DropdownSelect
        className="mt-[10px] !min-w-[250px]"
        handleSelectValue={(val) => console.log(val)}
        value={"Daily"}
        options={TIME_CONDITIONS}
      />
    </div>
  );
};
