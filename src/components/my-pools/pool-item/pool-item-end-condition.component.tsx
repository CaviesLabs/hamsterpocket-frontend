/* eslint-disable @typescript-eslint/no-unused-vars */
import { PocketEntity } from "@/src/entities/pocket.entity";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/src/utils";
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
    data: {
      stopConditions: {
        endTime,
        baseTokenReach,
        targetTokenReach,
        batchAmountReach,
      },
      baseTokenAddress,
      targetTokenAddress,
    },
  } = props;

  /** @dev Inject whitelist to get info. */
  const { whiteLists } = useWhiteList();

  const conditions = [];
  if (endTime) {
    conditions.push(dayjs(endTime).format(DATE_FORMAT));
  }
  if (baseTokenReach) {
    conditions.push(
      `${baseTokenReach} ${whiteLists[baseTokenAddress]?.symbol}`
    );
  }
  if (targetTokenReach) {
    conditions.push(
      `${targetTokenReach} ${whiteLists[targetTokenAddress]?.symbol}`
    );
  }
  if (batchAmountReach) {
    conditions.push(`${batchAmountReach} PAX`);
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
