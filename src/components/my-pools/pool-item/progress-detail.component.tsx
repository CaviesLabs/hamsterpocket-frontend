import { MainProgressBy, PocketEntity } from "@/src/entities/pocket.entity";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
// import { DateTime } from "luxon";

type PoolItemEndConditionProps = {
  targetToken: WhitelistEntity;
  data: PocketEntity;
};

export const ProgressDetailComponent = (props: PoolItemEndConditionProps) => {
  const { data, targetToken } = props;
  if (data.mainProgressBy === MainProgressBy.BASE_TOKEN) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          Bought:
          <span className="text-green ml-[5px]">{data.depositedAmount}</span>/
          {data.stopConditions[0]?.baseTokenAmountReach} SOL
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {data.currentTargetToken} {targetToken?.symbol}
        </p>
      </>
    );
  } else if (data.mainProgressBy === MainProgressBy.TARGET_TOKEN) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          Bought:
          <span className="text-green ml-[5px]">{data.currentTargetToken}</span>
          /{data.stopConditions[0]?.targetTokenAmountReach}{" "}
          {targetToken?.symbol}
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {data.depositedAmount} SOL
        </p>
      </>
    );
  } else if (data.mainProgressBy === MainProgressBy.END_TIME) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          {/* {new DateTime(data.startTime).toDuration()} */}
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {data.currentTargetToken} {targetToken?.symbol} (
          {data.currentBaseToken} SOL)
        </p>
      </>
    );
  } else if (data.mainProgressBy === MainProgressBy.BATCH_AMOUNT) {
    return (
      <>
        <p className="text-end text-[14px] text-white regular-text">
          <span className="text-green ml-[5px]">{data.currentBatchAmount}</span>
          /{data.batchVolume} {targetToken.symbol}
        </p>
        <p className="text-end text-[14px] text-white regular-text mt-[6px]">
          ~ {data.currentTargetToken} {targetToken.symbol} (
          {data.currentBaseToken} SOL)
        </p>
      </>
    );
  }
  return null;
};
