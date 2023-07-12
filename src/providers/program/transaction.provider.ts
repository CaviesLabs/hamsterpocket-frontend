import {
  AddressLookupTableAccount,
  Connection,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  Commitment,
} from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { PocketIdl } from "./pocket.idl";
import { AugmentedProvider } from "@saberhq/solana-contrib";

export class TransactionProvider {
  constructor(
    /**
     * @dev Define network connection
     * @private
     */
    private readonly connection: Connection,
    /**
     * @dev This is to indicate whether the program is initialized or not.
     * @private
     */
    private readonly program: Program<PocketIdl>
  ) {}

  /**
   * @dev The function to create transaction with given instructions then sign and send to chain.
   * @public
   * @param walletProvider
   * @param instructions
   * @param commitment
   */
  public async signAndSendTransaction(
    walletProvider: AugmentedProvider,
    instructions: TransactionInstruction[],
    commitment: Commitment = "finalized"
  ) {
    /**
     * @dev Setup tx by creating a transaction which includes all instructions which users want to process.
     */
    const tx = new Transaction().add(...instructions);
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
    tx.feePayer = walletProvider.wallet.publicKey;

    /**
     * @dev Get raw transaction by signing in wallet.
     */
    const rawTx = await walletProvider.wallet.signTransaction(tx);
    rawTx.serialize();

    /**
     * @dev Send a raw transaction.
     */
    return this.connection.sendRawTransaction(rawTx.serialize(), {
      preflightCommitment: commitment,
    });
  }

  /**
   * @dev The function sign and send v0 transaction with/without address lookup table
   * @param walletProvider
   * @param instructions
   * @param addressLookupTableAccounts
   * @param commitment
   */
  public async signAndSendV0Transaction(
    walletProvider: AugmentedProvider,
    instructions: TransactionInstruction[],
    addressLookupTableAccounts: AddressLookupTableAccount[] = [],
    commitment: Commitment = "processed"
  ): Promise<string> {
    const latestBlockHash = await this.connection.getLatestBlockhash();

    /**
     * @dev Compile lookup message
     */
    const lookupMessage = new TransactionMessage({
      payerKey: walletProvider.wallet.publicKey,
      recentBlockhash: latestBlockHash.blockhash,
      instructions: instructions,
    }).compileToV0Message(addressLookupTableAccounts);

    /**
     * @dev Sign v0 message
     */
    const lookupTransaction = new VersionedTransaction(lookupMessage);
    const tx = await walletProvider.wallet.signTransaction(
      lookupTransaction as any
    );

    /**
     * @dev Send a raw transaction.
     */
    const txId = await this.connection.sendRawTransaction(tx.serialize());
    await this.connection.confirmTransaction(
      {
        signature: txId,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      },
      commitment
    );

    return txId;
  }
}
