import { PoolType } from "@/src/entities/history.entity";
import { DATE_TIME_FORMAT } from "@/src/utils";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";

export default function TableComponent() {
  const historiesData = useSelector((state: State) => state.histories);

  return (
    <div className="mt-11 text-white max-h-[650px] overflow-y-auto">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="max-w-md pb-4">Pocket</th>
            <th>Token</th>
            <th>Type</th>
            <th>SOL amount</th>
            <th>Token amount</th>
            <th className="max-w-[160px]">Time</th>
          </tr>
        </thead>
        <tbody className="normal-text">
          {historiesData.map((h) => (
            <tr key={h.id} className="">
              <td className="pr-10 py-4">
                <div className="truncate">{h.name}</div>
                <div className="text-dark40">#{h.id}</div>
              </td>
              <td>
                <div>{h.token.name}</div>
                <div className="text-dark40">{h.token.address}</div>
              </td>
              <td>{h.type}</td>
              <td>
                {h.type === PoolType.DEPOSIT ||
                h.type === PoolType.WITHDRAW ||
                h.type === PoolType.BUY ? (
                  <>
                    <div>{h.nativeTokenAmount}</div>
                    <div className="text-dark40">
                      Price at: $ {h.nativeTokenPrice}
                    </div>
                  </>
                ) : (
                  <div className="text-dark40">--</div>
                )}
              </td>
              <td>
                {h.type === PoolType.WITHDRAW || h.type === PoolType.BUY ? (
                  <>
                    <div>{h.tokenAmount}</div>
                    <div className="text-dark40">
                      Price at: $ {h.tokenPrice}
                    </div>
                  </>
                ) : (
                  <div className="text-dark40">--</div>
                )}
              </td>
              <td className="max-w-[160px]">
                {dayjs(h.createdAt).format(DATE_TIME_FORMAT)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
