import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
  FC,
} from "react";
import { useSolana as useSaberhq } from "@saberhq/use-solana";
import {
  useWallet as useSolana,
  useConnection,
} from "@solana/wallet-adapter-react";
import web3 from "@solana/web3.js";
import { useConnectedWallet } from "@saberhq/use-solana";
import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
import { PocketProgramProvider } from "@/src/providers/program/pocket-program.provider";
import { ProgramService, authService } from "@/src/services";
import { getWalletName } from "./utils";
// import { setProfile } from "@/src/redux/actions/hamster-profile/profile.action";
// import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { WalletContextState } from "./types";

/** @dev Initiize context. */
export const WalletContext = createContext<WalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const WalletProvider: FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  /** @dev Get @var {walletProviderInfo} from @var {GokkiKit}. */
  const { walletProviderInfo } = useSaberhq();

  /** @dev Import providers to use from solana. */
  const solanaWallet = useSolana();
  const walletConnection = useConnection();
  // const dispatch = useDispatch();

  /** @dev Import wallet from Gokki library. */
  const wallet = useConnectedWallet();

  /** @dev Program service */
  const [programService, initProgram] = useState<ProgramService>(null);
  const [solBalance, setSolBalance] = useState(0);

  /**
   * @dev The function to sign message in Solana network.
   * */
  const signMessage = useCallback(
    async (message: string) => {
      /**
       * @dev Force to connect first.
       */
      await solanaWallet?.wallet?.adapter?.connect();

      /**
       * @dev Encode message to @var {Uint8Array}.
       */
      const data = new TextEncoder().encode(message);

      /**
       * @dev Call function to sign message from solana adapter.
       */
      return await (
        solanaWallet.wallet.adapter as MessageSignerWalletAdapter
      ).signMessage(data);
    },
    [walletProviderInfo, solanaWallet.wallet]
  );

  /**
   * @dev Encode message to @var {Uint8Array}.
   *      Step 1. Disconnect wallet.
   *      Step 2. Logout user.
   */
  const disconnect = useCallback(async () => {
    await wallet?.disconnect();
    await solanaWallet?.disconnect();
    await authService?.logout();
    // dispatch(setProfile(null));
  }, [solanaWallet, wallet]);

  /**
   * @dev Get sol balance of a wallet.
   * @param address
   * @returns
   */
  const getSolBalance = useCallback(
    async (address?: web3.PublicKey) => {
      if (!address && !solanaWallet?.publicKey) return;

      /**
       * @dev Get blance if whether address or signer is valid.
       */
      const balance = await walletConnection.connection.getBalance(
        address || solanaWallet?.publicKey
      );

      /**
       * @dev Check signer sol balance if address is null.
       */
      if (!address && balance) {
        setSolBalance(balance);
      }

      return balance;
    },
    [solanaWallet]
  );

  /**
   * @dev Watch changes in wallet adpater and update.
   * */
  useEffect(() => {
    if (!walletProviderInfo) return;
    solanaWallet.select(getWalletName(walletProviderInfo.name));
  }, [walletProviderInfo, wallet, solanaWallet]);

  useEffect(() => {
    if (!wallet) return;
    /**
     * @dev Force to connect first.
     */
    solanaWallet?.wallet?.adapter?.connect().catch((e) => {
      console.log("connect wallet Error:", e);
    });
  }, [wallet, solanaWallet]);

  /**
   * @dev Initilize when wallet changed.
   * */
  useEffect(() => {
    (async () => {
      if (wallet?.publicKey?.toString()) {
        try {
          /** @dev Init program provider. */
          const programProvider = new PocketProgramProvider(solanaWallet);

          /** ---- DEBUG ---  */
          // setTimeout(async () => {
          //   try {
          //     const pocketState = await programProvider.getPocketState(
          //       "63fdbd65511692fe51fc195d"
          //     );
          //     console.log({ pocketState });
          //   } catch (err) {
          //     console.log("Error get pocket state: ", err);
          //   }
          // }, 4000);

          /** @dev Initlize swap program service with initlized programProvider. */
          const program = new ProgramService(programProvider);

          /** @dev Init program into state for usage. */
          initProgram(program);

          /** @dev update sol balance if wallet changes. */
          getSolBalance();
        } catch (err: any) {
          console.log(err.message);
        }
      }
    })();
  }, [wallet, solanaWallet, router.asPath]);

  return (
    <WalletContext.Provider
      value={{
        signMessage,
        disconnect,
        getSolBalance,
        solanaWallet,
        walletConnection,
        programService,
        solBalance,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

/** @dev Use context hook. */
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
