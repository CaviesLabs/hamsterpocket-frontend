import { createContext, useContext, ReactNode, FC } from "react";
import {
  MartianWalletAdapter,
  WalletProvider,
} from "@manahippo/aptos-wallet-adapter";

const aptosWalletAdapters = [new MartianWalletAdapter()];

/** @dev Initiize context. */
export const AptosWalletKitContext = createContext<any>(null);

/** @dev Expose wallet provider for usage. */
export const AptosWalletKitProvider: FC<{ children: ReactNode }> = (props) => {
  return (
    <AptosWalletKitContext.Provider value={{}}>
      <WalletProvider
        wallets={aptosWalletAdapters}
        onError={(error: Error) => {
          console.log("Error when connect aptos chain", error);
        }}
      >
        {props.children}
      </WalletProvider>
    </AptosWalletKitContext.Provider>
  );
};

/** @dev Use context hook. */
export const useAptosWalletKit = () => {
  const context = useContext(AptosWalletKitContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
