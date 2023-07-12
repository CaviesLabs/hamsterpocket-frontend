/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
  FC,
} from "react";
import {
  useSolana as useSaberhq,
  useConnectedWallet,
} from "@saberhq/use-solana";
import web3 from "@solana/web3.js";
import { useRouter } from "next/router";

import { ProgramService } from "@/src/services";
import { PocketProgramProvider } from "@/src/providers/program/pocket-program.provider";
import { WalletContextState } from "./types";

/** @dev Initiize context. */
export const WalletContext = createContext<WalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const WalletProvider: FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  /** @dev Get @var {walletProviderInfo} from @var {GokkiKit}. */
  const { connection, providerMut } = useSaberhq();

  /** @dev Import wallet from Gokki library. */
  const solanaWallet = useConnectedWallet();

  /** @dev Program service */
  const [programService, initProgram] = useState<ProgramService>(null);
  const [solBalance, setSolBalance] = useState(0);

  /**
   * @dev Encode message to @var {Uint8Array}.
   *      Step 1. Disconnect wallet.
   *      Step 2. Logout user.
   */
  const disconnect = useCallback(async () => {
    await solanaWallet?.disconnect();
  }, [solanaWallet]);

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
      const balance = await connection
        .getBalance(address || solanaWallet?.publicKey)
        .catch(() => {
          return 0;
        });

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

  useEffect(() => {
    if (!solanaWallet) return;
    /**
     * @dev Force to connect first.
     */
    solanaWallet?.connect().catch((e) => {
      console.log("connect wallet Error:", e);
    });
  }, [solanaWallet]);

  /**
   * @dev Initilize when wallet changed.
   * */
  useEffect(() => {
    (async () => {
      if (solanaWallet?.publicKey?.toString()) {
        try {
          /** @dev Init program provider. */
          const programProvider = new PocketProgramProvider(providerMut);

          /** @dev Initlize swap program service with initlized programProvider. */
          const program = new ProgramService(programProvider);

          /** @dev Init program into state for usage. */
          initProgram(program);

          /** @dev update sol balance if wallet changes. */
          await getSolBalance();
        } catch (err: any) {
          console.log(err.message);
        }
      }
    })();
  }, [solanaWallet, router.asPath, providerMut]);

  return (
    <WalletContext.Provider
      value={{
        disconnect,
        getSolBalance,
        solanaWallet: solanaWallet,
        provider: providerMut,
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
