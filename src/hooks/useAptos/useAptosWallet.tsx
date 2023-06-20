import { createContext, useContext, ReactNode, FC } from "react";
import { useWallet, MartianWalletName } from "@manahippo/aptos-wallet-adapter";

/** @dev Initiize context. */
export const AptosWalletContext = createContext<{
  handleConnect(): void;
}>(null);

/** @dev Expose wallet provider for usage. */
export const AptosWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /** @dev Inject aptos wallet context. */
  const { connect: connectAptos } = useWallet();

  /** @internal @dev The function to open wallet popup for connecting. */
  const handleConnect = () => {
    connectAptos(MartianWalletName);
  };

  return (
    <AptosWalletContext.Provider
      value={{
        handleConnect,
        // createPocket,
        // depositPocket,
        // closePocket,
        // closePositionPocket,
        // pausePocket,
        // withdrawPocket,
        // resumePocket,
        // signer: signer,
        // nativeBalance: parseFloat(nativeBalanceData?.formatted).toFixed(3),
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
