/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useMemo, useState } from "react";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { Button } from "@hamsterbox/ui-kit";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { DATE_TIME_FORMAT } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { PoolItemBuyConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-buy-condition.component";
import dayjs from "dayjs";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  DepositModal,
  // ClosePocketModal,
  // PausePocketModal,
  // ResumePocketModal,
  // ClaimFeeModal,
} from "@/src/components/home";
Chart.register(ArcElement, Legend, Tooltip);

export const EndCondition: FC<{ pocket: PocketEntity; handleFetch(): void }> = (
  props
) => {
  const pocket = props.pocket;

  /** @dev Condition to show modal to deposit. */
  const [depositedDisplayed, setDepositedDisplayed] = useState(false);

  /** @dev Inject needed modules to get token account. */
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

  const conditions = [];
  const stopConditions = pocket?.stopConditions;

  if (stopConditions?.endTime) {
    conditions.push([
      "End time",
      `${dayjs(stopConditions?.endTime).format(DATE_TIME_FORMAT)}`,
    ]);
  }
  if (stopConditions?.baseTokenReach) {
    conditions.push([
      "Base token amount reach",
      <span>
        {analyzeDecimals(
          convertDecimalAmount(
            targetToken?.address,
            stopConditions?.baseTokenReach
          )
        )}
        {targetToken?.symbol}
      </span>,
    ]);
  }
  if (stopConditions?.receivedTargetTokenReach) {
    conditions.push([
      "Target token amount reach",
      <span>
        {analyzeDecimals(
          convertDecimalAmount(
            targetToken?.address,
            stopConditions?.receivedTargetTokenReach
          )
        )}
        {targetToken?.symbol}
      </span>,
    ]);
  }
  if (stopConditions?.spentBaseTokenReach) {
    conditions.push([
      "Spent base token amount reach",
      <span>
        {analyzeDecimals(
          convertDecimalAmount(
            baseToken?.address,
            stopConditions?.spentBaseTokenReach
          )
        )}
        {baseToken?.symbol}
      </span>,
    ]);
  }
  if (stopConditions?.batchAmountReach) {
    conditions.push([
      "Batch amount reach",
      `${stopConditions?.batchAmountReach} ${
        stopConditions?.batchAmountReach === 1 ? "BATCH" : "BATCHES"
      }`,
    ]);
  }

  return conditions.length ? (
    <div>
      <p className="text-dark45 text-[20px]">End Conditions</p>
      <div className="bg-dark100 rounded-[12px] p-[16px] mt-[12px]">
        {conditions.map((stopCondition, index) => {
          return (
            <div
              key={`sumary-end-conditions-${index}`}
              className="flow-root items-center normal-text mb-[10px]"
            >
              <p className="float-left text-dark50 normal-text">
                {index <= 0 ? stopCondition[0] : "OR "}
              </p>
              <p className="text-white normal-text float-right">
                {stopCondition[1]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};
