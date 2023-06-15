import { PocketEntity } from "@/src/entities/pocket.entity";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/src/utils";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";

type PoolItemEndConditionProps = {
  targetToken: WhitelistEntity;
  data: PocketEntity;
};

export const PoolItemEndConditionComponent = (
  props: PoolItemEndConditionProps
) => {
  /** @dev Attract data props. */
  const {
    data: { baseTokenAddress, targetTokenAddress },
  } = props;

  /** @dev Inject whitelist to get info. */
  const { whiteLists, convertDecimalAmount, analyzeDecimals } = useWhiteList();

  const conditions = [];

  const stopConditions = props?.data?.stopConditions;

  if (stopConditions?.endTime) {
    conditions.push(dayjs(stopConditions?.endTime).format(DATE_TIME_FORMAT));
  }
  if (stopConditions?.baseTokenReach) {
    conditions.push(
      <span>
        {analyzeDecimals(
          convertDecimalAmount(baseTokenAddress, stopConditions?.baseTokenReach)
        )}
        `${whiteLists[baseTokenAddress]?.symbol}`
      </span>
    );
  }
  if (stopConditions?.receivedTargetTokenReach) {
    conditions.push(
      <span>
        {analyzeDecimals(
          convertDecimalAmount(
            targetTokenAddress,
            stopConditions?.receivedTargetTokenReach
          )
        )}
        {whiteLists[targetTokenAddress]?.symbol}
      </span>
    );
  }
  if (stopConditions?.spentBaseTokenReach) {
    conditions.push(
      <span>
        {analyzeDecimals(
          convertDecimalAmount(
            baseTokenAddress,
            stopConditions?.spentBaseTokenReach
          )
        )}{" "}
        {whiteLists[baseTokenAddress]?.symbol}
      </span>
    );
  }
  if (stopConditions?.batchAmountReach) {
    conditions.push(
      `${stopConditions?.batchAmountReach} ${
        stopConditions?.batchAmountReach === 1 ? "BATCH" : "BATCHES"
      }`
    );
  }

  return (
    <div className="md:mt-0 mt-[20px] md:pr-[20px] pr-0 w-96">
      <p className="text-dark40 text-[14px] md:text-[16px] font-bold">
        End Conditions
      </p>
      <div className="flex mt-[5px]">
        <div className="text-white text-[12px] md:text-[16px] regular-text">
          {conditions.length === 0 && <p>N/A</p>}
          {conditions.map((cond, i) => (
            <p key={`pool-item-${i}`}>
              {cond}{" "}
              {i < conditions.length - 1 && (
                <span className="text-dark50 text-[14px]">or</span>
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
