import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  FC,
  useMemo,
} from "react";
import { useAccount } from "wagmi";
import { AppWalletContextState } from "./types";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { useConnectedWallet as useSolWallet } from "@saberhq/use-solana";
import { useWallet as usePontem } from "@pontem/aptos-wallet-adapter";

import { useWallet } from "@/src/hooks/useWallet";
import { useAptosWallet } from "@/src/hooks/useAptos";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";

/** @dev Initialize context. */
export const AppWalletContext = createContext<AppWalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const AppWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /**
   * @dev Provider states.
   */
  const [calledPush, setCalledPush] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { switchChainId, chainId, chainInfos } = usePlatformConfig();

  const { solBalance } = useWallet();
  const { nativeBalance: evmBalance } = useEvmWallet();
  const { balance: aptosBalance } = useAptosWallet();

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
  const aptosWallet = usePontem();

  /**
   * @dev Get balance base on chain id.
   */
  const balance = useMemo(() => {
    if (chainId === ChainId.sol) {
      return solBalance;
    } else if (chainId.includes("aptos")) {
      return aptosBalance;
    } else {
      return evmBalance;
    }
  }, [chainId, solBalance, evmBalance, aptosBalance]);

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
    <AppWalletContext.Provider value={{ walletAddress, balance }}>
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
