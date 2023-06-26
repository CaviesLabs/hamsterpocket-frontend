import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  FC,
} from "react";
import { AppWalletContextState } from "./types";
import { useConnectedWallet as useSolWallet } from "@saberhq/use-solana";
import { useAccount } from "wagmi";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId, chainInfos } from "@/src/entities/platform-config.entity";
import { useWallet as useAptosWallet } from "@manahippo/aptos-wallet-adapter";

/** @dev Initiize context. */
export const AppWalletContext = createContext<AppWalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const AppWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /**
   * @dev Provider states.
   */
  const [walletAddress, setWalletAddress] = useState("");
  const { switchChainId, chainId } = usePlatformConfig();

  /**
   * @dev Inject context of solana wallet.
   */
  const solWallet = useSolWallet();

  /**
   * @dev Inject context of eth wallet.
   */
  const ethWallet = useAccount();

  /**
   * @dev Inject context of aptos wallet.
   */
  const aptosWallet = useAptosWallet();

  /**
   * @dev Watch changes in solana wallet and eth wallet.
   */
  useEffect(() => {
    (async () => {
      if (solWallet) {
        setWalletAddress(solWallet?.publicKey?.toString());
        if (chainId !== ChainId.sol) {
          switchChainId(ChainId.sol);
        }
      } else if (ethWallet?.address) {
        setWalletAddress(ethWallet?.address?.toString());

        /**
         * @dev This fill redirect to correct chain which connected before.
         */
        const connectedChainId = await ethWallet?.connector?.getChainId();
        const targetChainId = Object.keys(chainInfos).find(
          (key: string) => connectedChainId === (chainInfos as any)?.[key]
        );

        /**
         * @dev If current chain is not connected chain, will redirect to.
         */
        if (targetChainId && chainId !== targetChainId) {
          switchChainId(targetChainId);
        }
      } else if (aptosWallet.account) {
        setWalletAddress(aptosWallet.account?.address?.toString());
      }

      if (!solWallet && !ethWallet?.address && !aptosWallet?.account) {
        setWalletAddress("");
      }
    })();
  }, [solWallet, ethWallet, chainId]);

  return (
    <AppWalletContext.Provider value={{ walletAddress }}>
      {props.children}
    </AppWalletContext.Provider>
  );
};

/** @dev Use context hook. */
export const useAppWallet = () => {
  const context = useContext(AppWalletContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
