import { FC, useMemo } from "react";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export const PocketTpSl: FC<{ pocket: PocketEntity }> = (props) => {
  const pocket = props.pocket;

  /** @dev Inject needed modules to get token account. */
  const {
    whiteLists,
    findEntityByAddress,
    convertDecimalAmount,
    analyzeDecimals,
  } = useWhiteList();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [pocket, props]
  );

  return (
    <div>
      <p className="text-dark45 text-[20px]">TP/SL</p>
      <div className="bg-dark100 rounded-[12px] p-[16px] mt-[12px]">
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">Take profit</p>
          <p className="text-white normal-text float-right">
            {pocket?.takeProfitCondition?.value ? (
              <>
                at price{" "}
                {analyzeDecimals(
                  convertDecimalAmount(
                    baseToken?.address,
                    pocket?.takeProfitCondition?.value
                  )
                )}{" "}
                {baseToken?.symbol}
              </>
            ) : (
              "N/A"
            )}
          </p>
        </div>
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">Stop loss</p>
          <p className="text-white normal-text float-right">
            {pocket?.stopLossCondition?.value ? (
              <>
                at price{" "}
                {analyzeDecimals(
                  convertDecimalAmount(
                    baseToken?.address,
                    pocket?.stopLossCondition?.value
                  )
                )}{" "}
                {baseToken?.symbol}
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
