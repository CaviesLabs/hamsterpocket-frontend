import { useEffect, useMemo, useState } from "react";
import { ShareIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import ProgressBar from "@ramonak/react-progress-bar";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import classnames from "classnames";
import { PocketNote } from "@/src/components/my-pools/pool-item/pocket-note";
import { DATE_TIME_FORMAT, formatCurrency, utilsProvider } from "@/src/utils";
import dayjs from "dayjs";
import { PoolItemEndConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-end-condition.component";
import { ProgressDetailComponent } from "@/src/components/my-pools/pool-item/progress-detail.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useWallet } from "@/src/hooks/useWallet";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import {
  DepositModal,
  ClosePocketModal,
  PausePocketModal,
  ResumePocketModal,
  ClaimFeeModal,
} from "@/src/components/home";
import { PoolItemBuyConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-buy-condition.component";

type PoolItemProps = {
  data: PocketEntity;
  handleFetch(): void;
};
export const PoolItem = (props: PoolItemProps) => {
  const { data } = props;
  const { whiteLists, convertDecimalAmount } = useWhiteList();
  const { programService } = useWallet();

  /** @dev Condition to show modal to deposit. */
  const [depositedDisplayed, setDepositedDisplayed] = useState(false);

  /** @dev Condition to show modal to close pocket. */
  const [closedDisplayed, setClosedDisplayed] = useState(false);

  /** @dev Condition to show modal to pause pocket. */
  const [pausedDisplayed, setPausedDisplayed] = useState(false);

  /** @dev Condition to show modal to resume pocket. */
  const [resumedDisplayed, setResumedDisplayed] = useState(false);

  /** @dev Condition to show modal to claim fee create pocket. */
  const [claimFeeDisplayed, setClaimFeeDisplayed] = useState(false);

  /** @dev Get target token database on address. */
  const targetToken = useMemo<WhitelistEntity>(
    () => whiteLists[data.targetTokenAddress],
    [data]
  );

  /** @dev Get base token database on address. */
  const baseToken = useMemo<WhitelistEntity>(
    () => whiteLists[data.baseTokenAddress],
    [data]
  );

  /** @dev Condition whether pocket account is closed completedly  before. */
  const [isClaimed, setClaimed] = useState(false);

  /** @dev Condition filter pockets which is paused only. */
  const isActive = useMemo(() => data.status === PocketStatus.ACTIVE, [data]);
  const isPaused = useMemo(() => data.status === PocketStatus.PAUSED, [data]);
  const isClosed = useMemo(() => data.status === PocketStatus.CLOSED, [data]);
  const isEnded = useMemo(() => data.status === PocketStatus.ENDED, [data]);
  const isWithdrawed = useMemo(() => !isEnded && isClosed, [isEnded, isClosed]);

  useEffect(() => {
    (async () => {
      try {
        programService && (await programService.getPocketAccount(data._id));
        setClaimed(false);
      } catch (err) {
        console.log(err);
        setClaimed(true);
      }
    })();
  }, [data, programService]);

  /** @dev */
  const hummanStatus = useMemo(() => {
    switch (data.status) {
      case PocketStatus.PAUSED:
        return "PAUSED";
      case PocketStatus.CLOSED:
        return "CLOSED";
      case PocketStatus.ENDED:
        return "ENDED";
      case PocketStatus.ACTIVE:
      default:
        return "ACTIVE";
    }
  }, [data]);

  return (
    <div className="w-full min-h-[100px] rounded-[32px] bg-dark90 py-[32px] md:px-[100px] px-[20px] mt-[40px]">
      <div className="flow-root">
        <p className="text-[16px] md:text-[24px] text-white normal-text float-left">
          {data.name}
        </p>
        <p className="float-right text-dark50 text-[12px] md:text-[16px] regular-text relative top-[3px] md:top-[6px] flex items-center">
          #{utilsProvider.makeShort(data.id)}
          <a
            href={`https://solscan.io/account/${data.address}`}
            target="_blank"
            className="ml-[10px] relative top-[-3px]"
          >
            <ShareIcon />
          </a>
        </p>
      </div>
      <div className="md:flex justify-between mt-[24px]">
        <div className="md:w-[430px] w-full bg-dark80 rounded-[8px] px-[22px] py-[20px] flow-root">
          <div className="flex items-center float-left">
            <div className="w-[30px] md:w-[44px] md:h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[5px] border-dark70">
              {targetToken?.image && (
                <img
                  src={targetToken?.image}
                  className="rounded-[50%]"
                  alt={data.targetTokenAddress}
                />
              )}
            </div>
            <div className="pl-[20px]">
              <p className="text-white text-[14px] md:text-[18px] normal-text uppercase">
                {targetToken?.symbol}
              </p>
              <p className="text-white text-[12px] md:text-[14px] regular-text">
                {targetToken?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center float-right relative top-[5px]">
            <div className="py-[5px] px-[15px] md:px-[30px] border-solid border-[2px] border-dark70 rounded-[8px]">
              <p className="text-dark50 text-[12px] md:text-[14px] normal-text">
                {utilsProvider.makeShort(data.targetTokenAddress)}
              </p>
            </div>
            <a
              href={`https://raydium.io/swap?inputCurrency=${data.baseTokenAddress}&outputCurrency=${data.targetTokenAddress}`}
              target="_blank"
              className="ml-[10px]"
            >
              <ShareIcon className="hidden md:block" />
              <ShareIcon className="md:hidden" size="14" />
            </a>
          </div>
        </div>
        <div className="md:mt-0 mt-[20px]">
          <div className="flex">
            <p className="text-dark40 text-[14px] md:text-[16px] normal-text mr-20">
              Strategy
            </p>
            <PoolItemBuyConditionComponent
              data={data}
              baseToken={baseToken}
              targetToken={targetToken}
            />
          </div>
        </div>
      </div>
      <div className="mt-[24px]">
        <p className="text-dark40 text-[14px] md:text-[16px] font-bold">
          Progress
        </p>
        {Object.keys(data.stopConditions).length > 0 &&
        !data.stopConditions.endTime ? (
          <>
            <ProgressBar
              completed={
                data.progressPercent > 1 ? 100 : data.progressPercent * 100
              }
              bgColor="#735CF7"
              baseBgColor="#94A3B8"
              customLabel={`${data.progressPercent * 100}%`}
              labelAlignment="center"
              labelClassName="progress-label app-font"
              className="mt-[10px]"
              height="10px"
            />
            <div className="flow-root mt-[10px]">
              <p className="float-left text-green text-[14px] regular-text">
                {data.progressPercent > 1
                  ? 100
                  : (data.progressPercent * 100).toFixed(2)}
                %
              </p>
              <div className="float-right">
                <ProgressDetailComponent
                  baseToken={baseToken}
                  targetToken={targetToken}
                  data={data}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mt-[5px]">
              <p className="w-[200px] text-[12px] md:text-[14px] text-dark40 normal-text">
                Batch bought:
              </p>
              <p className="text-white text-[12px] md:text-[16px] normal-text">
                {data.currentBatchAmount || 0}{" "}
                {data.currentBatchAmount > 1 ? "BATCHES" : "BATCH"}
              </p>
            </div>
            <div className="flex items-center mt-[5px]">
              <p className="w-[200px] text-[12px] md:text-[14px] text-dark40 normal-text">
                Token bought:
              </p>
              <p className="text-white text-[12px] md:text-[16px] normal-text">
                {formatCurrency(
                  convertDecimalAmount(
                    targetToken?.address,
                    data.currentReceivedTargetToken
                  )
                )}{" "}
                {targetToken?.symbol}
              </p>
            </div>
            <div className="flex items-center mt-[5px]">
              <p className="w-[200px] text-[12px] md:text-[14px] text-dark40 normal-text">
                Spent:
              </p>
              <p className="text-white text-[12px] md:text-[16px] normal-text">
                {formatCurrency(
                  convertDecimalAmount(
                    baseToken?.address,
                    data.currentSpentBaseToken
                  )
                )}{" "}
                {baseToken?.symbol}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="mt-[24px] md:flex justify-between flex-row">
        <div>
          <p className="text-dark40 text-[14px] md:text-[16px] font-bold">
            Pocket information
          </p>
          <div className="flex items-center mt-[5px] regular-text">
            <p className="w-[200px]  text-[12px] md:text-[14px]  text-dark40 ">
              Start date:
            </p>
            <p className="text-white text-[12px] md:text-[16px] w-full text-right">
              {dayjs(data.startTime).format(DATE_TIME_FORMAT)}
            </p>
          </div>
          <div className="flex items-center mt-[5px] regular-text">
            <p className="w-[200px] text-[12px] md:text-[14px] text-dark40">
              Total deposited
            </p>
            <p className="text-white text-[12px] md:text-[16px] w-full text-right">
              {convertDecimalAmount(
                data?.baseTokenAddress,
                data.remainingBaseTokenBalance
              )}{" "}
              {baseToken?.symbol}
            </p>
          </div>
          {data.batchVolume > data.remainingBaseTokenBalance && (
            <div className="flex items-center mt-[5px] regular-text">
              <p className="w-[200px] text-[14px] text-dark40">
                Outstanding deposit:
              </p>
              <p className="text-white text-[12px] md:text-[16px] w-[50%] text-right">
                {convertDecimalAmount(
                  baseToken?.address,
                  data.batchVolume - data.remainingBaseTokenBalance
                )}{" "}
                {baseToken?.symbol}
              </p>
            </div>
          )}
        </div>
        <PoolItemEndConditionComponent targetToken={targetToken} data={data} />
      </div>
      <PocketNote data={data} />
      <div className="mt-[24px] md:flow-root">
        <p
          className={classnames(
            "md:float-left text-[14px] md:text-[16px] uppercase text-normal relative top-[10px] text-green text-center md:text-left",
            {
              "!text-red300": isClosed || isEnded,
              "!text-[#FFAA44]": isPaused,
            }
          )}
        >
          {hummanStatus}
        </p>
        {!isWithdrawed && (
          <div className="md:float-right flex mt-[20px] md:mt-0 md:w-auto mobile:grid mobile:grid-cols-3 mobile:gap-3">
            <div className="md:float-right mobile:col-span-1">
              {(isActive || isPaused) && (
                <Button
                  className="!px-[50px] md:w-auto !w-full pool-control-btn"
                  theme={{
                    backgroundColor: "#B998FB",
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
                      backgroundColor: "#B998FB",
                      color: "#FFFFFF",
                    }}
                    text="Continue"
                    width="100%"
                    onClick={() => setResumedDisplayed(true)}
                  />
                ) : (
                  <Button
                    className="!px-[50px] md:w-auto pool-control-btn"
                    theme={{
                      backgroundColor: "#B998FB",
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
                <Button
                  className="!px-[50px] !border-solid !border-purple !border-[2px] pool-control-btn"
                  theme={{
                    backgroundColor: "transparent",
                    color: "#B998FB",
                    hoverColor: "#B998FB",
                  }}
                  text={isClosed ? "Withdraw" : "Close"}
                  width="100%"
                  onClick={() => setClosedDisplayed(true)}
                />
              )}
              {isEnded && !isClaimed && (
                <Button
                  className="!px-[50px] !border-solid !border-purple !border-[2px] pool-control-btn"
                  theme={{
                    backgroundColor: "transparent",
                    color: "#B998FB",
                    hoverColor: "#B998FB",
                  }}
                  text="Claim fee"
                  width="100%"
                  onClick={() => setClaimFeeDisplayed(true)}
                />
              )}
            </div>
          </div>
        )}
        {isWithdrawed && (
          <div className="md:float-right md:ml-[10px] md:mt-0 mt-[20px] md:w-auto mobile:col-span-1">
            {!isEnded && (
              <Button
                className="!px-[50px] !border-solid !border-purple !border-[2px] pool-control-btn text-center mx-auto"
                theme={{
                  backgroundColor: "transparent",
                  color: "#B998FB",
                  hoverColor: "#B998FB",
                }}
                text="Withdraw"
                width="100%"
                onClick={() => setClosedDisplayed(true)}
              />
            )}
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
          isModalOpen={claimFeeDisplayed}
          handleOk={() => {
            setClaimFeeDisplayed(false);
            props.handleFetch();
          }}
          handleCancel={() => setClaimFeeDisplayed(false)}
          pocket={data}
        />
      )}
    </div>
  );
};
