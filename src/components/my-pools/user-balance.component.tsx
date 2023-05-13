import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@/src/hooks/useWallet";
import { FC, useEffect, useState } from "react";
import { getPrice } from "@/src/services/coingecko";

export const UserBalanceComponent: FC = () => {
  const wallet = useWallet();

  /**
   * @desc fetch token price
   * store that value into state
   */
  const [price, setPrice] = useState(0);
  useEffect(() => {
    getPrice("solana").then((resp: any) => {
      setPrice(resp?.solana.usd);
    });
  }, []);

  return (
    <div>
      <p className="text-center text-green normal-text text-[16px] md:text-[20px]">
        {(wallet.solBalance / LAMPORTS_PER_SOL)?.toFixed(2)} SOL
      </p>
      <p className="text-center text-green normal-text text-[14px] md:text-[16px]">
        ~$
        {(price * (wallet.solBalance / LAMPORTS_PER_SOL))?.toFixed(2)}
      </p>
      <p className="text-center text-dark40 normal-text text-[14px]">
        Wallet Balance
      </p>
    </div>
  );
};
