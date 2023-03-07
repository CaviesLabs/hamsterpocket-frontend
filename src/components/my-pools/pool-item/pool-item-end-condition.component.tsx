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
    data: { stopConditions, baseTokenAddress, targetTokenAddress },
  } = props;

  /** @dev Inject whitelist to get info. */
  const { whiteLists } = useWhiteList();

  return (
    <div className="md:mt-0 mt-[20px] md:pr-[20px] pr-0 w-96">
      <p className="text-dark40 text-[16px] font-bold">End Conditions</p>
      <div className="flex mt-[5px]">
        <div className="text-white text-[16px] normal-text">
          {stopConditions.endTime && (
            <p>
              {dayjs(stopConditions.endTime).format(DATE_FORMAT)}{" "}
              <span className="text-dark50 text-[14px]">or</span>
            </p>
          )}
          {stopConditions.baseTokenReach && (
            <p>
              {stopConditions.baseTokenReach}{" "}
              {whiteLists[baseTokenAddress]?.symbol}{" "}
              <span className="text-dark50 text-[14px]">or</span>
            </p>
          )}
          {stopConditions.targetTokenReach && (
            <p>
              {stopConditions.targetTokenReach}{" "}
              {whiteLists[targetTokenAddress]?.symbol}{" "}
              <span className="text-dark50 text-[14px]">or</span>
            </p>
          )}
          {stopConditions.batchAmountReach && (
            <p>{stopConditions.batchAmountReach} PAX </p>
          )}
        </div>
      </div>
    </div>
  );
};
