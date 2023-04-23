import { FC } from "react";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";

export const PocketBalance: FC = () => {
  /** @dev Handle to get total estimate sol in total pockets. */
  const { totalSOL, totalUSD } = usePocketBalance();

  return (
    <div className="py-3 px-6 bg-purple300 md:w-1/4 rounded-[12px]">
      <div className="text-dark10 normal-text mobile:text-[14px]">
        Total Pockets Balance:
      </div>
      <div className="flex mt-4 items-center border-b-[1px] border-dark10 pb-[12px]">
        <div className="p-[10px] rounded-[50%] bg-white">
          <img
            src="/assets/images/solana-icon.svg"
            className="mobile:w-[20px] mobile:h-[20pxs]"
          />
        </div>
        <div className="text-white ml-3 mobile:text-[14px]">
          ~ {totalSOL.toFixed(2)} SOL
        </div>
      </div>
      <div className="text-dark10 italic normal-text mobile:text-[14px] mt-[10px] text-right">
        Today's PNL
      </div>
      <div className="text-green mt-1 italic regular-text mobile:text-[14px] text-right">
        (~ ${totalUSD.toFixed(2)})
      </div>
    </div>
  );
};
