import { FC } from "react";
import { useSelector } from "react-redux";
import State from "@/src/redux/entities/state";

export const PocketBalanceComponent: FC = () => {
  const statisticData = useSelector((state: State) => state.portfolioStatistic);

  return (
    <div>
      <p className="text-center text-green normal-text text-[20px]">
        {statisticData?.totalPoolsBalance || 0} SOL
      </p>
      <p className="text-center text-green normal-text text-[16px]">
        ~${statisticData?.totalPoolsBalanceValue || 0}
      </p>
      <p className="text-center text-dark40 normal-text text-[14px]">
        Est Pocket balance
      </p>
    </div>
  );
};
