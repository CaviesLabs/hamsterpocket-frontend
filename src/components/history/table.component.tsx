import { PoolType } from "@/src/entities/history.entity";
import { DATE_TIME_FORMAT, utilsProvider } from "@/src/utils";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export default function TableComponent() {
  const { whiteLists, convertDecimalAmount } = useWhiteList();
  const historiesData = useSelector((state: State) => state.histories);

  const typeHumanize = (raw: PoolType) => {
    switch (raw) {
      case PoolType.CREATE:
        return "CREATE";
      case PoolType.PAUSE:
        return "PAUSE";
      case PoolType.CONTINUE:
        return "CONTINUE";
      case PoolType.DEPOSIT:
        return "DEPOSIT";
      case PoolType.CLOSE:
        return "CLOSE";
      case PoolType.WITHDRAW:
        return "WITHDRAW";
      case PoolType.SWAPPED:
        return "SWAPPED";
      case PoolType.SKIPPED:
        return "SKIPPED";
      case PoolType.VAULT_CREATED:
        return "VAULT CREATED";
      case PoolType.POCKET_CONFIG_UPDATED:
        return "POCKET CONFIG UPDATED";
      default:
        return raw;
    }
  };

  return (
    <div className="mt-11 text-white max-h-[650px] overflow-y-auto">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="max-w-xl pb-4">Pocket</th>
            <th>Token</th>
            <th>Type</th>
            <th>Base amount</th>
            <th>Target amount</th>
            <th className="max-w-[160px]">Time</th>
          </tr>
        </thead>
        <tbody className="normal-text">
          {historiesData.map((h) => {
            const poolDoc = h.pool_docs[0];
            const baseToken = whiteLists[poolDoc.baseTokenAddress];
            const targetToken = whiteLists[poolDoc.targetTokenAddress];

            return (
              <tr key={h.poolId} className="">
                <td className="pr-10 py-4">
                  <div className="truncate">{poolDoc.name}</div>
                  <div className="text-dark40">
                    #{utilsProvider.makeShort(h.poolId)}
                  </div>
                </td>
                <td>
                  <div>{baseToken?.symbol}</div>
                  <div className="text-dark40">
                    {utilsProvider.makeShort(baseToken?.address)}
                  </div>
                </td>
                <td>{typeHumanize(h.type)}</td>
                <td>
                  {h.type === PoolType.DEPOSIT ||
                  h.type === PoolType.WITHDRAW ||
                  h.type === PoolType.SWAPPED ? (
                    <>
                      <div>
                        {convertDecimalAmount(
                          baseToken?.address,
                          poolDoc.currentSpentBaseToken
                        )}
                      </div>
                      {/*<div className="text-dark40">*/}
                      {/*  Price at: $ {h.nativeTokenPrice}*/}
                      {/*</div>*/}
                    </>
                  ) : (
                    <div className="text-dark40">--</div>
                  )}
                </td>
                <td>
                  {h.type === PoolType.WITHDRAW ||
                  h.type === PoolType.SWAPPED ? (
                    <>
                      <div>
                        {convertDecimalAmount(
                          targetToken?.address,
                          poolDoc.currentReceivedTargetToken
                        )}
                      </div>
                      {/*<div className="text-dark40">*/}
                      {/*  Price at: $ {h.tokenPrice}*/}
                      {/*</div>*/}
                    </>
                  ) : (
                    <div className="text-dark40">--</div>
                  )}
                </td>
                <td className="max-w-[160px]">
                  {dayjs(h.createdAt).format(DATE_TIME_FORMAT)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
