import { FC, useMemo } from "react";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export const PocketBalance: FC = () => {
  /** @dev Handle to get total estimate sol in total pockets. */
  const { totalSOL, totalUSD } = usePocketBalance();
  /** @dev Inject wallet account info. */
  const { chainId, platformConfig } = usePlatformConfig();
  const { whiteLists, analyzeDecimals } = useWhiteList();

  /** @dev Get native token info. */
  const nativeToken = useMemo(() => {
    /**
     * @dev Filter to get native coin.
     */
    const keyFound = Object.keys(whiteLists).find(
      (key) => whiteLists[key]?.isNativeCoin
    );
    return whiteLists?.[keyFound];
  }, [platformConfig, chainId, whiteLists]);

  return (
    <div className="py-3 px-6 bg-purple300 md:w-1/3 rounded-[12px] md:h-[300px] pocket-bg">
      <div className="text-dark10 normal-text mobile:text-[14px]">
        Total Pockets Balance:
      </div>
      <div className="flex mt-4 items-center border-b-[1px] border-dark10 pb-[12px]">
        <div className="p-[5px] rounded-[50%] bg-white md:p-[8px]">
          <img
            src={nativeToken?.image}
            className="w-[42px] h-[42px] mobile:w-[20px] mobile:h-[20px] rounded-[50%] object-scale-down"
          />
        </div>
        <div className="text-white ml-3 text-[32px] mobile:text-[14px]">
          ~ {analyzeDecimals(totalSOL)} {nativeToken?.symbol}
        </div>
      </div>
      <div className="text-dark10 normal-text mobile:text-[14px] mt-[10px] text-[16px]">
        Estimated USD Value
      </div>
      <div className="text-green mt-1 mobile:text-[14px] text-[24px]">
        (~ ${analyzeDecimals(totalUSD)})
      </div>
    </div>
  );
};
