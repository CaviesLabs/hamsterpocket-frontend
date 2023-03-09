import { MdOpenInNew } from "react-icons/all";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";
import { utilsProvider } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export default function TableComponent() {
  const portfoliosData = useSelector((state: State) => state.portfolios);
  const { whiteLists, convertDecimalAmount } = useWhiteList();

  return (
    <div className="mt-11 text-white max-h-[650px] overflow-y-auto">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="pb-4">Token</th>
            <th className="pb-4 text-center">Address</th>
            <th className="pb-4 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="normal-text">
          {portfoliosData.map((h) => (
            <tr key={h.tokenName} className="">
              <td className="pr-10 py-4 flex">
                <div className="bg-gray-600 p-2 rounded-full">
                  <img
                    src={whiteLists[h.tokenAddress]?.image}
                    className="max-w-[32px] rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="truncate">{h.tokenSymbol}</div>
                  <div className="text-dark40">{h.tokenName}</div>
                </div>
              </td>
              <td>
                <a href="#" className="flex justify-center items-center">
                  <div className="border border-gray-700 rounded text-center py-1 w-[160px]">
                    {utilsProvider.makeShort(h.tokenAddress)}
                  </div>
                  <div className="ml-2">
                    <MdOpenInNew className="text-gray-500 text-xl" />
                  </div>
                </a>
              </td>
              <td className="text-right">
                <div>
                  {convertDecimalAmount(h.tokenAddress, h.total).toFixed(4)}
                </div>
                <div className="text-dark40">
                  ~ ${convertDecimalAmount(h.tokenAddress, h.value).toFixed(2)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
