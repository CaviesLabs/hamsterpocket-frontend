import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { WSOL_ADDRESS } from "@/src/utils";
import State from "@/src/redux/entities/state";

export const usePocketBalance = (): {
  totalUSD: number;
  totalSOL: number;
  getTokenBlances(): { token: string; totalValue: number; percent: number }[];
} => {
  /** @dev Inject value from saga. */
  const { portfolioStatistic: statisticData, portfolios } = useSelector(
    (state: State) => state
  );

  const [totalUSD, setTotalUSD] = useState(0);
  const [totalSOL, setTotalSOL] = useState(0);

  /** @dev Innject whitelist to get info. */
  const { whiteLists, findEntityByAddress } = useWhiteList();

  /** @dev Handle total balance in USD value. */
  const handleBalance = useCallback(() => {
    setTotalUSD(() => {
      const arr = portfolios.map((token) => {
        /** @dev Return price of portfolio token in USD. */
        return token?.usdValue || 0;
      });
      return arr.length ? arr.reduce((prev, cur) => cur + prev) : 0;
    });
  }, [statisticData, portfolios, whiteLists]);

  /** @dev The function render dicnationy of tokens in all pockets and these blance. */
  const getTokenBlances = useCallback(() => {
    return portfolios.map((token) => {
      /** @dev Attract token info. */
      const tokenInfo =
        whiteLists[token.tokenAddress] ||
        findEntityByAddress(token.tokenAddress);

      return {
        /** @dev Token symbol. */
        token: tokenInfo?.symbol,

        /** @dev Price of portfolio token in USD. */
        totalValue: token?.usdValue,

        /** @dev Percent of price in total pool. */
        percent: token?.usdValue / totalUSD,
      };
    });
  }, [statisticData, portfolios, whiteLists, totalUSD]);

  useEffect(() => handleBalance(), [statisticData, portfolios, whiteLists]);
  useEffect(() => {
    setTotalSOL(() => {
      const solPrice = whiteLists[WSOL_ADDRESS]?.estimatedValue || 1;
      return totalUSD / solPrice;
    });
  }, [totalUSD, statisticData]);

  return {
    totalUSD,
    totalSOL,
    getTokenBlances,
  };
};
