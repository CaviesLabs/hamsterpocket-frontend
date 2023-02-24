import { FC } from "react";
import { Input } from "@hamsterbox/ui-kit";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const PoolInformation: FC = () => {
  /**
   * @dev Injected context.
   */
  const { setPocketName, pocketName } = useCreatePocketPage();

  return (
    <section>
      <p className="mt-[48px] text-[24px] text-white normal-text">
        Pool information
      </p>
      <div className="mt-[16px]">
        <p className="text-dark10 text-[14px] normal-text">
          Pocket name
          <span className="text-red300 relative top-[-2px] right-[-2px]">
            *
          </span>
        </p>
        <Input
          containerClassName="app-input w-full mt-[10px]"
          inputClassName="bg-dark90 !text-white !rounded-[16px] w-full"
          placeholder="Search by Pool name, ID, Token"
          value={pocketName}
          onValueChange={(v) => setPocketName(v)}
        />
      </div>
    </section>
  );
};
