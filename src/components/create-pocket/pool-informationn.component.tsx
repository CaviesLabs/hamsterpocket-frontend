import { FC } from "react";
import { Input } from "@hamsterbox/ui-kit";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { ErrorLabel } from "@/src/components/error-label";

export const PoolInformation: FC = () => {
  /**
   * @dev Injected context.
   */
  const { setPocketName, pocketName, errorMsgs, createdEnable } =
    useCreatePocketPage();

  return (
    <section>
      <p className="mobile:text-[14px] text-[20px] text-dark50 regular-text">
        Pool information
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <div className="mt-[16px]">
        <Input
          containerClassName="app-input w-full mt-1"
          inputClassName="bg-dark100 !text-white !rounded-[16px] w-full"
          placeholder="Enter pocket name"
          value={pocketName}
          onValueChange={(v) => setPocketName(v)}
        />
      </div>
      {errorMsgs?.pocketName && createdEnable && (
        <ErrorLabel message={errorMsgs.pocketName} />
      )}
    </section>
  );
};
