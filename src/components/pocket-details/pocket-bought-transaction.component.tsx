import { FC, useEffect, useState, useMemo } from "react";
import { RightArrowIcon, ShareIcon } from "@/src/components/icons";
import { useDispatch } from "react-redux";
import { getPocketActivities } from "@/src/redux/actions/history/history.action";
import { PocketEntity } from "@/src/entities/pocket.entity";
import {
  PoolActivityStatus,
  PoolType,
  HistoryEntity,
} from "@/src/entities/history.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { DATE_TIME_FORMAT } from "@/src/utils";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import dayjs from "dayjs";

export type TransactionItem = {
  time: string;
  baseToken: string;
  targetToken: string;
  status: PoolActivityStatus;
  baseAmount: number;
  targetAmount: number;
};

export const BoughtTransaction: FC<{ pocket: PocketEntity }> = (props) => {
  const dispatch = useDispatch();
  const [activitiesHistory, setActivitesHistory] = useState<HistoryEntity[]>(
    []
  );

  const { platformConfig, chainId } = usePlatformConfig();
  const { whiteLists, findEntityByAddress, analyzeDecimals } = useWhiteList();

  const baseToken = useMemo(
    () =>
      whiteLists?.[props?.pocket?.baseTokenAddress] ||
      findEntityByAddress(props?.pocket?.baseTokenAddress),
    [props]
  );

  const targetToken = useMemo(
    () =>
      whiteLists?.[props?.pocket?.targetTokenAddress] ||
      findEntityByAddress(props?.pocket?.targetTokenAddress),
    [props]
  );

  const statusTheme = (status: PoolActivityStatus) => {
    switch (status) {
      case PoolActivityStatus.SUCCESSFUL:
        return ["Success", "#4ADE801F", "#26C673"];
      case PoolActivityStatus.FAILED:
        return ["Failed", "#F755551F", "#F44949"];
    }
  };

  const proccessedActivities = useMemo(
    () =>
      activitiesHistory?.filter(
        (item) =>
          item.type === PoolType.SWAPPED ||
          item.type === PoolType.CLOSED_POSITION
      ),
    [props, activitiesHistory]
  );

  useEffect(() => {
    dispatch(
      getPocketActivities(
        { pocketId: props?.pocket?.id || props?.pocket?._id },
        (activities) => {
          setActivitesHistory(activities);
        }
      )
    );
  }, [props, props.pocket]);

  return proccessedActivities?.length ? (
    <div className="mt-[12px]">
      <p className="text-dark45 text-[20px]">Bought transaction</p>
      <div className="mt-[12px]">
        <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
          {proccessedActivities.map((item, index) => (
            <div
              className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]"
              key={`transaction-item-${index}`}
            >
              <div className="grid grid-cols-12 text-white text-[14px] mobile:text-[12px] items-center">
                <div className="col-span-1 text-center">{index + 1}</div>
                <div className="col-span-3 text-center mobile:col-span-4">
                  {dayjs(item.createdAt).format(DATE_TIME_FORMAT)}
                </div>
                <div className="col-span-4 text-center flex items-center justify-center mobile:col-span-5">
                  {item.type === PoolType.SWAPPED ? (
                    <p className="break-all">
                      {analyzeDecimals(item.baseTokenAmount)}
                      {`${baseToken?.symbol}`}
                    </p>
                  ) : (
                    <p className="break-all">
                      {analyzeDecimals(item.targetTokenAmount)}
                      {`${targetToken?.symbol}`}
                    </p>
                  )}
                  <RightArrowIcon className="md:mx-[20px]" />
                  {item.type === PoolType.SWAPPED ? (
                    <p className="break-all">
                      {analyzeDecimals(item.targetTokenAmount)}
                      {`${targetToken?.symbol}`}
                    </p>
                  ) : (
                    <p className="break-all">
                      {analyzeDecimals(item.baseTokenAmount)}
                      {`${baseToken?.symbol}`}
                    </p>
                  )}
                </div>
                <div className="col-span-2 text-center mobile:hidden">
                  <div className="float-right mobile:flex mobile:items-center md:text-center">
                    <div
                      style={{
                        backgroundColor: statusTheme(item.status)?.[1],
                      }}
                      className={`py-[5px] rounded-[8px] inline-block mx-auto w-[100px]`}
                    >
                      <p
                        style={{ color: statusTheme(item.status)?.[2] }}
                        className={`text-center normal-text`}
                      >
                        {statusTheme(item.status)?.[0]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 ml-[10px] relative top-[-3px] mobile:col-span-1">
                  <a
                    href={
                      chainId.includes("aptos")
                        ? `${platformConfig?.explorerUrl}version/${item.transactionId}`
                        : `${platformConfig?.explorerUrl}tx/${item.transactionId}`
                    }
                    target="_blank"
                    className="ml-[10px] relative top-[-5px]"
                  >
                    <ShareIcon />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};
