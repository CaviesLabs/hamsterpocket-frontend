import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { WSOL_ADDRESS } from "@/src/utils";
import State from "@/src/redux/entities/state";

export const usePocketBalance = (): { totalUSD: number; totalSOL: number } => {
  /** @dev Inject value from saga. */
  const { portfolioStatistic: statisticData, portfolios } = useSelector(
    (state: State) => state
  );

  const [totalUSD, setTotalUSD] = useState(0);
  const [totalSOL, setTotalSOL] = useState(0);

  /** @dev Innject whitelist to get info. */
  const { whiteLists } = useWhiteList();

  const handleBalance = useCallback(() => {
    setTotalUSD(() => {
      const arr = portfolios.map((token) => {
        const humanValue =
          token.total / Math.pow(10, whiteLists[token.tokenAddress]?.decimals);
        return humanValue * whiteLists[token.tokenAddress]?.estimatedValue || 0;
      });
      return arr.length ? arr.reduce((prev, cur) => cur + prev) : 0;
    });
  }, [statisticData, portfolios, whiteLists]);

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
  };
};