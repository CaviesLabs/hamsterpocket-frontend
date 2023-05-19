import { PoolType } from "@/src/entities/history.entity";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ShareIcon } from "@/src/components/icons";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import { groupHistoryByDate } from "./parser";
import {
  utilsProvider,
  DATE_TIME_FORMAT,
  RADYUM_EXPLORE,
  UNISWAP_EXPLORE,
} from "@/src/utils";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";

export default function TableComponent() {
  const { whiteLists, findEntityByAddress } = useWhiteList();
  const { chainId, platformConfig } = usePlatformConfig();
  const historiesData = useSelector((state: State) => state.histories);

  const typeHumanize = (raw: PoolType) => {
    switch (raw) {
      case PoolType.CREATED:
        return "CREATE";
      case PoolType.PAUSED:
        return "PAUSE";
      case PoolType.CONTINUE:
        return "CONTINUE";
      case PoolType.DEPOSITED:
        return "DEPOSIT";
      case PoolType.CLOSED:
        return "CLOSE";
      case PoolType.WITHDRAWN:
        return "WITHDRAW";
      case PoolType.SWAPPED:
        return "SWAPPED";
      case PoolType.SKIPPED:
        return "SKIPPED";
      case PoolType.VAULT_CREATED:
        return "VAULT CREATED";
      case PoolType.CLOSED_POSITION:
        return "CLOSE POSITION";
      case PoolType.STOP_LOSS:
        return "STOP LOSS";
      case PoolType.TAKE_PROFIT:
        return "TAKE PROFIT";
      case PoolType.POCKET_CONFIG_UPDATED:
      case PoolType.UPDATED:
        return "POCKET CONFIG UPDATED";
      default:
        return raw;
    }
  };

  return (
    <div className="mt-11 text-white">
      {historiesData.length ? (
        <LayoutWrapper
          layout={
            <>
              <div className="table-fixed w-full mobile:!hidden">
                <div className="grid grid-cols-12">
                  <th className="max-w-xl pb-4 mobile:text-[12px] col-span-2">
                    Pocket
                  </th>
                  <th className="mobile:text-[12px] col-span-2">Pair</th>
                  <th className="mobile:text-[12px] col-span-2">Type</th>
                  <th className="mobile:text-[12px] col-span-2">Base amount</th>
                  <th className="mobile:text-[12px] col-span-2">
                    Target amount
                  </th>
                  <th className="max-w-[160px] mobile:text-[12px] col-span-1">
                    Time
                  </th>
                </div>
                <div className="normal-text bg-dark100 rounded-[12px] px-[10px] md:max-h-[650px] md:overflow-y-auto boardslist">
                  {historiesData.map((h) => {
                    const poolDoc = h.pool_docs[0];
                    const baseToken =
                      whiteLists[poolDoc.baseTokenAddress] ||
                      findEntityByAddress(poolDoc.baseTokenAddress);
                    const targetToken =
                      whiteLists[poolDoc.targetTokenAddress] ||
                      findEntityByAddress(poolDoc.targetTokenAddress);

                    return (
                      <div
                        key={h._id}
                        className="grid grid-cols-12 px-[5px] py-[30px]"
                      >
                        <div className="col-span-2 text-center">
                          <div className="truncate">{poolDoc.name}</div>
                          <div className="text-dark40 flex">
                            #{utilsProvider.makeShort(h.poolId)}
                            <a
                              href={`/pocket/${poolDoc.address}`}
                              target="_blank"
                              className="ml-2"
                            >
                              <ShareIcon />
                            </a>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="flex">
                            {baseToken?.symbol}/{targetToken?.symbol}
                            {baseToken?.address && targetToken?.address && (
                              <a
                                href={
                                  chainId === ChainId.sol
                                    ? `${RADYUM_EXPLORE}?inputCurrency=${baseToken?.address}&outputCurrency=${targetToken?.address}`
                                    : `${UNISWAP_EXPLORE}&inputCurrency=${baseToken?.address}&outputCurrency=${targetToken?.address}`
                                }
                                target="_blank"
                                className="ml-[10px]"
                              >
                                <ShareIcon />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          {typeHumanize(h.type)}
                        </div>
                        <div className="col-span-2 text-center">
                          {h?.baseTokenAmount ? (
                            <div>{h?.baseTokenAmount.toFixed(3)}</div>
                          ) : (
                            <div className="text-dark40">--</div>
                          )}
                          {/* {h.type === PoolType.DEPOSITED ||
                          h.type === PoolType.WITHDRAWN ||
                          h.type === PoolType.SWAPPED ? (
                            <>
                              <div>{h?.baseTokenAmount}</div>
                            </>
                          ) : (
                            <div className="text-dark40">--</div>
                          )} */}
                        </div>
                        <div className="col-span-2 text-center">
                          {/* {h.type === PoolType.WITHDRAWN ||
                          h.type === PoolType.SWAPPED ? (
                            <>
                              <div>{h?.targetTokenAmount}</div>
                            </>
                          ) : (
                            <div className="text-dark40">--</div>
                          )} */}
                          {h?.targetTokenAmount ? (
                            <div>{h?.targetTokenAmount.toFixed(3)}</div>
                          ) : (
                            <div className="text-dark40">--</div>
                          )}
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="flex items-center">
                            {dayjs(h.createdAt).format(DATE_TIME_FORMAT)}
                            <a
                              href={`${platformConfig}/tx/${h.transactionId}`}
                              target="_blank"
                              className="ml-2"
                            >
                              <ShareIcon />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          }
          mobileLayout={
            <div className="mt-0">
              {groupHistoryByDate(historiesData).map((rangeBundle) => {
                return (
                  <div className="mb-[20px]">
                    {rangeBundle.data.map((h) => {
                      const poolDoc = h.pool_docs[0];
                      const baseToken =
                        whiteLists[poolDoc.baseTokenAddress] ||
                        findEntityByAddress(poolDoc.baseTokenAddress);
                      const targetToken =
                        whiteLists[poolDoc.targetTokenAddress] ||
                        findEntityByAddress(poolDoc.targetTokenAddress);

                      return (
                        <div className="mb-[20px] !text-[14px]">
                          <div className="flow-root">
                            <p className="text-white text-[14px] normal-text float-left">
                              {dayjs(h.createdAt).format(DATE_TIME_FORMAT)}
                            </p>
                            <div className="text-dark40 flex float-right text-[14px]">
                              #{utilsProvider.makeShort(h.poolId)}
                            </div>
                          </div>
                          <div
                            key={h._id}
                            className="mt-[12px] py-[10px] px-[8px] bg-[#121320] rounded-[12px] text-[14px] normal-text"
                          >
                            <div className="mb-[10px] flow-root">
                              <div className="truncate text-[#99A8C6] float-left">
                                Pair
                              </div>
                              <div className="text-dark40 flex float-right">
                                {baseToken?.symbol}/{targetToken?.symbol}
                                {baseToken?.address && targetToken?.address && (
                                  <a
                                    href={
                                      chainId === ChainId.sol
                                        ? `${RADYUM_EXPLORE}?inputCurrency=${baseToken?.symbol}&outputCurrency=${targetToken?.symbol}`
                                        : `${UNISWAP_EXPLORE}&inputCurrency=${baseToken?.symbol}&outputCurrency=${targetToken?.symbol}`
                                    }
                                    target="_blank"
                                    className="ml-[10px]"
                                  >
                                    <ShareIcon size="20" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="mb-[10px] flow-root">
                              <div className="truncate text-[#99A8C6] float-left">
                                Type
                              </div>
                              <div className="text-dark40 flex float-right">
                                {typeHumanize(h.type)}
                              </div>
                            </div>
                            {h.type === PoolType.WITHDRAWN ||
                            h.type === PoolType.SWAPPED ? (
                              <div className="mb-[10px] flow-root">
                                <div className="truncate text-[#99A8C6] float-left">
                                  Token amount
                                </div>
                                <div className="text-dark40 flex float-right">
                                  {h?.targetTokenAmount}
                                </div>
                              </div>
                            ) : null}
                            {h.type === PoolType.DEPOSITED ||
                            h.type === PoolType.WITHDRAWN ||
                            h.type === PoolType.SWAPPED ? (
                              <div className="mb-[10px] flow-root">
                                <div className="truncate text-[#99A8C6] float-left">
                                  Amount
                                </div>
                                <div className="text-dark40 flex float-right">
                                  {h?.baseTokenAmount}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          }
        />
      ) : (
        <div className="py-[70px]">
          <img
            src="/assets/images/empty-icon.png"
            className="w-[175px] h-[175px] mx-auto"
          />
          <p className="text-[20px] md:text-[16px] mt-[20px] text-dark50 text-center">
            You have no active pocket
          </p>
        </div>
      )}
    </div>
  );
}
