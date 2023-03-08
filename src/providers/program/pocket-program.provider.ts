/* eslint-disable @typescript-eslint/no-unused-vars */
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WalletContextState as WalletProvider } from "@solana/wallet-adapter-react";
import { CreatePocketDto } from "@/src/dto/pocket.dto";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { PocketIdl, IDL } from "./pocket.idl";
import { InstructionProvider } from "./instruction.provider";
import { TransactionProvider } from "./transaction.provider";
import { WSOL_ADDRESS } from "@/src/utils/constants";

export const SOLANA_DEVNET_RPC_ENDPOINT = "https://api.devnet.solana.com";
export const SOLANA_MAINNET_RPC_RPC_ENDPOINT =
  "https://boldest-few-field.solana-mainnet.quiknode.pro/0ffa9f9f5e9141aa33a030081b78fdfe40bfbae6/";

/**
 * @dev Swap Program Provider acts as an interface to interact with hamsterswap program on solana.
 */
export class PocketProgramProvider {
  private readonly idl: PocketIdl = IDL;
  private readonly rpcEndpoint: string;
  private readonly programId: string;
  private readonly walletProvider: WalletProvider;
  private connection: Connection;

  /**
   * @dev This is to indicate whether the program is initialized or not.
   * @private
   */
  private program: Program<PocketIdl>;
  private pocketRegistry: PublicKey;
  private pocketRegistryBump: number;
  private isProgramInitialize = false;

  /**
   * @dev Provider to create instructions.
   * @private
   */
  private instructionProvider: InstructionProvider;

  /**
   * @dev Provider to process transactions.
   * @private
   */
  private transactionProvider: TransactionProvider;

  /**
   * @dev Initialize swap program provider.
   */
  constructor(walletProvider: WalletProvider) {
    /**
     * @dev Initilize wallet provider context.
     */
    this.walletProvider = walletProvider;

    /**
     * @dev Binding cluster
     */
    switch (process.env.SOLANA_CLUSTER) {
      case "devnet":
        this.rpcEndpoint = SOLANA_DEVNET_RPC_ENDPOINT;
        break;
      case "mainnet-beta":
        this.rpcEndpoint = SOLANA_MAINNET_RPC_RPC_ENDPOINT;
        break;
      default:
        throw new Error("RPC not supported");
    }

    /**
     * @dev Binding program id
     */
    this.programId = process.env.SWAP_PROGRAM_ADDRESS;

    /**
     * @dev Initialize program
     */
    this.getPocketProgram().then((program) => {
      this.program = program;
      this.isProgramInitialize = true;

      /**
       * @dev Initialize instruction provider.
       */
      this.instructionProvider = new InstructionProvider(
        this.connection,
        this.program,
        this.pocketRegistry,
        this.pocketRegistryBump
      );

      /**
       * @dev Initlize transaction provider.
       */
      this.transactionProvider = new TransactionProvider(
        this.connection,
        this.program
      );
    });
  }

  /**
   * @dev Initialize program
   * @private
   */
  private async getPocketProgram() {
    /**
     * @dev Skip initialization if the program was initialized.
     */
    if (this.program) {
      return this.program;
    }

    /**
     * @dev Prepares for some infra config
     */
    this.connection = new Connection(this.rpcEndpoint, "finalized");
    const provider = new anchor.AnchorProvider(
      this.connection,
      this.walletProvider,
      {
        preflightCommitment: "finalized",
        commitment: "finalized",
      }
    );

    /**
     * @dev Now we create program instance
     */
    this.program = new Program<PocketIdl>(this.idl, this.programId, provider);

    /**
     * @dev Now find swap account.
     */
    const [pocketRegistry, pocketRegistryBump] =
      await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("SEED::POCKET::PLATFORM")],
        this.program.programId
      );

    /**
     * @dev assign to instance.
     */
    this.pocketRegistry = pocketRegistry;
    this.pocketRegistryBump = pocketRegistryBump;

    /**
     * @dev Return the program again.
     */
    return this.program;
  }

  /**
   * @dev Return the swap registry.
   */
  public async getSwapConfig() {
    const program = await this.getPocketProgram();

    // find the swap account
    const [pocketAccountPublicKey] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("SEED::POCKET::PLATFORM")],
      program.programId
    );

    return program.account.pocketPlatformRegistry.fetch(pocketAccountPublicKey);
  }

  /**
   * @dev The function to execute instructions creation then send and signn into blockchain to create new pocket on-chain.
   * @param walletProvider
   * @param {CreatePocketDto} createPocketDto
   * @returns {any}.
   */
  public async createPocket(
    walletProvider: WalletProvider,
    createPocketDto: CreatePocketDto
  ) {
    try {
      console.log("Pocket ID: ", createPocketDto.id);
      console.log("Params to create pocket: ", createPocketDto);
      console.log(createPocketDto.depositedAmount.toNumber() / Math.pow(10, 9));
      /**
       * @dev Find pocket account.
       */
      const pocketAccount = await this.instructionProvider.findPocketAccount(
        createPocketDto.id
      );

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [];

      /**
       * @dev Call function to create proposal instruction.
       */
      const createPocketInstruction =
        await this.instructionProvider.createPocket(
          createPocketDto,
          walletProvider.publicKey,
          pocketAccount
        );

      /**
       * @dev Add instruction to arrays to process if valid.
       */
      if (createPocketInstruction) {
        instructions.push(createPocketInstruction);
      }

      /**
       * @dev Add to instructions if valid.
       */
      instructions = [
        ...instructions,
        ...(await this.depositAsset(
          walletProvider,
          pocketAccount,
          createPocketDto.baseTokenAddress,
          createPocketDto.quoteTokenAddress,
          createPocketDto.depositedAmount
        )),
      ].filter((item) => item !== null);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        walletProvider,
        instructions
      );

      console.log("Transaction ID: ", { txId });
      setTimeout(async () => {
        try {
          const [, state] = await this.getPocketState(createPocketDto.id);
          console.log(createPocketDto.id, { state });
        } catch (err) {
          console.log("Error when fetch pocket state", err);
        }
      }, 4000);
    } catch (err: any) {
      console.error("Error", err.message);
      throw err;
    }
  }

  public async depositToPocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity,
    depositedAmount: anchor.BN
  ) {
    try {
      console.log("Pocket ID: ", pocket.id);
      console.log("Params to deposit pocket: ", pocket);

      /** @dev Get pocket state. */
      const [pocketAccount, pocketState] = await this.getPocketState(pocket.id);

      console.log(pocketState);

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [].concat(
        await this.depositAsset(
          walletProvider,
          pocketAccount,
          new PublicKey((pocketState as any)?.baseTokenMintAddress),
          new PublicKey((pocketState as any)?.quoteTokenMintAddress),
          depositedAmount
        )
      );

      /** @dev Add to instructions if valid. */
      instructions = [...instructions].filter((item) => item !== null);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        walletProvider,
        instructions
      );

      console.log("Transaction ID: ", { txId });
      setTimeout(async () => {
        try {
          const [, state] = await this.getPocketState(pocket.id);
          console.log(pocket.id, { state });
        } catch (err) {
          console.log("Error when fetch pocket state", err);
        }
      }, 4000);
    } catch (err: any) {
      console.error("Error", err.message);
      throw err;
    }
  }

  /**
   * @dev Deposit asset to pool.
   * @param {PublicKey} tokenAddress
   */
  public async depositAsset(
    walletProvider: WalletProvider,
    pocketAccount: PublicKey,
    baseTokenAddress: PublicKey,
    targetTokenAddress: PublicKey,
    depositedAmount: anchor.BN
  ): Promise<TransactionInstruction[]> {
    /** @dev Instruction to create associated token account if doest exists. */
    const associatedInstruction =
      await this.instructionProvider.getOrCreateProposalTokenAccount(
        walletProvider.publicKey,
        baseTokenAddress
      );

    /** @dev Find token vault */
    const tokenVault = await this.instructionProvider.findTokenVaultAccount(
      pocketAccount,
      baseTokenAddress
    );

    /** @dev Create token vault if not already exists .*/
    const createTokenVaultInstruction =
      await this.instructionProvider.createTokenVaultAccount(
        walletProvider.publicKey,
        pocketAccount,
        baseTokenAddress
      );

    /** @dev Create token vault if not already exists .*/
    const createTokenTargetVaultInstruction =
      await this.instructionProvider.createTokenVaultAccount(
        walletProvider.publicKey,
        pocketAccount,
        targetTokenAddress
      );

    /**
     * @dev Handle to wrap sol to wsol if offered item is SOL currency.
     */
    const wrapSolInstructions = [];
    if (baseTokenAddress.toBase58().toString() === WSOL_ADDRESS) {
      try {
        const [ins1, ins2] = await this.instructionProvider.wrapSol(
          walletProvider.publicKey,
          depositedAmount
        );

        ins1 && wrapSolInstructions.push(ins1);
        ins2 && wrapSolInstructions.push(ins2);
      } catch (err) {
        console.log("Error when wrap sol", err);
      }
    }
    /**
     * @dev Try to create a instruction to deposit token.
     */
    const ins = await this.instructionProvider.depositAsset(
      walletProvider.publicKey,
      pocketAccount,
      baseTokenAddress,
      targetTokenAddress,
      depositedAmount
    );

    return [
      associatedInstruction,
      createTokenVaultInstruction,
      createTokenTargetVaultInstruction,
      ...wrapSolInstructions,
      ...ins,
    ];
  }

  /**
   * @dev The function to close pocket pool and withdraw assets.
   * @param walletProvider
   * @param pocket
   */
  public async closePocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ) {
    try {
      console.log("Pocket ID to close: ", pocket.id);

      /** @dev Get pocket state. */
      const [pocketAccount, pocketState] = await this.getPocketState(pocket.id);

      console.log(pocketState);

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [];

      /** @dev Close pool. */
      instructions.push(
        await this.instructionProvider.closePocket(
          walletProvider.publicKey,
          pocketAccount
        )
      );

      const baseTokenMint = new PublicKey(
        (pocketState as any)?.baseTokenMintAddress
      );
      const qouteTokeMint = new PublicKey(
        (pocketState as any)?.quoteTokenMintAddress
      );

      /** @dev Create token vault if not already exists .*/
      const createTokenVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          walletProvider.publicKey,
          pocketAccount,
          baseTokenMint
        );

      /** @dev Create token vault if not already exists .*/
      const createTokenTargetVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          walletProvider.publicKey,
          pocketAccount,
          qouteTokeMint
        );

      /** @dev Withdraw assets from pool to wallet. */
      const withdrawIns = await this.instructionProvider.withdrawPocket(
        walletProvider.publicKey,
        pocketAccount,
        baseTokenMint,
        qouteTokeMint
      );

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolBase =
        baseTokenMint.toBase58().toString() === WSOL_ADDRESS
          ? await this.instructionProvider.unwrapSol(walletProvider.publicKey)
          : null;

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolQoute =
        qouteTokeMint.toBase58().toString() === WSOL_ADDRESS
          ? await this.instructionProvider.unwrapSol(walletProvider.publicKey)
          : null;

      /** @dev Add to instructions if valid. */
      instructions = [
        ...instructions,
        createTokenVaultInstruction,
        createTokenTargetVaultInstruction,
        ...withdrawIns,
        unwrapSolBase,
        unwrapSolQoute,
      ].filter((item) => item !== null);
      console.log("instructions to close", instructions);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        walletProvider,
        instructions
      );

      console.log("Transaction ID: ", { txId });
      setTimeout(async () => {
        try {
          const [, state] = await this.getPocketState(pocket.id);
          console.log(pocket.id, { state });
        } catch (err) {
          console.log("Error when fetch pocket state", err);
        }
      }, 4000);
    } catch (err: any) {
      console.error("Error", err.message);
      throw err;
    }
  }

  /**
   * @dev The function to withdraw assets.
   * @param walletProvider
   * @param pocket
   */
  public async withdrawPocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ) {
    try {
      console.log("Pocket ID to withdraw: ", pocket.id);

      /** @dev Get pocket state. */
      const [pocketAccount, pocketState] = await this.getPocketState(pocket.id);

      console.log(pocketState);

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [];

      const baseTokenMint = new PublicKey(
        (pocketState as any)?.baseTokenMintAddress
      );
      const qouteTokeMint = new PublicKey(
        (pocketState as any)?.quoteTokenMintAddress
      );

      /** @dev Create token vault if not already exists .*/
      const createTokenVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          walletProvider.publicKey,
          pocketAccount,
          baseTokenMint
        );

      /** @dev Create token vault if not already exists .*/
      const createTokenTargetVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          walletProvider.publicKey,
          pocketAccount,
          qouteTokeMint
        );

      /** @dev Withdraw assets from pool to wallet. */
      const withdrawIns = await this.instructionProvider.withdrawPocket(
        walletProvider.publicKey,
        pocketAccount,
        baseTokenMint,
        qouteTokeMint
      );

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolBase =
        baseTokenMint.toBase58().toString() === WSOL_ADDRESS
          ? await this.instructionProvider.unwrapSol(baseTokenMint)
          : null;

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolQoute =
        qouteTokeMint.toBase58().toString() === WSOL_ADDRESS
          ? await this.instructionProvider.unwrapSol(qouteTokeMint)
          : null;

      /** @dev Add to instructions if valid. */
      instructions = [
        createTokenVaultInstruction,
        createTokenTargetVaultInstruction,
        ...instructions,
        ...withdrawIns,
        unwrapSolBase,
        unwrapSolQoute,
      ].filter((item) => item !== null);
      console.log(instructions);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        walletProvider,
        instructions
      );

      console.log("Transaction ID: ", { txId });
      setTimeout(async () => {
        try {
          const [, state] = await this.getPocketState(pocket.id);
          console.log(pocket.id, { state });
        } catch (err) {
          console.log("Error when fetch pocket state", err);
        }
      }, 4000);
    } catch (err: any) {
      console.error("Error", err.message);
      throw err;
    }
  }

  /**
   * @dev The function to pause.
   * @param walletProvider
   * @param pocket
   */
  public async pausePocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ) {
    try {
      console.log("Pocket ID to pause: ", pocket.id);

      /** @dev Get pocket state. */
      const [pocketAccount] = await this.getPocketState(pocket.id);

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [];

      /** @dev Close pool. */
      instructions.push(
        await this.instructionProvider.pausePocket(
          walletProvider.publicKey,
          pocketAccount
        )
      );

      /** @dev Add to instructions if valid. */
      instructions = [...instructions].filter((item) => item !== null);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        walletProvider,
        instructions
      );

      console.log("Transaction ID: ", { txId });
      setTimeout(async () => {
        try {
          const [, state] = await this.getPocketState(pocket.id);
          console.log(pocket.id, { state });
        } catch (err) {
          console.log("Error when fetch pocket state", err);
        }
      }, 4000);
    } catch (err: any) {
      console.error("Error", err.message);
      throw err;
    }
  }

  /**
   * @dev The function to resume.
   * @param walletProvider
   * @param pocket
   */
  public async resumePocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ) {
    try {
      console.log("Pocket ID: ", pocket.id);
      console.log("Params to create pocket: ", pocket);

      /** @dev Get pocket state. */
      const [pocketAccount, pocketState] = await this.getPocketState(pocket.id);

      console.log(pocketState);

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [];

      /** @dev Close pool. */
      instructions.push(
        await this.instructionProvider.resumePocket(
          walletProvider.publicKey,
          pocketAccount
        )
      );

      /** @dev Add to instructions if valid. */
      instructions = [...instructions].filter((item) => item !== null);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        walletProvider,
        instructions
      );

      console.log("Transaction ID: ", { txId });
      setTimeout(async () => {
        try {
          const [, state] = await this.getPocketState(pocket.id);
          console.log(pocket.id, { state });
        } catch (err) {
          console.log("Error when fetch pocket state", err);
        }
      }, 4000);
    } catch (err: any) {
      console.error("Error", err.message);
      throw err;
    }
  }

  /**
   * @dev Get pocket state
   * @param {string} id Pocket ID.
   */
  public async getPocketState(
    id: string
  ): Promise<[PublicKey, PocketEntity, any?]> {
    console.log("instruction provider", this.instructionProvider);
    const pocketAccount = await this.instructionProvider.findPocketAccount(id);
    const state = await this.program.account.pocket.fetch(pocketAccount);
    const parseState = JSON.parse(JSON.stringify(state)) as PocketEntity;
    return [pocketAccount, parseState, state];
  }
}
