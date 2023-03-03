import { coingeckoProvider } from "@/src/providers/coingecko.provider";

export const getPrice = function (tokenName: string) {
  return coingeckoProvider.request("/simple/price", {
    method: "GET",
    params: {
      ids: [tokenName],
      vs_currencies: "usd",
    },
  });
};
