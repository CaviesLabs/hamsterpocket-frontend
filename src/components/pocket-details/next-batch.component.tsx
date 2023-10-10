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

export const NextBatch: FC<{ pocket: PocketEntity; handleFetch(): void }> = (
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

  /** @dev Condition filter pockets which is paused only. */
  const isActive = useMemo(
    () => pocket?.status === PocketStatus.ACTIVE,
    [pocket, props]
  );
  const isPaused = useMemo(
    () => pocket?.status === PocketStatus.PAUSED,
    [pocket, props]
  );
  const isClosed = useMemo(
    () => pocket?.status === PocketStatus.CLOSED,
    [pocket, props]
  );
  const isEnded = useMemo(
    () => pocket?.status === PocketStatus.ENDED,
    [pocket, props]
  );
  const isWithdrawed = useMemo(() => !isEnded && isClosed, [isEnded, isClosed]);

  return !isEnded && !isClosed && !isWithdrawed ? (
    <div>
      <p className="text-dark45 text-[20px]">Next Batch</p>
      <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px] mt-[12px]">
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">Next batch time</p>
          <p className="text-white normal-text float-right">
            {dayjs(props.pocket?.nextExecutionAt?.toLocaleString()).format(
              DATE_TIME_FORMAT
            )}
          </p>
        </div>
        <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
          <p className="float-left text-dark50 normal-text">
            Outstanding deposit
          </p>
          <p className="text-white normal-text float-right">
            {pocket?.batchVolume - pocket?.remainingBaseTokenBalance < 0
              ? 0
              : analyzeDecimals(
                  convertDecimalAmount(
                    baseToken?.address,
                    pocket?.batchVolume - pocket?.remainingBaseTokenBalance || 0
                  )
                )}{" "}
            {baseToken?.symbol}
          </p>
        </div>
        {(isActive || isPaused) && (
          <Button
            className="!px-[50px] !w-full  !border-solid !border-[2px] !border-purple300"
            onClick={() => setDepositedDisplayed(true)}
            theme={{
              backgroundColor: "transparent",
              color: "#735CF7",
            }}
            text="Deposit Now"
            width="100%"
          />
        )}
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
    </div>
  ) : null;
};
