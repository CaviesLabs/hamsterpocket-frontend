import web3 from "@solana/web3.js";
import { ProgramService } from "@/src/services/program.service";
import { ConnectedWallet } from "@saberhq/use-solana";
import { AugmentedProvider } from "@saberhq/solana-contrib";

/** @dev Define state for context. */
export interface WalletContextState {
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
  solanaWallet: ConnectedWallet;

  /**
   * @dev Expose provider from solana-adapter.
   */
  provider: AugmentedProvider;

  /**
   * @dev Define Program service.
   */
  programService: ProgramService;

  /**
   * @dev Sol balance of signer.
   */
  solBalance: number;
}
