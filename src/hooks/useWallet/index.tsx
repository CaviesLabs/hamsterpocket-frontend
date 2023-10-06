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
import web3, { Connection } from "@solana/web3.js";
import { useRouter } from "next/router";

import { ProgramService } from "@/src/services";
import { PocketProgramProvider } from "@/src/providers/program/pocket-program.provider";
import { WalletContextState } from "./types";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";

/** @dev Initialize context. */
export const WalletContext = createContext<WalletContextState>(null);

/** @dev Expose wallet provider for usage. */
export const WalletProvider: FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();

  const { platformConfig, chainId } = usePlatformConfig();

  /** @dev Get @var {walletProviderInfo} from @var {GokkiKit}. */
  const { providerMut } = useSaberhq();

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

      if (!platformConfig?.rpcUrl) return;

      const connection = new Connection(platformConfig?.rpcUrl, "confirmed");

      /**
       * @dev Get blance if whether address or signer is valid.
       */
      const balance = await connection
        .getBalance(address || solanaWallet?.publicKey)
        .catch((e) => {
          console.log(e);
          return 0;
        });

      console.log("balance", balance);

      /**
       * @dev Check signer sol balance if address is null.
       */
      if (!address && balance) {
        setSolBalance(balance);
      }

      return balance;
    },
    [solanaWallet, platformConfig]
  );

  useEffect(() => {
    if (!solanaWallet) return;
    if (chainId !== ChainId.sol) return;
    /**
     * @dev Force to connect first.
     */
    solanaWallet?.connect().catch((e) => {
      console.log("connect wallet Error:", e);
    });
  }, [chainId, solanaWallet]);

  /**
   * @dev Initilize when wallet changed.
   * */
  useEffect(() => {
    if (chainId !== ChainId.sol) return;

    (async () => {
      if (
        !programService &&
        solanaWallet?.publicKey?.toString() &&
        platformConfig
      ) {
        try {
          /** @dev Init program provider. */
          const programProvider = new PocketProgramProvider(
            providerMut,
            platformConfig.rpcUrl,
            platformConfig.programAddress
          );

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
  }, [
    chainId,
    solanaWallet,
    router.asPath,
    providerMut,
    platformConfig,
    programService,
  ]);

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
