import {
  FC,
  useMemo,
  useState,
  ReactNode,
  useContext,
  createContext,
} from "react";

import { bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { WagmiChainConfigs } from "./wagmi-configs";

/** @dev Initiize context. */
export const WalletKitContext = createContext<any>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletKitProvider: FC<{ children: ReactNode }> = (props) => {
  const { chainId, platformConfig } = usePlatformConfig();
  const [wagmiChains, setWagmiChains] = useState<any[]>([]);

  const initClient = useMemo(() => {
    const customChains = WagmiChainConfigs.find((config) => {
      if (platformConfig?.wagmiKey === "polygonMumbai") {
        return config.network === "maticmum";
      }
      return config.network === platformConfig?.wagmiKey;
    });

    const { chains, publicClient } = configureChains(
      [customChains || bsc],
      [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "hamsterpocket",
      projectId: process.env.WALLET_CONNECT_PROJECT_ID,
      chains,
    });

    /** @dev Update config here */
    setWagmiChains(chains);
    return createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });
  }, [chainId, platformConfig]);

  return (
    <WalletKitContext.Provider value={{}}>
      <WagmiConfig config={initClient}>
        <RainbowKitProvider chains={wagmiChains}>
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
