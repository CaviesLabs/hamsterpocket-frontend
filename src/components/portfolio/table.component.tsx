import { PortfolioDto } from "@/src/components/portfolio/types";
import { MdOpenInNew } from "react-icons/all";

export default function TableComponent() {
  const historiesData: PortfolioDto[] = [
    {
      id: "1",
      token: {
        name: "RAY",
        fullname: "Raydium",
        address: "NFTUk...Mb7Nk",
        image:
          "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
      },
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
    },
    {
      id: "2",
      token: {
        name: "ETH",
        fullname: "Etherium",
        address: "NFTUk...Mb7Nk",
        image:
          "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/256/Ethereum-icon.png",
      },
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
    },
    {
      id: "3",
      token: {
        name: "ENS",
        fullname: "Ethereum Name Service",
        address: "NFTUk...Mb7Nk",
        image:
          "https://img.freepik.com/premium-vector/ens-ethereum-name-service-token-symbol-cryptocurrency-logo-circle-coin-icon-isolated-white-background_337410-1834.jpg",
      },
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
    },
    {
      id: "4",
      token: {
        name: "BNB",
        fullname: "Binance",
        address: "NFTUk...Mb7Nk",
        image:
          "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Binance-Coin-BNB-icon.png",
      },
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
    },
    {
      id: "5",
      token: {
        name: "RAY",
        fullname: "Raydium",
        address: "NFTUk...Mb7Nk",
        image:
          "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
      },
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
    },
    {
      id: "1",
      token: {
        name: "RAY",
        fullname: "Raydium",
        address: "NFTUk...Mb7Nk",
        image:
          "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
      },
      tokenAmount: 3293482.0,
      tokenPrice: 0.0000012,
    },
  ];

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
          {historiesData.map((h) => (
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
