import { FC, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import State from "@/src/redux/entities/state";

export const PocketBalanceComponent: FC = () => {
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
      return portfolios
        .map((token) => {
          const humanValue =
            token.total /
            Math.pow(10, whiteLists[token.tokenAddress]?.decimals);
          return (
            humanValue *
              statisticData.topTokens.find(
                (item) => item.symbol === whiteLists[token.tokenAddress]?.symbol
              )?.price || 0
          );
        })
        .reduce((prev, cur) => cur + prev);
    });
  }, [statisticData, portfolios, whiteLists]);

  useEffect(() => handleBalance(), [statisticData, portfolios, whiteLists]);
  useEffect(() => {
    setTotalSOL(() => {
      return (
        totalUSD /
          statisticData.topTokens?.find((item) => item.symbol === "SOL")
            ?.price || 1
      );
    });
  }, [totalUSD, statisticData]);

  return (
    <div>
      <p className="text-center text-green normal-text text-[20px]">
        {totalSOL} SOL
      </p>
      <p className="text-center text-green normal-text text-[16px]">
        ~${totalUSD}
      </p>
      <p className="text-center text-dark40 normal-text text-[14px]">
        Est Pocket balance
      </p>
    </div>
  );
};
