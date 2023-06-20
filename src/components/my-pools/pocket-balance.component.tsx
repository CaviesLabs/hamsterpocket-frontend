import { FC } from "react";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";
import { useWhiteList } from "@/src/hooks/useWhitelist";

export const PocketBalanceComponent: FC = () => {
  const { totalUSD, totalSOL } = usePocketBalance();
  const { analyzeDecimals } = useWhiteList();

  return (
    <div>
      <p className="text-center text-green normal-text text-[16px] md:text-[20px]">
        {analyzeDecimals(totalSOL)} SOL
      </p>
      <p className="text-center text-green normal-text text-[14px] md:text-[16px]">
        ~${analyzeDecimals(totalUSD)}
      </p>
      <p className="text-center text-dark40 normal-text text-[14px] md:text-[16px]">
        Est Pocket balance
      </p>
    </div>
  );
};
