import { FC, useMemo } from "react";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

export const PocketTpSlSumary: FC = () => {
  /** @dev Inject needed modules to get token account. */
  const { whiteLists, findEntityByAddress, analyzeDecimals } = useWhiteList();

  /**
   * @dev Injected context.
   */
  const { takeProfitAmount, stopLossAmount, baseTokenAddress } =
    useCreatePocketPage();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[baseTokenAddress[0]?.toBase58()?.toString()] ||
      findEntityByAddress(baseTokenAddress[0]?.toBase58()?.toString()),
    [baseTokenAddress]
  );

  return (
    <div>
      <p className="mt-[20px] md:mt-[48px] text-[14px] md:text-[20px] text-dark50 regular-text">
        TP/SL
      </p>
      <div className="bg-dark100 rounded-[12px] p-[16px] mt-[12px]">
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">Take profit</p>
          <p className="text-white normal-text float-right">
            {takeProfitAmount ? (
              <>
                at price {analyzeDecimals(takeProfitAmount)} {baseToken?.symbol}
              </>
            ) : (
              "N/A"
            )}
          </p>
        </div>
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">Stop loss</p>
          <p className="text-white normal-text float-right">
            {stopLossAmount ? (
              <>
                at price {analyzeDecimals(stopLossAmount)} {baseToken?.symbol}
              </>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
