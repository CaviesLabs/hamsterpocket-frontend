import { MainProgressBy, PocketEntity } from "@/src/entities/pocket.entity";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PoolItemEndConditionProps = {
  baseToken: WhitelistEntity;
  targetToken: WhitelistEntity;
  data: PocketEntity;
};

export const ProgressDetailComponent = (props: PoolItemEndConditionProps) => {
  const { data, baseToken, targetToken } = props;
  const { convertDecimalAmount } = useWhiteList();

  const currentReceivedTarget = convertDecimalAmount(
    targetToken?.address,
    data.currentReceivedTargetToken
  ).toFixed(2);

  if (data.mainProgressBy === MainProgressBy.SPENT_BASE_TOKEN) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          Bought:
          <span className="text-green ml-[5px]">
            {convertDecimalAmount(data.baseTokenAddress, data.depositedAmount)}
          </span>
          /
          {convertDecimalAmount(
            data.baseTokenAddress,
            data.stopConditions?.spentBaseTokenReach
          )}{" "}
          {baseToken?.symbol}
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {currentReceivedTarget} {targetToken?.symbol}
        </p>
      </>
    );
  } else if (data.mainProgressBy === MainProgressBy.TARGET_TOKEN) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          Bought:
          <span className="text-green ml-[5px]">{currentReceivedTarget}</span>/
          {convertDecimalAmount(
            targetToken?.address,
            data.stopConditions.receivedTargetTokenReach
          )}{" "}
          {targetToken?.symbol}
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {data.depositedAmount} {baseToken?.symbol}
        </p>
      </>
    );
  } else if (data.mainProgressBy === MainProgressBy.END_TIME) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          {dayjs(data.startTime).fromNow()}
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {currentReceivedTarget} {targetToken?.symbol} (
          {data.currentBaseToken} {baseToken?.symbol})
        </p>
      </>
    );
  } else if (data.mainProgressBy === MainProgressBy.BATCH_AMOUNT) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          <span className="text-green ml-[5px]">{data.currentBatchAmount}</span>
          /{data?.stopConditions?.batchAmountReach} BATCH
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {currentReceivedTarget} {targetToken?.symbol} (
          {data?.currentBaseToken} {baseToken?.symbol})
        </p>
      </>
    );
  }
  return null;
};
