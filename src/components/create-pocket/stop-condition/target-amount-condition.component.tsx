import { FC, useState, useEffect } from "react";
import { DeleteIconCircle, CircleCheckIcon } from "@/src/components/icons";
import { CurrencyInput } from "@/src/components/currency-input";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
// import { motion } from "framer-motion";
import { BN } from "@project-serum/anchor";

export const TargetAmountCondition: FC<{
  displyed: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { targetTokenAddress, handleModifyStopConditions } =
    useCreatePocketPage();

  /**
   * @dev Check whether user want to add this condition into pool.
   */
  const [executed, setExecuted] = useState(false);

  /**
   * @dev Current value.
   */
  const [currentValue, setCurrentValue] = useState(0);

  /**
   * @dev Watch changes in excuted boolean condition.
   */
  useEffect(() => {
    handleModifyStopConditions(
      executed,
      "targetTokenAmountReach",
      new BN(currentValue * Math.pow(10, targetTokenAddress[1]))
    );
  }, [executed, currentValue]);

  return (
    <div className="mt-[24px] ">
      {/*  animate={{ x: 0 }} initial={{ x: -100 }} */}
      <p className="text-dark10 text-[14px] normal-text">
        Tokens bought
        <span className="text-red300 relative top-[-2px] right-[-2px]">*</span>
      </p>
      <div className="grid grid-cols-12 gap-3 items-center justify-center mt-[16px] max-w-[600px]">
        <div className="col-span-2">
          <button onClick={props.toggle} className="relative top-[3px]">
            <DeleteIconCircle />
          </button>
        </div>
        <div className="col-span-8">
          <CurrencyInput
            addressSelected={targetTokenAddress[0]?.toBase58().toString()}
            disableDropdown={true}
            onAmountChange={(val) => setCurrentValue(val)}
          />
        </div>
        <div className="col-span-2">
          <button
            onClick={() => setExecuted(!executed)}
            className="relative top-[3px]"
          >
            <CircleCheckIcon
              size="27"
              color={executed ? "#3CBF7C" : "#7886A0"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
