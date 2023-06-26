import { createContext, useContext, ReactNode, FC } from "react";
import { useWallet, PontemWalletName } from "@manahippo/aptos-wallet-adapter";

/** @dev Initiize context. */
export const AptosWalletContext = createContext<{
  connect(): void;
  walletAddress: string;
}>(null);

/** @dev Expose wallet provider for usage. */
export const AptosWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /** @dev Inject aptos wallet context. */
  const { connect: connectAptos, account } = useWallet();

  /** @internal @dev The function to open wallet popup for connecting. */
  const handleConnect = () => {
    connectAptos(PontemWalletName);
  };

  console.log(account?.address?.toString());

  return (
    <AptosWalletContext.Provider
      value={{
        connect: handleConnect,
        walletAddress: account?.address?.toString(),
      }}
    >
      {props.children}
    </AptosWalletContext.Provider>
  );
};

/** @dev Use context hook. */
export const useAptosWallet = () => {
  const context = useContext(AptosWalletContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
