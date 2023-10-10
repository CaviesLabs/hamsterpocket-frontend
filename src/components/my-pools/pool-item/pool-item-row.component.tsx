import { useEffect, useMemo, useState } from "react";

import { Avatar } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { useWallet } from "@/src/hooks/useWallet";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { utilsProvider, DATE_TIME_FORMAT } from "@/src/utils";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { PoolItemBuyConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-buy-condition.component";

import { ShareIcon } from "@/src/components/icons";
import {
  DepositModal,
  ClosePocketModal,
  PausePocketModal,
  ResumePocketModal,
  ClaimFeeModal,
  ReversePocketModal,
} from "@/src/components/home";

import dayjs from "dayjs";

type PoolItemProps = {
  data: PocketEntity;
  handleFetch(): void;
};
export const PoolItemRow = (props: PoolItemProps) => {
  const { data } = props;
  const {
    whiteLists,
    findEntityByAddress,
    convertDecimalAmount,
    analyzeDecimals,
  } = useWhiteList();
  const { programService } = useWallet();
  const { walletAddress } = useAppWallet();
  const { chainId, dexUrl, platformConfig, pushRouterWithChainId } =
    usePlatformConfig();

  /** @dev Condition to show modal to deposit. */
  const [depositedDisplayed, setDepositedDisplayed] = useState(false);

  /** @dev Condition to show modal to close pocket. */
  const [closedDisplayed, setClosedDisplayed] = useState(false);

  /** @dev Condition to show modal to close pocket. */
  const [reversedDisplayed, setReversedDisplayed] = useState(false);

  /** @dev Condition to show modal to pause pocket. */
  const [pausedDisplayed, setPausedDisplayed] = useState(false);

  /** @dev Condition to show modal to resume pocket. */
  const [resumedDisplayed, setResumedDisplayed] = useState(false);

  /** @dev Condition to show modal to claim fee create pocket. */
  const [claimFeeDisplayed, setClaimFeeDisplayed] = useState(false);

  /** @dev Get target token database on address. */
  const targetToken = useMemo<WhitelistEntity>(
    () =>
      whiteLists[data.targetTokenAddress] ||
      findEntityByAddress(data.targetTokenAddress),
    [props, chainId, walletAddress, whiteLists, findEntityByAddress]
  );

  /** @dev Get base token database on address. */
  const baseToken = useMemo<WhitelistEntity>(
    () =>
      whiteLists[data.baseTokenAddress] ||
      findEntityByAddress(data.baseTokenAddress),
    [props, chainId, walletAddress, whiteLists, findEntityByAddress]
  );

  /** @dev Condition whether pocket account is closed completedly  before. */
  const [isClaimed, setClaimed] = useState(false);

  /** @dev Condition filter pockets which is paused only. */
  const isActive = useMemo(() => data.status === PocketStatus.ACTIVE, [data]);
  const isPaused = useMemo(() => data.status === PocketStatus.PAUSED, [data]);
  const isClosed = useMemo(() => data.status === PocketStatus.CLOSED, [data]);
  const isEnded = useMemo(() => data.status === PocketStatus.ENDED, [data]);
  const isWithdrawed = useMemo(() => !isEnded && isClosed, [isEnded, isClosed]);

  /**
   * @dev Handle to get average price.
   */
  const averagePrice = useMemo(() => {
    /** @dev Get amount of target token which this pocket bought. */
    const targetTokenBought = convertDecimalAmount(
      targetToken?.address,
      data?.currentReceivedTargetToken
    );

    /** @dev Get amount of base toke which this pocket use to pay target tokens. */
    const baseTokenSpent = convertDecimalAmount(
      baseToken?.address,
      data?.currentSpentBaseToken
    );

    return targetTokenBought / baseTokenSpent;
  }, [data, baseToken, targetToken, chainId]);

  const statusComponent = useMemo(() => {
    if (isActive) {
      return (
        <div className="px-[10px] bg-[#4ADE801F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-green300 normal-text">On going</p>
        </div>
      );
    } else if (isPaused) {
      return (
        <div className="px-[10px] bg-[#FACC151F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-[#E8AB35] normal-text">Paused</p>
        </div>
      );
    } else if (isClosed) {
      return (
        <div className="px-[10px] bg-[#F755551F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-red300 normal-text">Closed</p>
        </div>
      );
    } else if (isEnded) {
      return (
        <div className="px-[10px] bg-[#F755551F] rounded-[8px] inline-block mx-auto">
          <p className="text-center text-red300 normal-text">Ended</p>
        </div>
      );
    }
  }, [isActive, isPaused, isClosed]);

  useEffect(() => {
    (async () => {
      try {
        if (chainId === ChainId.sol) {
          programService && (await programService.getPocketAccount(data._id));
        }
        setClaimed(false);
      } catch (err) {
        console.log(err);
        setClaimed(true);
      }
    })();
  }, [data, programService, chainId]);

  return (
    <div className="w-full min-h-[100px] rounded-[8px] bg-[#121320] py-[32px] px-[20px] mt-[40px] overflow-hidden">
      <div className="md:grid md:grid-cols-12">
        <div
          className="md:col-span-3 cursor-pointer mobile:flow-root mobile:bg-dark3 mobile:py-[10px] mobile:px-[10px] mobile:rounded-[12px] cursor-poiter"
          onClick={() => pushRouterWithChainId(`/pocket/${data.id}`)}
        >
          <div className="flex items-center mobile:float-left">
            <Avatar
              className={
                "w-[44px] h-[44px] bg-dark70 flex justify-center items-center border-solid border-[3px] border-white text-[8px]"
              }
              src={targetToken?.image}
            >
              {targetToken?.symbol}
            </Avatar>
            <p className="text-white text-[16px] regular-text flex items-center ml-[10px] mobile:text-[14px]">
              {targetToken?.symbol}/{baseToken?.symbol}
              <a
                href={utilsProvider.getUrl(dexUrl, {
                  [platformConfig?.whitelistedRouters?.[0]?.inputTag]:
                    baseToken?.address,
                  [platformConfig?.whitelistedRouters?.[0]?.outputTag]:
                    targetToken?.address,
                })}
                target="_blank"
                className="ml-[10px] relative top-[-3px]"
              >
                <ShareIcon size="20" />
              </a>
            </p>
          </div>
          <p className="text-dark50 text-[12px] regular-text top-[3px] md:top-[6px] flex items-center mt-[5px] mobile:float-right mobile:text-right relative">
            #{utilsProvider.makeShort(data.id)}
          </p>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-[#1C1D2C]  mobile:py-[12px] mobile:mt-[30px]">
          <p className="md:hidden float-left text-dark50 mobile:text-[14px]">
            Strategy
          </p>
          <div className="mobile:float-right">
            <PoolItemBuyConditionComponent
              data={data}
              baseToken={baseToken}
              targetToken={targetToken}
            />
          </div>
        </div>
        <div className="md:col-span-1 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-[#1C1D2C]  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50 mobile:text-[14px]">
            Total invested
          </p>
          <p className="md:text-center text-white normal-text mobile:float-right mobile:text-[14px]">
            {convertDecimalAmount(
              baseToken?.address,
              data?.currentSpentBaseToken
            )}{" "}
            {baseToken?.symbol}
          </p>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-[#1C1D2C]  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50 mobile:text-[14px]">
            APL(ROI)
          </p>
          <div className="mobile:float-right mobile:flex mobile:items-center mobile:text-[14px] md:text-center">
            {data?.currentROIValue !== 0 &&
            data?.status !== PocketStatus.ENDED &&
            data?.status !== PocketStatus.CLOSED &&
            chainId !== ChainId.sol ? (
              <>
                <p
                  className={`"md:text-center ${
                    (data?.currentROIValue || 0) < 0
                      ? "text-red300"
                      : "text-green300"
                  } normal-text"`}
                >
                  {analyzeDecimals(data?.currentROIValue) || 0}{" "}
                  {baseToken?.symbol}
                </p>
                <p
                  className={`md:text-center md:mt-[5px] ${
                    (data?.currentROI || 0) < 0
                      ? "text-red300"
                      : "text-green300"
                  } mobile:ml-[5px]`}
                >
                  ({data?.currentROI?.toFixed(2) || 0}%)
                </p>
              </>
            ) : (
              <p className="text-center text-white">N/A</p>
            )}
          </div>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-[#1C1D2C]  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50 mobile:text-[14px]">
            Average price
          </p>
          <div className="mobile:float-right mobile:flex mobile:items-center mobile:text-[14px]">
            {averagePrice ? (
              <>
                <p className="text-center text-white normal-text">
                  1 {baseToken?.symbol}
                </p>
                <p className="text-center md:mt-[5px] md:text-[12px] text-white">
                  = {analyzeDecimals(averagePrice)} {targetToken?.symbol}
                </p>
              </>
            ) : (
              <p className="text-center text-white normal-text">N/A</p>
            )}
          </div>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-[#1C1D2C]  mobile:py-[12px]">
          <p className="md:hidden float-left text-dark50 mobile:text-[14px]">
            {isClosed || isEnded || isClaimed
              ? "Close at time"
              : "Next batch time"}
          </p>
          <div className="mobile:float-right mobile:flex mobile:items-center md:text-center mobile:text-[14px]">
            <div className="mobile:hidden">{statusComponent}</div>
            <p className="text-center md:mt-[5px] text-[12px] text-dark50 mobile:ml-[5px]">
              {isClosed || isEnded || isClaimed
                ? dayjs(
                    (data?.closedAt || data?.endedAt)?.toLocaleString()
                  ).format(DATE_TIME_FORMAT)
                : dayjs(data?.nextExecutionAt?.toLocaleString()).format(
                    DATE_TIME_FORMAT
                  )}
            </p>
          </div>
        </div>
        <div className="md:col-span-2 mobile:flow-root mobile:border-b-[1px] mobile:border-solid mobile:border-[#1C1D2C]  mobile:py-[12px] md:hidden">
          <p className="md:hidden float-left text-dark50 mobile:text-[14px]">
            Status
          </p>
          <div className="mobile:float-right mobile:flex mobile:items-center md:text-center mobile:text-[14px]">
            {statusComponent}
          </div>
        </div>
      </div>
      <div className="mt-[10px] flow-root">
        {!isWithdrawed && !(isEnded && !isClaimed) && (
          <div className="md:float-right flex mt-[20px] md:mt-0 md:w-auto mobile:grid mobile:grid-cols-3 mobile:gap-3">
            <div className="md:float-right mobile:col-span-1">
              {(isActive || isPaused) && (
                <Button
                  className="!px-[50px] md:w-auto !w-full pool-control-btn"
                  theme={{
                    backgroundColor: "#735CF7",
                    color: "#FFFFFF",
                  }}
                  text="Deposit"
                  width="100%"
                  onClick={() => setDepositedDisplayed(true)}
                />
              )}
            </div>
            <div className="md:float-right md:ml-[10px] md:mt-0 md:w-auto mobile:col-span-1">
              {!isClosed &&
                !isEnded &&
                (isPaused ? (
                  <Button
                    className="!px-[50px] md:w-auto pool-control-btn"
                    theme={{
                      backgroundColor: "#735CF7",
                      color: "#FFFFFF",
                    }}
                    text="Resume"
                    width="100%"
                    onClick={() => setResumedDisplayed(true)}
                  />
                ) : (
                  <Button
                    className="!px-[50px] md:w-auto pool-control-btn"
                    theme={{
                      backgroundColor: "#735CF7",
                      color: "#FFFFFF",
                    }}
                    text="Pause"
                    width="100%"
                    onClick={() => setPausedDisplayed(true)}
                  />
                ))}
            </div>
            <div className="md:float-right md:ml-[10px] md:mt-0 md:w-auto mobile:col-span-1">
              {!isEnded && (
                <>
                  <Button
                    className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn"
                    theme={{
                      backgroundColor: "transparent",
                      color: "#735CF7",
                      hoverColor: "#735CF7",
                    }}
                    text={isClosed ? "Withdraw" : "Close"}
                    width="100%"
                    onClick={() => setClosedDisplayed(true)}
                  />
                </>
              )}
              {isEnded && !isClaimed && chainId === ChainId.sol && (
                <Button
                  className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn"
                  theme={{
                    backgroundColor: "transparent",
                    color: "#735CF7",
                    hoverColor: "#735CF7",
                  }}
                  text="Claim fee"
                  width="100%"
                  onClick={() => setClaimFeeDisplayed(true)}
                />
              )}
            </div>
          </div>
        )}
        {isWithdrawed && !isEnded && (
          <div className="md:float-right md:ml-[10px] md:mt-0 mt-[20px] md:w-auto mobile:col-span-1 flex mobile:grid mobile:grid-cols-6">
            <div className="mobile:col-span-2">
              <Button
                className="!px-[50px] !border-solid !border-purple300 !border-[2px] md:pool-control-btn text-center"
                theme={{
                  backgroundColor: "transparent",
                  color: "#735CF7",
                  hoverColor: "#735CF7",
                }}
                text="Withdraw"
                onClick={() => {
                  setClosedDisplayed(true);
                }}
                width="100%"
              />
            </div>
            {data?.currentTargetTokenBalance > 0 && chainId !== ChainId.sol ? (
              <div className="mobile:col-span-4">
                <Button
                  className="!border-solid !border-purple300 !border-[2px] md:pool-control-btn ml-[10px] text-center"
                  theme={{
                    backgroundColor: "#735CF7",
                    color: "#ffffff",
                  }}
                  text={`Reverse to ${baseToken?.symbol}`}
                  onClick={() => setReversedDisplayed(true)}
                  width="100%"
                />
              </div>
            ) : null}
          </div>
        )}
        {isEnded && !isClaimed && chainId === ChainId.sol && (
          <div className="md:float-right md:ml-[10px] md:mt-0 mt-[20px] md:w-auto mobile:col-span-1">
            <Button
              className="!px-[50px] !border-solid !border-purple300 !border-[2px] pool-control-btn text-center mx-auto mobile:!max-w-[150px]"
              theme={{
                backgroundColor: "transparent",
                color: "#735CF7",
                hoverColor: "#735CF7",
              }}
              text="Claim fee"
              width="100%"
              onClick={() => setClaimFeeDisplayed(true)}
            />
          </div>
        )}
      </div>
      {depositedDisplayed && (
        <DepositModal
          isModalOpen={depositedDisplayed}
          handleOk={() => {
            setDepositedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setDepositedDisplayed(false)}
          pocket={data}
        />
      )}
      {closedDisplayed && (
        <ClosePocketModal
          isModalOpen={closedDisplayed}
          handleOk={() => {
            setClosedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setClosedDisplayed(false)}
          pocket={data}
          closed={!isEnded && isClosed}
        />
      )}
      {reversedDisplayed && (
        <ReversePocketModal
          isModalOpen={reversedDisplayed}
          handleOk={() => {
            setReversedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setReversedDisplayed(false)}
          pocket={data}
        />
      )}
      {resumedDisplayed && (
        <ResumePocketModal
          isModalOpen={resumedDisplayed}
          handleOk={() => {
            setResumedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setResumedDisplayed(false)}
          pocket={data}
        />
      )}
      {pausedDisplayed && (
        <PausePocketModal
          isModalOpen={pausedDisplayed}
          handleOk={() => {
            setPausedDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setPausedDisplayed(false)}
          pocket={data}
        />
      )}
      {claimFeeDisplayed && (
        <ClaimFeeModal
          pocket={data}
          isModalOpen={claimFeeDisplayed}
          handleCancel={() => setClaimFeeDisplayed(false)}
          handleOk={() => {
            setClaimFeeDisplayed(false);
            props.handleFetch();
          }}
        />
      )}
    </div>
  );
};
