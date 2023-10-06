import { FC, useMemo, ReactNode, useContext, createContext } from "react";

import { bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { configureChains, createConfig, WagmiConfig, Chain } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

/** @dev Initialize context. */
export const WalletKitContext = createContext<{ chain: Chain }>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletKitProvider: FC<{ children: ReactNode }> = (props) => {
  const { chainId, platformConfig } = usePlatformConfig();

  /**
   * @dev Define desired chain.
   * @nnotice If platform config is not available, use BSC as default.
   * @notice If platform config is available, generate chain from platform config.
   */
  const desiredChain = useMemo<Chain>(() => {
    if (!platformConfig) return bsc;
    return {
      id: platformConfig.chainId,
      name: platformConfig.chainName,
      network: platformConfig.wagmiKey,
      nativeCurrency: {
        name: platformConfig.nativeToken.name,
        symbol: platformConfig.nativeToken.symbol,
        decimals: platformConfig.nativeToken.decimals,
      },
      rpcUrls: {
        default: {
          http: [platformConfig.rpcUrl],
        },
        public: {
          http: [platformConfig.rpcUrl],
        },
      },
      testnet: false,
    };
  }, [platformConfig]);

  const wagmiConfig = useMemo(() => {
    const { chains, publicClient } = configureChains(
      [desiredChain],
      [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "hamsterpocket",
      projectId: process.env.WALLET_CONNECT_PROJECT_ID,
      chains,
    });

    return createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });
  }, [chainId, platformConfig, desiredChain]);

  return (
    <WalletKitContext.Provider
      value={{
        chain: desiredChain,
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={[desiredChain]}>
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
