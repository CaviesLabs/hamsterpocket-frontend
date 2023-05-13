/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useMemo } from "react";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { DATE_TIME_FORMAT } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import dayjs from "dayjs";
Chart.register(ArcElement, Legend, Tooltip);

export const PocketInfo: FC<{ pocket: PocketEntity; handleFetch(): void }> = (
  props
) => {
  const pocket = props.pocket;

  /** @dev Inject needed modules to get token account. */
  const { whiteLists, findEntityByAddress, convertDecimalAmount } =
    useWhiteList();

  /** @dev Get base token info. */
  const baseToken = useMemo(
    () =>
      whiteLists[pocket?.baseTokenAddress] ||
      findEntityByAddress(pocket?.baseTokenAddress),
    [pocket, props]
  );

  return (
    <div className="bg-dark100 rounded-[12px] p-[16px]">
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Total deposited</p>
        <p className="text-white normal-text float-right">
          {convertDecimalAmount(baseToken?.address, pocket?.depositedAmount)}{" "}
          {baseToken?.symbol}
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Start date</p>
        <p className="text-white normal-text float-right">
          {dayjs(props.pocket?.startTime?.toLocaleString()).format(
            DATE_TIME_FORMAT
          )}
        </p>
      </div>
    </div>
  );
};
