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
  SOL_EXPLORE,
  MUMBAI_EXPLORE,
  BSC_EXPLORE,
} from "@/src/utils";
import { useAppWallet } from "@/src/hooks/useAppWallet";

export default function TableComponent() {
  const { whiteLists, convertDecimalAmount, findEntityByAddress } =
    useWhiteList();
  const { chain } = useAppWallet();
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
    <div className="mt-11 text-white md:max-h-[650px] md:overflow-y-auto">
      {historiesData.length ? (
        <LayoutWrapper
          layout={
            <>
              <table className="table-fixed w-full mobile:!hidden">
                <thead>
                  <tr>
                    <th className="max-w-xl pb-4 mobile:text-[12px]">Pocket</th>
                    <th className="mobile:text-[12px]">Pair</th>
                    <th className="mobile:text-[12px]">Type</th>
                    <th className="mobile:text-[12px]">Base amount</th>
                    <th className="mobile:text-[12px]">Target amount</th>
                    <th className="max-w-[160px] mobile:text-[12px]">Time</th>
                  </tr>
                </thead>
                <tbody className="normal-text">
                  {historiesData.map((h) => {
                    const poolDoc = h.pool_docs[0];
                    const baseToken =
                      whiteLists[poolDoc.baseTokenAddress] ||
                      findEntityByAddress(poolDoc.baseTokenAddress);
                    const targetToken =
                      whiteLists[poolDoc.targetTokenAddress] ||
                      findEntityByAddress(poolDoc.targetTokenAddress);

                    return (
                      <tr key={h._id} className="">
                        <td className="pr-10 py-4">
                          <div className="truncate">{poolDoc.name}</div>
                          <div className="text-dark40 flex">
                            #{utilsProvider.makeShort(h.poolId)}
                            <a
                              href={
                                chain === "SOL"
                                  ? `${SOL_EXPLORE}/account/${poolDoc.address}`
                                  : process.env.EVM_CHAIN_ID === "matic"
                                  ? `${MUMBAI_EXPLORE}/address/${poolDoc.address}`
                                  : `${BSC_EXPLORE}/address/${poolDoc.address}`
                              }
                              target="_blank"
                              className="ml-2"
                            >
                              <ShareIcon />
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="flex">
                            {baseToken?.symbol}/{targetToken?.symbol}
                            {baseToken?.address && targetToken?.address && (
                              <a
                                href={`https://raydium.io/swap?inputCurrency=${baseToken.address}&outputCurrency=${targetToken.address}`}
                                target="_blank"
                                className="ml-[10px]"
                              >
                                <ShareIcon />
                              </a>
                            )}
                          </div>
                        </td>
                        <td>{typeHumanize(h.type)}</td>
                        <td>
                          {h.type === PoolType.DEPOSITED ||
                          h.type === PoolType.WITHDRAWN ||
                          h.type === PoolType.SWAPPED ? (
                            <>
                              <div>{h?.baseTokenAmount}</div>
                            </>
                          ) : (
                            <div className="text-dark40">--</div>
                          )}
                        </td>
                        <td>
                          {h.type === PoolType.WITHDRAWN ||
                          h.type === PoolType.SWAPPED ? (
                            <>
                              <div>{h?.targetTokenAmount}</div>
                            </>
                          ) : (
                            <div className="text-dark40">--</div>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center">
                            {dayjs(h.createdAt).format(DATE_TIME_FORMAT)}
                            <a
                              href={`https://solscan.io/tx/${h.transactionId}`}
                              target="_blank"
                              className="ml-2"
                            >
                              <ShareIcon />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="md:hidden rounded-[10px] px-[8px] py-[20px] border-solid border-[1px] border-dark50">
                {historiesData.map((h) => {
                  const poolDoc = h.pool_docs[0];
                  const baseToken = whiteLists[poolDoc.baseTokenAddress];
                  const targetToken = whiteLists[poolDoc.targetTokenAddress];

                  return (
                    <div key={`m-${h._id}`} className="mbs-[20px] pb-[20px]">
                      <div className="flow-root text-[14px]">
                        <div className="truncate float-left">
                          {poolDoc.name}
                        </div>
                        <div className="text-dark40 flex float-right relative top-[2px]">
                          #{utilsProvider.makeShort(h.poolId)}
                          <a
                            href={`https://solscan.io/account/${poolDoc.address}`}
                            target="_blank"
                            className="ml-2"
                          >
                            <ShareIcon size="20" />
                          </a>
                        </div>
                      </div>
                      <div className="flow-root mt-[16px]">
                        <div className="float-left text-white text-[14px] regular-text">
                          Pair
                        </div>
                        <div className="flex float-right top-[3px] text-dark50 text-[14px]">
                          {baseToken?.symbol}/{targetToken?.symbol}
                          {baseToken?.address && targetToken?.address && (
                            <a
                              href={`https://raydium.io/swap?inputCurrency=${baseToken.address}&outputCurrency=${targetToken.address}`}
                              target="_blank"
                              className="ml-[10px]"
                            >
                              <ShareIcon size="20" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flow-root mt-[16px]">
                        <div className="float-left text-[14px] regular-text">
                          Type
                        </div>
                        <div className="float-right text-[14px] text-dark50">
                          {typeHumanize(h.type)}
                        </div>
                      </div>
                      <div className="flow-root mt-[16px]">
                        <div className="float-left text-[14px] regular-text">
                          Base Amount
                        </div>
                        <div className="float-right text-[14px] text-dark50">
                          {h.type === PoolType.DEPOSITED ||
                          h.type === PoolType.WITHDRAWN ||
                          h.type === PoolType.SWAPPED ? (
                            <>
                              <div>
                                {convertDecimalAmount(
                                  baseToken?.address,
                                  h.baseTokenAmount
                                )}
                              </div>
                              {/*<div className="text-dark40">*/}
                              {/*  Price at: $ {h.nativeTokenPrice}*/}
                              {/*</div>*/}
                            </>
                          ) : (
                            <div className="text-dark40">--</div>
                          )}
                        </div>
                      </div>
                      <div className="flow-root mt-[16px]">
                        <div className="float-left text-[14px] regular-text">
                          Token Amount
                        </div>
                        <div className="float-right text-[14px] text-dark50">
                          {h.type === PoolType.WITHDRAWN ||
                          h.type === PoolType.SWAPPED ? (
                            <>
                              <div>
                                {convertDecimalAmount(
                                  targetToken?.address,
                                  h.targetTokenAmount
                                )}
                              </div>
                              {/*<div className="text-dark40">*/}
                              {/*  Price at: $ {h.tokenPrice}*/}
                              {/*</div>*/}
                            </>
                          ) : (
                            <div className="text-dark40">--</div>
                          )}
                        </div>
                      </div>
                      <div className="flow-root mt-[16px]">
                        <div className="float-left text-[14px] regular-text">
                          Time
                        </div>
                        <div className="float-right text-[14px] text-dark50">
                          <div className="flex items-center">
                            {dayjs(h.createdAt).format(DATE_TIME_FORMAT)}
                            <a
                              href={`https://solscan.io/tx/${h.transactionId}`}
                              target="_blank"
                              className="ml-2"
                            >
                              <ShareIcon size="20" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="h-[1px] w-full bg-dark50 lg:w-1/3 mt-[20px]"></div>
                    </div>
                  );
                })}
              </div>
            </>
          }
          mobileLayout={
            <div className="mt-0">
              {groupHistoryByDate(historiesData).map((rangeBundle) => {
                return (
                  <div className="mb-[20px]">
                    <p className="text-dark50 text-[12px] normal-text">
                      {rangeBundle.date}
                    </p>
                    {rangeBundle.data.map((h) => {
                      const poolDoc = h.pool_docs[0];
                      const baseToken = whiteLists[poolDoc.baseTokenAddress];
                      const targetToken =
                        whiteLists[poolDoc.targetTokenAddress];

                      return (
                        <div
                          key={h._id}
                          className="mt-[12px] py-[10px] px-[8px] bg-[#121320] rounded-[12px] text-[14px] normal-text"
                        >
                          <div className="mb-[6px] flow-root">
                            <div className="truncate text-[#99A8C6] float-left">
                              {poolDoc.name}
                            </div>
                            <div className="text-dark40 flex float-right">
                              #{utilsProvider.makeShort(h.poolId)}
                              <a
                                href={`https://solscan.io/account/${poolDoc.address}`}
                                target="_blank"
                                className="ml-2"
                              >
                                <ShareIcon />
                              </a>
                            </div>
                          </div>
                          <div className="mb-[6px] flow-root">
                            <div className="truncate text-[#99A8C6] float-left">
                              Pair
                            </div>
                            <div className="text-dark40 flex float-right">
                              {baseToken?.symbol}/{targetToken?.symbol}
                              {baseToken?.address && targetToken?.address && (
                                <a
                                  href={`https://raydium.io/swap?inputCurrency=${baseToken.address}&outputCurrency=${targetToken.address}`}
                                  target="_blank"
                                  className="ml-[10px]"
                                >
                                  <ShareIcon />
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="mb-[6px] flow-root">
                            <div className="truncate text-[#99A8C6] float-left"></div>
                            <div className="text-dark40 flex float-right">
                              <div
                                className="py-[6px] px-[10px] text-green text-[10px] text-center normal-text rounded-[6px]"
                                style={{
                                  backgroundColor: "rgba(74, 222, 128, 0.12)",
                                }}
                              >
                                Completed
                              </div>
                            </div>
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
