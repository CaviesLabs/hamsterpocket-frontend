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
import { useWallet as useAptosWallet } from "@pontem/aptos-wallet-adapter";
import { ChainId } from "@/src/entities/platform-config.entity";

/** @dev Initiize context. */
export const AppWalletContext = createContext<AppWalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const AppWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /**
   * @dev Provider states.
   */
  const [walletAddress, setWalletAddress] = useState("");
  const [calledPush, setCalledPush] = useState(false);
  const { switchChainId, chainId, chainInfos } = usePlatformConfig();

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
      if (!solWallet && !ethWallet?.address && !aptosWallet?.account) {
        setWalletAddress("");
        return;
      }

      if (chainId === ChainId.sol) {
        setWalletAddress(solWallet?.publicKey?.toString() || "");
      } else if (chainId.includes("aptos")) {
        setWalletAddress(aptosWallet.account?.address?.toString() || "");
      } else {
        try {
          setWalletAddress(ethWallet?.address?.toString() || "");

          /** @dev This fill redirect to correct chain which connected before. */
          const connectedChainId = await ethWallet?.connector?.getChainId();

          /** @notice This fill redirect to correct chain which connected. */
          if (!connectedChainId) {
            return;
          }

          const targetChainId = Object.keys(chainInfos).find(
            (key: string) => connectedChainId === chainInfos[key]?.chainId
          );

          /**
           * @dev If current chain is not connected chain, will redirect to.
           */
          if (targetChainId && chainId !== targetChainId && !calledPush) {
            switchChainId(targetChainId);
            setCalledPush(true);
          }
        } catch (e) {}
      }
    })();
  }, [solWallet, ethWallet, chainId, chainInfos]);

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
