import { HistoryDto, PoolType } from "@/src/components/history/types";
import { DATE_TIME_FORMAT } from "@/src/utils";
import dayjs from "dayjs";

export default function TableComponent() {
  const historiesData: HistoryDto[] = [
    {
      id: "199499",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ETH",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.CREATE,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199500",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.PAUSE,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199501",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.CONTINUE,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199502",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.DEPOSIT,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199503",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.BUY,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199504",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.CLOSE,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199505",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.WITHDRAW,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
    {
      id: "199506",
      name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
      token: {
        name: "ENS",
        address: "NFTUk...Mb7Nk",
      },
      type: PoolType.BUY,
      nativeTokenAmount: 100.32,
      nativeTokenPrice: 20.31,
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
      createdAt: new Date(
        "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
      ),
    },
  ];

  return (
    <div className="mt-11 text-white max-h-[650px] overflow-y-auto">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="max-w-md pb-4">Poket</th>
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
