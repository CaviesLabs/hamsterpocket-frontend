import State from "@/src/redux/entities/state";

import { useSelector } from "react-redux";
import { MdOpenInNew } from "react-icons/md";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { utilsProvider, SOL_EXPLORE } from "@/src/utils";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { Avatar } from "antd";

export default function TableComponent() {
  const portfoliosData = useSelector((state: State) => state.portfolios);
  const { chainId, platformConfig } = usePlatformConfig();
  const { analyzeDecimals } = useWhiteList();

  return (
    <div className="mt-11 text-white max-h-[650px] overflow-y-auto">
      <div className="!border-[0px] grid grid-cols-3 gap-3">
        <div className="pb-4 col-span-1">Token</div>
        <div className="pb-4 text-center col-span-1">Address</div>
        <div className="pb-4 text-right col-span-1">Total</div>
      </div>
      <div>
        {portfoliosData.map((h) => {
          return (
            <div
              key={Math.random()}
              className="!border-[0px] bg-[#121320] rounded-[12px] grid grid-cols-3 mobile:grid-cols-5 gap-3 mt-[5px] mobile:mt-[12px] px-[15px] py-[10px]"
            >
              <div className="col-span-1 mobile:col-span-2 flex row items-center">
                <Avatar
                  className={
                    "w-[44px] h-[44px] flex items-center bg-dark70 border-solid border-[3px] border-white text-[8px]"
                  }
                  src={h?.tokenImage}
                >
                  {h?.tokenSymbol}
                </Avatar>
                <div className="ml-4">
                  <div className="truncate mobile:text-[14px]">
                    {h.tokenSymbol}
                  </div>
                  <div className="text-dark40 mobile:text-[14px]">
                    {h.tokenName === "Wrapped SOL" ? "SOL" : h.tokenName}
                  </div>
                </div>
              </div>
              <div className="col-span-1 mobile:col-span-2 mobile:pt-[10px]">
                <div
                  className="flex justify-center items-center"
                  onClick={() =>
                    window.open(
                      chainId === ChainId.sol
                        ? `${SOL_EXPLORE}/account/${h.tokenAddress}`
                        : chainId.includes("aptos")
                        ? `${platformConfig?.explorerUrl}coins/${h.tokenAddress}`
                        : `${platformConfig?.explorerUrl}token/${h.tokenAddress}`
                    )
                  }
                >
                  <div className="border border-gray-700 rounded text-center py-1 w-[160px] mobile:text-[12px] mobile:w-[120px] px-[3px]">
                    {utilsProvider.makeShort(h.tokenAddress)}
                  </div>
                  <div className="ml-2">
                    <MdOpenInNew className="text-gray-500 text-xl" />
                  </div>
                </div>
              </div>
              <div className="text-right col-span-1">
                <div className="mobile:text-[14px]">
                  {analyzeDecimals(h?.decimalValue)}
                </div>
                <div className="text-dark40 mobile:text-[14px]">
                  ~ ${analyzeDecimals(h?.usdValue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
