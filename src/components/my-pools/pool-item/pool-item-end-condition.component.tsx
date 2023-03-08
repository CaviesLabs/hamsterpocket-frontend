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
  const { whiteLists, convertDecimalAmount } = useWhiteList();

  const conditions = [];
  if (props?.data?.stopConditions?.endTime) {
    conditions.push(
      dayjs(props?.data?.stopConditions?.endTime).format(DATE_TIME_FORMAT)
    );
  }
  if (props?.data?.stopConditions?.baseTokenReach) {
    conditions.push(
      `${convertDecimalAmount(
        baseTokenAddress,
        props?.data?.stopConditions?.baseTokenReach
      )} ${whiteLists[baseTokenAddress]?.symbol}`
    );
  }
  if (props?.data?.stopConditions?.targetTokenReach) {
    conditions.push(
      `${props?.data?.stopConditions?.targetTokenReach} ${whiteLists[targetTokenAddress]?.symbol}`
    );
  }
  if (props?.data?.stopConditions?.spentBaseTokenReach) {
    conditions.push(
      `${convertDecimalAmount(
        baseTokenAddress,
        props?.data?.stopConditions?.spentBaseTokenReach
      )} ${whiteLists[baseTokenAddress]?.symbol}`
    );
  }
  if (props?.data?.stopConditions?.batchAmountReach) {
    conditions.push(
      `${props?.data?.stopConditions?.batchAmountReach} ${
        props?.data?.stopConditions?.batchAmountReach === 1
          ? "BATCH"
          : "BATCHES"
      }`
    );
  }

  return (
    <div className="md:mt-0 mt-[20px] md:pr-[20px] pr-0 w-96">
      <p className="text-dark40 text-[16px] font-bold">End Conditions</p>
      <div className="flex mt-[5px]">
        <div className="text-white text-[16px] normal-text">
          {conditions.length === 0 && <p>N/A</p>}
          {conditions.map((cond, i) => (
            <p>
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
