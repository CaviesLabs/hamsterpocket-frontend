import { networkProvider } from "@/src/providers/network.provider";

export const getPrice = function (tokenName: string) {
  return networkProvider.request("/simple/price", {
    baseURL: "https://api.coingecko.com/api/v3",
    method: "GET",
    params: {
      ids: [tokenName],
      vs_currencies: "usd",
    },
  });
};
