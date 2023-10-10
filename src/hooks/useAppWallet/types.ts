/** @dev Define state for context. */
export interface AppWalletContextState {
  /**
   * @dev The address of eth or solana wallet.
   */
  walletAddress: string;
  balance: string | number;
}
