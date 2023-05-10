import { FC, useEffect, useState, useMemo } from "react";
import { RightArrowIcon } from "@/src/components/icons";
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

  const { whiteLists, findEntityByAddress } = useWhiteList();

  const baseToken = useMemo(
    () =>
      whiteLists?.[props?.pocket?.baseTokenAddress] ||
      findEntityByAddress(props?.pocket?.baseTokenAddress),
    [props.pocket]
  );

  const targetToken = useMemo(
    () =>
      whiteLists?.[props?.pocket?.targetTokenAddress] ||
      findEntityByAddress(props?.pocket?.targetTokenAddress),
    [props.pocket]
  );

  const statusTheme = (status: PoolActivityStatus) => {
    switch (status) {
      case PoolActivityStatus.SUCCESSFUL:
        return ["Success", "#4ADE801F", "#26C673"];
      case PoolActivityStatus.FAILED:
        return ["Failed", "#F755551F", "#F44949"];
    }
  };

  useEffect(() => {
    console.log("fecty activities", props.pocket);
    dispatch(
      getPocketActivities(
        { pocketId: props?.pocket?.id || props?.pocket?._id },
        (activities) => {
          console.log("Pocket activities: ", activities);
          setActivitesHistory(activities);
        }
      )
    );
  }, [props.pocket]);

  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      {activitiesHistory
        ?.filter((item) => item.type === PoolType.SWAPPED)
        .map((item, index) => (
          <div
            className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]"
            key={`transaction-item-${index}`}
          >
            <div className="grid grid-cols-12 text-white text-[14px]">
              <div className="col-span-1 text-center">{index + 1}</div>
              <div className="col-span-3 text-center">
                {dayjs(item.createdAt).format(DATE_TIME_FORMAT)}
              </div>
              <div className="col-span-4 text-center flex items-center justify-center">
                <p>{`${item.baseTokenAmount} ${baseToken?.symbol}`}</p>
                <RightArrowIcon className="mx-[20px]" />
                <p>{`${item.targetTokenAmount} ${targetToken?.symbol}`}</p>
              </div>
              <div className="col-span-3 text-center">
                <div className="float-right mobile:flex mobile:items-center md:text-center">
                  <div
                    style={{ backgroundColor: statusTheme(item.status)?.[1] }}
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
            </div>
          </div>
        ))}
    </div>
  );
};
