export interface LiquidityEntity {
  authority: string;
  baseDecimals: number;
  baseMint: string;
  baseVault: string;
  id: string;
  lookupTableAccount: string;
  lpDecimals: number;
  lpMint: string;
  lpVault: string;
  marketAsks: string;
  marketAuthority: string;
  marketBaseVault: string;
  marketBids: string;
  marketEventQueue: string;
  marketId: string;
  marketProgramId: string;
  marketQuoteVault: string;
  marketVersion: number;
  openOrders: string;
  programId: string;
  quoteDecimals: number;
  quoteMint: string;
  quoteVault: string;
  targetOrders: string;
  version: number;
  withdrawQueue: number;
}
