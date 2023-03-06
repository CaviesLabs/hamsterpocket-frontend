import { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  // LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { CreatePocketDto } from "@/src/dto/pocket.dto";
import {
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  createCloseAccountInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import { getOrCreateAssociatedTokenAccount } from "./getOrCreateAssociatedTokenAccount";
import { PocketIdl } from "./pocket.idl";

export class InstructionProvider {
  /**
   * @dev Define network connection
   * @private
   */
  private readonly connection: Connection;

  /**
   * @dev This is to indicate whether the program is initialized or not.
   * @private
   */
  private readonly program: Program<PocketIdl>;

  /**
   * @dev Swap registry
   * @private
   */
  private readonly pocketRegistry: PublicKey;
  private readonly swapRegistryBump: number;

  constructor(
    connection: Connection,
    program: Program<PocketIdl>,
    pocketRegistry: PublicKey,
    swapRegistryBump: number
  ) {
    this.connection = connection;
    this.program = program;
    this.pocketRegistry = pocketRegistry;
    this.swapRegistryBump = swapRegistryBump;
  }

  /**
   * @dev Find pocket account.
   * @param {string} id Pocket ID.
   */
  public async findPocketAccount(pocketId: string): Promise<PublicKey> {
    const [pocketAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("SEED::POCKET::POCKET_SEED"),
        anchor.utils.bytes.utf8.encode(pocketId.slice(0, 24)),
      ],
      this.program.programId
    );

    return pocketAccount;
  }

  /**
   * @dev Find token vault account.
   * @param {PublicKey} pocketAccount pocketAccount.
   * @param {PublicKey} tokenAccount token account.
   */
  public async findTokenVaultAccount(
    pocketAccount: PublicKey,
    tokenAccount: PublicKey
  ): Promise<PublicKey> {
    const [tokenVualtAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("SEED::POCKET::TOKEN_VAULT_SEED"),
        pocketAccount.toBytes(),
        tokenAccount.toBytes(),
      ],
      this.program.programId
    );

    return tokenVualtAccount;
  }

  /**
   * @dev The function to get or create a account to hold token.
   * @param publicKey
   * @param {PublicKey} mintAccount
   * @returns {PublicKey}
   */
  public async getOrCreateProposalTokenAccount(
    publicKey: PublicKey,
    mintAccount: PublicKey
  ): Promise<TransactionInstruction> {
    return getOrCreateAssociatedTokenAccount(
      this.connection,
      { publicKey } as any,
      mintAccount,
      publicKey
    );
  }

  /**
   * @dev The function to find and create token vault.
   * @param {PublicKey} pocketOwner,
   * @param {PublicKey} pocketAccount,
   * @param {PublicKey} pub.
   * @returns {TransactionInstruction}
   */
  public async createTokenVaultAccount(
    pocketOwner: PublicKey,
    pocketAccount: PublicKey,
    mintAccount: PublicKey
  ): Promise<TransactionInstruction> {
    /**
     * @dev Find token vault if exists in chain.
     */
    const pocketTokenVault = await this.findTokenVaultAccount(
      pocketAccount,
      mintAccount
    );

    /**
     * @dev If does not find account info of token vault then create new instruction for one.
     */
    if (!(await this.connection.getAccountInfo(pocketTokenVault))) {
      return await this.program.methods
        .createTokenVault()
        .accounts({
          mintAccount: mintAccount,
          pocketTokenVault: pocketTokenVault,
          signer: pocketOwner,
          pocket: pocketAccount,
        })
        .instruction();
    }

    return null;
  }

  /**
   * @dev The function to create proposal instruction.
   * @param {CreateProposalDto} createProposalDto.
   * @param {PublicKey} proposalOwner.
   * @param {PublicKey} swapProposal.
   * @returns {TransactionInstruction}
   */
  public async createPocket(
    createPocketDto: CreatePocketDto,
    pocketOwner: PublicKey,
    pocketAccount: PublicKey
  ): Promise<TransactionInstruction> {
    /**
     * @dev Custom data to create.
     */
    console.log({ createPocketDto });
    const data: any = {
      id: createPocketDto.id,
      quoteTokenAddress: createPocketDto.quoteTokenAddress,
      baseTokenAddress: createPocketDto.baseTokenAddress,
      stopConditions: createPocketDto.stopConditions,
      buyCondition: createPocketDto.buyCondition,
      startAt: createPocketDto.startAt,
      batchVolume: createPocketDto.batchVolume,
      name: createPocketDto.name,
      frequency: createPocketDto.frequency,
      side: createPocketDto.side,
      marketId: createPocketDto.marketId,
    };

    /**
     * @dev Execute instruction creation.
     */
    return await this.program.methods
      .createPocket(data)
      .accounts({
        pocket: pocketAccount,
        signer: pocketOwner,
        pocketRegistry: this.pocketRegistry,
      })
      .instruction();
  }

  /**
   * @dev Deposit assets to pocket pool
   * @param {PublicKey} pocketOwner
   * @param {PublicKey} pocketAccount
   * @param {PublicKey} tokenAccount
   * @param {PublicKey} tokenVaultAccount
   * @param {PublicKey} depositAmount
   * @returns {TransactionInstruction}
   */
  public async depositAsset(
    pocketOwner: PublicKey,
    pocketAccount: PublicKey,
    baseTokenAccount: PublicKey,
    targetTokenAccount: PublicKey,
    depositAmount: anchor.BN
  ): Promise<TransactionInstruction> {
    /**
     * @dev Get @var {asociatedTokenAccount} to hold mintAccount.
     */
    const baseAsociated = await getAssociatedTokenAddress(
      baseTokenAccount,
      pocketOwner
    );
    const targetAsociated = await getAssociatedTokenAddress(
      targetTokenAccount,
      pocketOwner
    );

    /**
     * @dev Get @var {PublicKey} tokenVault
     */

    const baseTokenVault = await this.findTokenVaultAccount(
      pocketAccount,
      baseTokenAccount
    );
    const targetTokenVault = await this.findTokenVaultAccount(
      pocketAccount,
      targetTokenAccount
    );

    return await this.program.methods
      .deposit({
        depositAmount,
        mode: { base: {} },
      } as any)
      .accounts({
        signer: pocketOwner,
        pocket: pocketAccount,
        pocketBaseTokenVault: baseTokenVault,
        pocketQuoteTokenVault: targetTokenVault,
        signerBaseTokenAccount: baseAsociated,
        signerQuoteTokenAccount: targetAsociated,
      })
      .instruction();
  }

  /**
   * @dev Instuction to close pool.
   * @param pocketOwner
   * @param pocketAccount
   * @returns
   */
  public async closePocket(pocketOwner: PublicKey, pocketAccount: PublicKey) {
    return await this.program.methods
      .updatePocket({
        status: { closed: {} },
      } as any)
      .accounts({
        signer: pocketOwner,
        pocket: pocketAccount,
      })
      .instruction();
  }

  /**
   * @dev Instruction to withdraw assets.
   * @param pocketOwner
   * @param pocketAccount
   * @param baseTokenAccount
   * @param targetTokenAccount
   * @returns
   */
  public async withdrawPocket(
    pocketOwner: PublicKey,
    pocketAccount: PublicKey,
    baseTokenAccount: PublicKey,
    targetTokenAccount: PublicKey
  ) {
    /**
     * @dev Get @var {asociatedTokenAccount} to hold mintAccount.
     */
    const baseAsociated = await getAssociatedTokenAddress(
      baseTokenAccount,
      pocketOwner
    );
    const targetAsociated = await getAssociatedTokenAddress(
      targetTokenAccount,
      pocketOwner
    );

    /**
     * @dev Get @var {PublicKey} tokenVault
     */

    const baseTokenVault = await this.findTokenVaultAccount(
      pocketAccount,
      baseTokenAccount
    );
    const targetTokenVault = await this.findTokenVaultAccount(
      pocketAccount,
      targetTokenAccount
    );
    return await this.program.methods
      .withdraw()
      .accounts({
        signer: pocketOwner,
        pocket: pocketAccount,
        pocketBaseTokenVault: baseTokenVault,
        pocketQuoteTokenVault: targetTokenVault,
        signerBaseTokenAccount: baseAsociated,
        signerTargetTokenAccount: targetAsociated,
      } as any)
      .instruction();
  }

  /**
   * @dev Wrap SOL to wSOL before deposit.
   * @param {PublicKey} walletPublicKey
   * @param {BN} amount
   * @returns @arrays {[TransactionInstruction, TransactionInstruction]}
   */
  public async wrapSol(
    walletPublicKey: PublicKey,
    amount: anchor.BN
  ): Promise<[TransactionInstruction, TransactionInstruction]> {
    /**
     * @dev Get token account of wSOL.
     */
    const associatedTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      walletPublicKey
    );

    /**
     * @dev Transfer sol to wsol account.
     */
    const instruction1 = SystemProgram.transfer({
      fromPubkey: walletPublicKey,
      toPubkey: associatedTokenAccount,
      lamports: amount.toNumber(),
    });

    /**
     * @dev Create native sol.
     */
    const instruction2 = createSyncNativeInstruction(associatedTokenAccount);

    return [instruction1, instruction2];
  }

  /**
   * @dev Unwrap wSOL to sol instruction.
   * @param {PublicKey} walletPublicKey
   * @returns {TransactionInstruction}.
   */
  public async unwrapSol(
    walletPublicKey: PublicKey
  ): Promise<TransactionInstruction> {
    /**
     * @dev Get token account of wSOL.
     */
    const associatedTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      walletPublicKey
    );

    return createCloseAccountInstruction(
      associatedTokenAccount,
      walletPublicKey,
      walletPublicKey
    );
  }
}
