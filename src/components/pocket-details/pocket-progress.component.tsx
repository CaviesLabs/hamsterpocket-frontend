import { FC, useMemo } from "react";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export const PocketProgress: FC<{ pocket: PocketEntity }> = (props) => {
  const pocket = props.pocket;

  const { whiteLists, findEntityByAddress, convertDecimalAmount } =
    useWhiteList();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [pocket]
  );

  /** @dev Get target token info. */
  const targetToken = useMemo(
    () =>
      whiteLists[pocket?.targetTokenAddress] ||
      findEntityByAddress(pocket?.targetTokenAddress),
    [pocket]
  );

  console.log(pocket);
  console.log(
    convertDecimalAmount(
      targetToken?.address,
      pocket?.currentReceivedTargetToken
    ),
    convertDecimalAmount(baseToken?.address, pocket?.currentSpentBaseToken)
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
  }, [pocket, baseToken, targetToken]);

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
          <p className="text-white normal-text">
            {convertDecimalAmount(
              baseToken?.address,
              pocket?.remainingBaseTokenBalance
            )?.toFixed(3)}{" "}
            {baseToken?.symbol}
          </p>
          <p className="text-white normal-text mt-[10px]">
            {convertDecimalAmount(
              targetToken?.address,
              pocket?.currentReceivedTargetToken
            )?.toFixed(3)}{" "}
            {targetToken?.symbol}
          </p>
        </div>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Average price</p>
        <p className="text-white normal-text float-right">
          {convertDecimalAmount(baseToken?.address, pocket?.batchVolume)}{" "}
          {baseToken?.symbol} = {averagePrice?.toFixed(3)} {targetToken?.symbol}
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">APL (ROI)</p>
        <p
          className={`${
            (pocket?.realizedROIValue || 0) < 0
              ? "text-red300"
              : "text-green300"
          } normal-text float-right`}
        >
          {pocket?.realizedROIValue?.toFixed(3) || 0} {baseToken?.symbol} (
          {pocket?.currentROI?.toFixed(3) || 0}%)
        </p>
      </div>
    </div>
  );
};
