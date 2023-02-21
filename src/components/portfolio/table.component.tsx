import { MdOpenInNew } from "react-icons/all";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";

export default function TableComponent() {
  const portfoliosData = useSelector((state: State) => state.portfolios);

  return (
    <div className="mt-11 text-white max-h-[650px] overflow-y-auto">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="pb-4">Token</th>
            <th className="pb-4">Address</th>
            <th className="pb-4">Total</th>
          </tr>
        </thead>
        <tbody className="normal-text">
          {portfoliosData.map((h) => (
            <tr key={h.id} className="">
              <td className="pr-10 py-4 flex">
                <div className="bg-gray-600 p-2 rounded-full">
                  <img
                    src={h.token.image}
                    className="max-w-[32px] rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="truncate">{h.token.name}</div>
                  <div className="text-dark40">{h.token.fullname}</div>
                </div>
              </td>
              <td>
                <a href="#" className="flex items-center">
                  <div className="border border-gray-700 rounded text-center py-1 w-[160px]">
                    {h.token.address}
                  </div>
                  <div className="ml-2">
                    <MdOpenInNew className="text-gray-500 text-xl" />
                  </div>
                </a>
              </td>
              <td>
                <div>{h.tokenAmount}</div>
                <div className="text-dark40">~ $ {h.tokenPrice}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
