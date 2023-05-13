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

/** @dev Initiize context. */
export const AppWalletContext = createContext<AppWalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const AppWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /**
   * @dev Provider states.
   */
  const [chain, setChain] = useState<"SOL" | "ETH">();
  const [walletAddress, setWalletAddress] = useState("");

  /**
   * @dev Inject context of solana wallet.
   */
  const solWallet = useSolWallet();

  /**
   * @dev Inject context of eth wallet.
   */
  const ethWallet = useAccount();

  /**
   * @dev Watch changes in solana wallet and eth wallet.
   */
  useEffect(() => {
    if (solWallet) {
      setChain("SOL");
      setWalletAddress(solWallet?.publicKey?.toString());
    } else if (ethWallet?.address) {
      setChain("ETH");
      setWalletAddress(ethWallet?.address?.toString());
    }

    if (!solWallet && !ethWallet?.address) {
      setChain(null);
      setWalletAddress("");
    }
  }, [solWallet, ethWallet]);

  return (
    <AppWalletContext.Provider value={{ chain, walletAddress }}>
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
