import { FC, useMemo } from "react";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";

export const PocketProgress: FC<{ pocket: PocketEntity }> = (props) => {
  const pocket = props.pocket;

  /** @dev Inject context. */
  const { chainId } = usePlatformConfig();
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

  /** @dev Get target token info. */
  const targetToken = useMemo(
    () =>
      whiteLists[pocket?.targetTokenAddress] ||
      findEntityByAddress(pocket?.targetTokenAddress),
    [pocket, props]
  );

  /**
   * @dev Handle to get average price.
   */
  const averagePrice = useMemo(() => {
    /** @dev Get amount of target token which this pocket bought. */
    const targetTokenBought = convertDecimalAmount(
      targetToken?.address,
      pocket?.currentReceivedTargetToken
    );

    /** @dev Get amount of base toke which this pocket use to pay target tokens. */
    const baseTokenSpent = convertDecimalAmount(
      baseToken?.address,
      pocket?.currentSpentBaseToken
    );

    return targetTokenBought / baseTokenSpent;
  }, [pocket, baseToken, targetToken, props]);

  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Total invested</p>
        <p className="text-white normal-text float-right">
          {convertDecimalAmount(
            baseToken?.address,
            pocket?.currentSpentBaseToken
          )}{" "}
          {baseToken?.symbol}
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Batch bought</p>
        <p className="text-white normal-text float-right">
          {pocket?.currentBatchAmount} BATCHES
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Token hold</p>
        <div className="float-right">
          {/* <p className="text-white normal-text">
            {convertDecimalAmount(
              baseToken?.address,
              pocket?.remainingBaseTokenBalance
            )?.toFixed(3)}{" "}
            {baseToken?.symbol}
          </p> */}
          <p className="text-white normal-text">
            {analyzeDecimals(
              convertDecimalAmount(
                targetToken?.address,
                pocket?.currentReceivedTargetToken
              )
            )}{" "}
            {targetToken?.symbol}
          </p>
        </div>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Average price</p>
        <p className="text-white normal-text float-right">
          {averagePrice ? (
            <>
              1 {baseToken?.symbol} = {analyzeDecimals(averagePrice)}{" "}
              {targetToken?.symbol}
            </>
          ) : (
            "N/A"
          )}
        </p>
      </div>
      {pocket?.status !== PocketStatus.ENDED && chainId !== ChainId.sol ? (
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">APL (ROI)</p>
          <p
            className={`${
              (pocket?.currentROIValue || 0) < 0
                ? "text-red300"
                : "text-green300"
            } normal-text float-right`}
          >
            {analyzeDecimals(pocket?.currentROIValue) || 0} {baseToken?.symbol}{" "}
            ({pocket?.currentROI?.toFixed(2) || 0}%)
          </p>
        </div>
      ) : null}
    </div>
  );
};
