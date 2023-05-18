import { FC } from "react";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";

export const PocketBalance: FC = () => {
  /** @dev Handle to get total estimate sol in total pockets. */
  const { totalSOL, totalUSD } = usePocketBalance();
  /** @dev Inject wallet account info. */
  const { chainId } = usePlatformConfig();

  return (
    <div className="py-3 px-6 bg-purple300 md:w-1/3 rounded-[12px] md:h-[300px] pocket-bg">
      <div className="text-dark10 normal-text mobile:text-[14px]">
        Total Pockets Balance:
      </div>
      <div className="flex mt-4 items-center border-b-[1px] border-dark10 pb-[12px]">
        <div className="p-[5px] rounded-[50%] bg-white md:p-[8px]">
          <img
            src={
              chainId === ChainId.sol
                ? "/assets/images/solana-icon.svg"
                : process.env.EVM_CHAIN_ID === "matic"
                ? "/assets/images/matic.png"
                : "/assets/images/bnb.svg"
            }
            className="w-[42px] h-[42px] mobile:w-[20px] mobile:h-[20px]"
          />
        </div>
        <div className="text-white ml-3 text-[32px] mobile:text-[14px]">
          ~ {totalSOL?.toFixed(5)}{" "}
          {chainId === ChainId.sol
            ? "SOL"
            : process.env.EVM_CHAIN_ID === "matic"
            ? "MATIC"
            : "BNB"}
        </div>
      </div>
      <div className="text-dark10 italic normal-text mobile:text-[14px] mt-[10px]">
        Today's PNL
      </div>
      <div className="text-green mt-1 italic regular-text mobile:text-[14px]">
        (~ ${totalUSD?.toFixed(2)})
      </div>
    </div>
  );
};
