import { createContext, useContext, ReactNode, FC } from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bsc, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

/** @dev Initiize context. */
export const WalletKitContext = createContext<any>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletKitProvider: FC<{ children: ReactNode }> = (props) => {
  const customChains = process.env.EVM_CHAIN_ID === "bsc" ? bsc : polygonMumbai;
  const { chains, provider } = configureChains(
    [customChains],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "hamsterpocket",
    projectId: process.env.WALLET_CONNECT_PROJECT_ID,
    chains,
  });

  const wagmiConfig = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WalletKitContext.Provider value={{}}>
      <WagmiConfig client={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          {props.children}
        </RainbowKitProvider>
      </WagmiConfig>
    </WalletKitContext.Provider>
  );
};

/** @dev Use context hook. */
export const useEvmWalletKit = () => {
  const context = useContext(WalletKitContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
