/** @dev Define state for context. */
export interface AppWalletContextState {
  /**
   * @dev The variable define which chain the app use.
   * */
  chain: "SOL" | "ETH";

  /**
   * @dev The address of eth or solana wallet.
   */
  walletAddress: string;
}
