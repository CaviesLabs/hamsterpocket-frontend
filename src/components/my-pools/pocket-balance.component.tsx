import { FC } from "react";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";

export const PocketBalanceComponent: FC = () => {
  const { totalUSD, totalSOL } = usePocketBalance();

  return (
    <div>
      <p className="text-center text-green normal-text text-[20px]">
        {totalSOL.toFixed(2)} SOL
      </p>
      <p className="text-center text-green normal-text text-[16px]">
        ~${totalUSD.toFixed(5)}
      </p>
      <p className="text-center text-dark40 normal-text text-[14px]">
        Est Pocket balance
      </p>
    </div>
  );
};
