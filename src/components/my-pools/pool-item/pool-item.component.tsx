import { useMemo } from "react";
import { ShareIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import ProgressBar from "@ramonak/react-progress-bar";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import classnames from "classnames";
import { PocketNote } from "@/src/components/my-pools/pool-item/pocket-note";
import { DATE_FORMAT, utilsProvider } from "@/src/utils";
import dayjs from "dayjs";
import { PoolItemEndConditionComponent } from "@/src/components/my-pools/pool-item/pool-item-end-condition.component";
import { ProgressDetailComponent } from "@/src/components/my-pools/pool-item/progress-detail.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

type PoolItemProps = {
  data: PocketEntity;
};
export const PoolItem = (props: PoolItemProps) => {
  const { data } = props;
  const { whiteLists, convertDecimalAmount } = useWhiteList();

  /** @dev Get target token data base on address. */
  const targetToken = useMemo<WhitelistEntity>(
    () => whiteLists[data.quoteTokenAddress],
    [data]
  );

  /** @dev Get base token data base on address. */
  const baseToken = useMemo<WhitelistEntity>(
    () => whiteLists[data.baseTokenAddress],
    [data]
  );

  /** @dev Condition filter pockets which is paused only. */
  const isPaused = useMemo(() => data.status === PocketStatus.PAUSED, [data]);

  return (
    <div className="w-full min-h-[100px] rounded-[32px] bg-dark90 py-[32px] md:px-[100px] px-[20px] mt-[40px]">
      <div className="flow-root">
        <p className="text-[24px] text-white normal-text float-left">
          {data.name}
        </p>
        <p className="float-right text-dark50 text-[16px] regular-text relative top-[6px]">
          #{data.id}
        </p>
      </div>
      <div className="flow-root mt-[24px]">
        <div className="md:float-left md:w-[430px] w-full bg-dark80 rounded-[8px] px-[22px] py-[20px] flow-root">
          <div className="flex items-center float-left">
            <div className="w-[44px] h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[5px] border-dark70">
              {whiteLists[data.quoteTokenAddress]?.image && (
                <img
                  src={whiteLists[data.quoteTokenAddress]?.image}
                  className="rounded-[50%]"
                />
              )}
            </div>
            <div className="pl-[20px]">
              <p className="text-white text-[18px] normal-text uppercase">
                {targetToken?.symbol}
              </p>
              <p className="text-white text-[14px] normal-text">
                {targetToken?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center float-right relative top-[5px]">
            <div className="py-[5px] px-[30px] border-solid border-[2px] border-dark70 rounded-[8px]">
              <p className="text-dark50 text-[14px] normal-text">
                {utilsProvider.makeShort(data.quoteTokenAddress)}
              </p>
            </div>
            <a href="" className="ml-[10px]">
              <ShareIcon />
            </a>
          </div>
        </div>
        <div className="md:float-right md:w-96 md:mt-0 mt-[20px]">
          <div className="flex">
            <p className="text-dark40 text-[16px] normal-text w-[30%] float-left">
              Strategy
            </p>
            <div>
              <p className="text-white text-[18px] normal-text w-[70%] float-left text-end">
                {convertDecimalAmount(data.quoteTokenAddress, data.batchVolume)}{" "}
                {targetToken?.symbol} every 15 days
                {/*{luxon(data.frequency)}*/}
              </p>
              <p className="mt-4 text-white text-[18px] normal-text w-[70%] float-left text-end">
                {"BLOCK <= $0.051706"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[24px]">
        <p className="text-dark40 text-[16px] font-bold">Progress</p>
        <ProgressBar
          completed={data.progressPercent}
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
            {data.progressPercent.toFixed(2)}%
          </p>
          <div className="float-right">
            <ProgressDetailComponent targetToken={targetToken} data={data} />
          </div>
        </div>
      </div>
      <div className="mt-[24px] flex justify-between flex-row">
        <div>
          <p className="text-dark40 text-[16px] font-bold">
            Pocket information
          </p>
          <div className="flex items-center mt-[5px]">
            <p className="w-[200px] text-[14px] text-dark40 normal-text">
              Start date:
            </p>
            <p className="text-white text-[16px] normal-text">
              {dayjs(data.startTime).format(DATE_FORMAT)}
            </p>
          </div>
          <div className="flex items-center mt-[5px]">
            <p className="w-[200px] text-[14px] text-dark40 normal-text">
              Total deposited
            </p>
            <p className="text-white text-[16px] normal-text">
              {convertDecimalAmount(
                data?.baseTokenAddress,
                data.remainingBaseTokenBalance
              )}{" "}
              {baseToken?.symbol}
            </p>
          </div>
          <div className="flex items-center mt-[5px]">
            <p className="w-[200px] text-[14px] text-dark40 normal-text">
              Outstanding deposit:
            </p>
            <p className="text-white text-[16px] normal-text">
              {convertDecimalAmount(data?.baseTokenAddress, 0)}{" "}
              {whiteLists[data.baseTokenAddress]?.symbol}
            </p>
          </div>
        </div>
        <PoolItemEndConditionComponent targetToken={targetToken} data={data} />
      </div>
      <PocketNote status={data.status} />
      <div className="mt-[24px] md:flow-root">
        <p
          className={classnames(
            "md:float-left text-[16px] uppercase text-normal relative top-[10px]",
            isPaused ? "text-orange-500" : "text-green"
          )}
        >
          {isPaused ? "PAUSED" : "ACTIVE"}
        </p>
        <div className="md:float-right md:flex mt-[20px] md:mt-0 md:w-auto w-[200px]">
          <div className="md:float-right">
            <Button
              className="!px-[50px] md:w-auto !w-full"
              theme={{
                backgroundColor: "#B998FB",
                color: "#FFFFFF",
              }}
              text="Deposit"
              width="100%"
            />
          </div>
          <div className="md:float-right md:ml-[10px] mt-[15px] md:mt-0 md:w-auto w-[200px]">
            {isPaused ? (
              <Button
                className="!px-[50px] md:w-auto"
                theme={{
                  backgroundColor: "#B998FB",
                  color: "#FFFFFF",
                }}
                text="Continue"
                width="100%"
              />
            ) : (
              <Button
                className="!px-[50px] md:w-auto"
                theme={{
                  backgroundColor: "#B998FB",
                  color: "#FFFFFF",
                }}
                text="Pause"
                width="100%"
              />
            )}
          </div>
          <div className="md:float-right md:ml-[10px] mt-[15px] md:mt-0 md:w-auto w-[200px]">
            <Button
              className="!px-[50px] !border-solid !border-purple !border-[2px]"
              theme={{
                backgroundColor: "transparent",
                color: "#B998FB",
                hoverColor: "#B998FB",
              }}
              text="Close"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
