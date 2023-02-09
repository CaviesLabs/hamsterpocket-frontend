import {
  WalletContextState as SolanaWalletContextState,
  ConnectionContextState,
} from "@solana/wallet-adapter-react";
import web3 from "@solana/web3.js";
import { ProgramService } from "@/src/services/program.service";

/** @dev Define state for context. */
export interface WalletContextState {
  /**
   * @dev The function to sign message in Solana network.
   * */
  signMessage(message: string): Promise<Uint8Array>;

  /**
   * @dev The function to disconnect walle & logout to Hamster server and Firebase.
   */
  disconnect(): Promise<void>;

  /**
   * @dev The function to get sol balance of a specific wallet or signer.
   * @param {PublicKey} pub
   */
  getSolBalance(pub?: web3.PublicKey): Promise<number>;

  /**
   * @dev Expose context frrom solana-adapter.
   */
  solanaWallet: SolanaWalletContextState;

  /**
   * @dev Solana chain connection.
   */
  walletConnection: ConnectionContextState;

  /**
   * @dev Define Program service.
   */
  programService: ProgramService;

  /**
   * @dev Sol balance of signer.
   */
  solBalance: number;
}
