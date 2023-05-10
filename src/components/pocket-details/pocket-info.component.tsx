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

export const PocketInfo: FC<{ pocket: PocketEntity; handleFetch(): void }> = (
  props
) => {
  const pocket = props.pocket;

  /** @dev Condition to show modal to deposit. */
  const [depositedDisplayed, setDepositedDisplayed] = useState(false);

  /** @dev Inject needed modules to get token account. */
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

  /** @dev Condition filter pockets which is paused only. */
  const isActive = useMemo(
    () => pocket?.status === PocketStatus.ACTIVE,
    [pocket]
  );
  const isPaused = useMemo(
    () => pocket?.status === PocketStatus.PAUSED,
    [pocket]
  );
  const isClosed = useMemo(
    () => pocket?.status === PocketStatus.CLOSED,
    [pocket]
  );
  const isEnded = useMemo(
    () => pocket?.status === PocketStatus.ENDED,
    [pocket]
  );
  const isWithdrawed = useMemo(() => !isEnded && isClosed, [isEnded, isClosed]);

  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Total deposited</p>
        <p className="text-white normal-text float-right">
          {convertDecimalAmount(baseToken?.address, pocket?.depositedAmount)}{" "}
          {baseToken?.symbol}
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Strategy</p>
        <p className="text-white normal-text float-right">
          <PoolItemBuyConditionComponent
            data={pocket}
            baseToken={baseToken}
            targetToken={targetToken}
          />
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Next batch time</p>
        <p className="text-white normal-text float-right">
          {dayjs(props.pocket?.nextExecutionAt?.toLocaleString()).format(
            DATE_TIME_FORMAT
          )}
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">View by</p>
        <ProgressBar
          completed={props.pocket?.progressPercent * 100}
          bgColor="#735CF7"
          baseBgColor="#060710"
          customLabel={`${props.pocket?.progressPercent * 100}%`}
          labelAlignment="center"
          labelClassName="progress-label app-font"
          className="mt-[30px]"
          height="10px"
        />
        <div className="flow-root mt-[16px]">
          <div className="float-right">
            <p className="text-dark50 normal-text">Start date</p>
            <p className="text-white normal-text">
              {dayjs(props.pocket?.startTime?.toLocaleString()).format(
                DATE_TIME_FORMAT
              )}
            </p>
          </div>
          <div className="float-left">
            <p className="text-dark50 normal-text">Time left</p>
            {/* <p className="text-white normal-text">234 day(s)</p> */}
            {/* <p className="text-white normal-text">234 day(s)</p> */}
          </div>
        </div>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <div className="float-left">
          <p className="text-dark50 normal-text">Outstanding deposit</p>
          <p className="text-white normal-text">
            {convertDecimalAmount(
              baseToken?.address,
              pocket?.remainingBaseTokenBalance - pocket?.batchVolume
            )}{" "}
            {baseToken?.symbol}
          </p>
        </div>
        <div className="float-right">
          {(isActive || isPaused) && (
            <Button
              className="!px-[50px] md:w-auto !w-full pool-control-btn"
              onClick={() => setDepositedDisplayed(true)}
              theme={{
                backgroundColor: "#735CF7",
                color: "#FFFFFF",
              }}
              text="Deposit Now"
              width="100%"
            />
          )}
        </div>
      </div>
      {depositedDisplayed && (
        <DepositModal
          isModalOpen={depositedDisplayed}
          handleOk={() => {
            setDepositedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setDepositedDisplayed(false)}
          pocket={pocket}
        />
      )}
    </div>
  );
};
