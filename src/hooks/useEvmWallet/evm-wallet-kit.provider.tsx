import {
  createContext,
  useContext,
  ReactNode,
  FC,
  useState,
  useMemo,
} from "react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  bsc,
  polygonMumbai,
  okc,
  xdc,
  gnosis,
  avalanche,
  // Chain as WagmiChain,
} from "wagmi/chains";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

/** @dev Initiize context. */
export const WalletKitContext = createContext<any>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletKitProvider: FC<{ children: ReactNode }> = (props) => {
  const { chainId, platformConfig } = usePlatformConfig();
  const [wagmiChains, setWagmiChains] = useState<any[]>([]);

  const initClient = useMemo(() => {
    let customChains;

    /** @dev Desired chain config based on chainId. */
    if (chainId === ChainId.okt) {
      customChains = okc;
    } else if (chainId === ChainId.polygon_mumbai) {
      customChains = polygonMumbai;
    } else if (chainId === ChainId.xdc) {
      customChains = xdc;
    } else if (chainId === ChainId.gnosis) {
      customChains = gnosis;
    } else if (chainId === ChainId.avaxc) {
      customChains = avalanche;
    } else {
      customChains = bsc;
    }

    // const chainConfig: WagmiChain = {
    //   id: platformConfig.chainId,
    //   name: platformConfig.chainName,
    //   network: platformConfig.chainName,
    //   nativeCurrency: NativeCurrency;
    //   /** Collection of RPC endpoints */
    //   rpcUrls: {
    //       [key: string]: RpcUrls;
    //       default: RpcUrls;
    //       public: RpcUrls;
    //   };
    // };

    const { chains, provider } = configureChains(
      [customChains],
      [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "hamsterpocket",
      projectId: process.env.WALLET_CONNECT_PROJECT_ID,
      chains,
    });

    /** @dev Update config here */
    setWagmiChains(chains);
    return createClient({
      autoConnect: true,
      connectors,
      provider,
    });
  }, [chainId, platformConfig]);

  return (
    <WalletKitContext.Provider value={{}}>
      <WagmiConfig client={initClient}>
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
