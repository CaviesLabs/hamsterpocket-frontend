/* eslint-disable @typescript-eslint/no-unused-vars */
import { PocketEntity } from "@/src/entities/pocket.entity";
import dayjs from "dayjs";
import { DATE_FORMAT } from "@/src/utils";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

type PoolItemEndConditionProps = {
  targetToken: WhitelistEntity;
  data: PocketEntity;
};

export const PoolItemEndConditionComponent = (
  props: PoolItemEndConditionProps
) => {
  const { data, targetToken } = props;
  return (
    <div className="md:mt-0 mt-[20px] md:pr-[20px] pr-0 w-96">
      <p className="text-dark40 text-[16px] font-bold">End Conditions</p>
      <div className="flex mt-[5px]">
        <div className="text-white text-[16px] normal-text">
          {/* {data.stopConditions.endTime && (
            <p>
              {dayjs(data.stopConditions.endTime).format(DATE_FORMAT)}{" "}
              <span className="text-dark50 text-[14px]">or</span>
            </p>
          )}
          {data.stopConditions.baseTokenReach && (
            <p>
              {data.stopConditions.baseTokenReach} SOL{" "}
              <span className="text-dark50 text-[14px]">or</span>
            </p>
          )}
          {data.stopConditions.targetTokenReach && (
            <p>
              {data.stopConditions.targetTokenReach} {targetToken.symbol}{" "}
              <span className="text-dark50 text-[14px]">or</span>
            </p>
          )}
          {data.stopConditions.batchAmountReach && (
            <p>{data.stopConditions.batchAmountReach} PAX </p>
          )} */}
        </div>
      </div>
    </div>
  );
};
