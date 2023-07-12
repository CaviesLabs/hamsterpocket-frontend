import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CreatePocketDto } from "@/src/dto/pocket.dto";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { PocketIdl, IDL } from "./pocket.idl";
import { InstructionProvider } from "./instruction.provider";
import { TransactionProvider } from "./transaction.provider";
import { WSOL_ADDRESS } from "@/src/utils/constants";
import { AugmentedProvider } from "@saberhq/solana-contrib";

/**
 * @dev Swap Program Provider acts as an interface to interact with hamsterswap program on solana.
 */
export class PocketProgramProvider {
  private readonly idl: PocketIdl = IDL;
  private readonly rpcEndpoint: string;
  private readonly programId: string;
  public readonly walletProvider: AugmentedProvider;
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
  constructor(
    walletProvider: AugmentedProvider,
    rpcUrl: string,
    programAddress: string
  ) {
    /**
     * @dev Initilize wallet provider context.
     */
    this.walletProvider = walletProvider;
    this.connection = new Connection(rpcUrl, "finalized");

    /**
     * @dev Binding program id
     */
    this.programId = programAddress;

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
        this.programId,
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
    const provider = new anchor.AnchorProvider(
      this.connection,
      this.walletProvider.wallet,
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
      PublicKey.findProgramAddressSync(
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
   * @param {CreatePocketDto} createPocketDto
   * @returns {any}.
   */
  public async createPocket(createPocketDto: CreatePocketDto) {
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
          this.walletProvider.wallet.publicKey,
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
          pocketAccount,
          createPocketDto.baseTokenAddress,
          createPocketDto.quoteTokenAddress,
          createPocketDto.depositedAmount,
          Object.keys(createPocketDto.side).includes("sell") ? "base" : "quote"
        )),
      ].filter((item) => item !== null);

      /**
       * @dev Sign and confirm instructions.
       */
      const txId = await this.transactionProvider.signAndSendTransaction(
        this.walletProvider,
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
    pocket: PocketEntity,
    depositedAmount: anchor.BN
  ) {
    const walletProvider = this.walletProvider;

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
          pocketAccount,
          new PublicKey((pocketState as any)?.baseTokenMintAddress),
          new PublicKey((pocketState as any)?.quoteTokenMintAddress),
          depositedAmount,
          "base"
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
   * @param pocketAccount
   * @param baseTokenAddress
   * @param targetTokenAddress
   * @param depositedAmount
   * @param mode
   */
  public async depositAsset(
    pocketAccount: PublicKey,
    baseTokenAddress: PublicKey,
    targetTokenAddress: PublicKey,
    depositedAmount: anchor.BN,
    mode: "base" | "quote"
  ): Promise<TransactionInstruction[]> {
    /** @dev Create token vault if not already exists .*/
    const createTokenVaultInstruction =
      await this.instructionProvider.createTokenVaultAccount(
        this.walletProvider.wallet.publicKey,
        pocketAccount,
        baseTokenAddress
      );

    /** @dev Create token vault if not already exists .*/
    const createTokenTargetVaultInstruction =
      await this.instructionProvider.createTokenVaultAccount(
        this.walletProvider.wallet.publicKey,
        pocketAccount,
        targetTokenAddress
      );

    /**
     * @dev Try to create a instruction to deposit token.
     */
    const ins = await this.instructionProvider.depositAsset(
      this.walletProvider.wallet.publicKey,
      pocketAccount,
      baseTokenAddress,
      targetTokenAddress,
      depositedAmount,
      mode
    );

    return [
      createTokenVaultInstruction,
      createTokenTargetVaultInstruction,
      ...ins,
    ];
  }

  /**
   * @dev The function to close pocket pool and withdraw assets.
   * @param pocket
   */
  public async closePocket(pocket: PocketEntity) {
    try {
      console.log("Pocket ID to close and withdraw: ", pocket.id);

      /** @dev Get pocket state. */
      const [pocketAccount, pocketState] = await this.getPocketState(pocket.id);

      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */
      let instructions: TransactionInstruction[] = [];

      /** @dev Close pool first if its status is not CLOSED. */
      if (!(pocketState as any)?.status?.closed) {
        instructions.push(
          await this.instructionProvider.closePocket(
            this.walletProvider.wallet.publicKey,
            pocketAccount
          )
        );
      }

      const baseTokenMint = new PublicKey(
        (pocketState as any)?.baseTokenMintAddress
      );
      const qouteTokeMint = new PublicKey(
        (pocketState as any)?.quoteTokenMintAddress
      );

      /** @dev Create token vault if not already exists .*/
      const createTokenVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          this.walletProvider.wallet.publicKey,
          pocketAccount,
          baseTokenMint
        );

      /** @dev Create token vault if not already exists .*/
      const createTokenTargetVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          this.walletProvider.wallet.publicKey,
          pocketAccount,
          qouteTokeMint
        );

      /** @dev Withdraw assets from pool to wallet. */
      const withdrawIns = await this.instructionProvider.withdrawPocket(
        this.walletProvider,
        this.walletProvider.wallet.publicKey,
        pocketAccount,
        baseTokenMint,
        qouteTokeMint
      );

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolBase =
        baseTokenMint.toBase58().toString() === WSOL_ADDRESS
          ? await this.instructionProvider.unwrapSol(
              this.walletProvider.wallet.publicKey
            )
          : null;

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolQoute =
        qouteTokeMint.toBase58().toString() === WSOL_ADDRESS
          ? await this.instructionProvider.unwrapSol(
              this.walletProvider.wallet.publicKey
            )
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
        this.walletProvider,
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
   * @param pocket
   */
  public async withdrawPocket(pocket: PocketEntity) {
    const walletProvider = this.walletProvider;
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
          walletProvider.wallet.publicKey,
          pocketAccount,
          baseTokenMint
        );

      /** @dev Create token vault if not already exists .*/
      const createTokenTargetVaultInstruction =
        await this.instructionProvider.createTokenVaultAccount(
          walletProvider.wallet.publicKey,
          pocketAccount,
          qouteTokeMint
        );

      /** @dev Withdraw assets from pool to wallet. */
      const withdrawIns = await this.instructionProvider.withdrawPocket(
        walletProvider,
        walletProvider.wallet.publicKey,
        pocketAccount,
        baseTokenMint,
        qouteTokeMint
      );

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolBase =
        baseTokenMint.toBase58().toString() === WSOL_ADDRESS &&
        (pocketState as any).baseTokenBalance !== "00"
          ? await this.instructionProvider.unwrapSol(
              walletProvider.wallet.publicKey
            )
          : null;

      /** @dev Unwrap sol if base token is wrap sol. */
      const unwrapSolQoute =
        qouteTokeMint.toBase58().toString() === WSOL_ADDRESS &&
        (pocketState as any).quoteTokenBalance !== "00"
          ? await this.instructionProvider.unwrapSol(
              walletProvider.wallet.publicKey
            )
          : null;

      console.log(unwrapSolBase, unwrapSolQoute);

      /** @dev Add to instructions if valid. */
      instructions = [
        ...instructions,
        createTokenVaultInstruction,
        createTokenTargetVaultInstruction,
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
   * @dev The function to close pocket account.
   * @param pocket
   */
  public async closePocketAccount(pocket: PocketEntity) {
    const walletProvider = this.walletProvider;

    try {
      console.log("Pocket ID to close pocket account: ", pocket.id);
      /** @dev Get pocket state. */
      const [pocketAccount, pocketState] = await this.getPocketState(pocket.id);
      console.log(pocketState);
      /**
       * @dev Define @var {TransactionInstruction} @arrays instructions to process.
       */

      const baseTokenMint = new PublicKey(
        (pocketState as any)?.baseTokenMintAddress
      );
      const qouteTokeMint = new PublicKey(
        (pocketState as any)?.quoteTokenMintAddress
      );

      const instructions: TransactionInstruction[] = [
        ...(await this.instructionProvider.closePocketAccount(
          walletProvider.wallet.publicKey,
          pocketAccount,
          baseTokenMint,
          qouteTokeMint
        )),
      ];

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
  public async pausePocket(pocket: PocketEntity) {
    const walletProvider = this.walletProvider;

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
          walletProvider.wallet.publicKey,
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
   * @param pocket
   */
  public async resumePocket(pocket: PocketEntity) {
    const walletProvider = this.walletProvider;

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
          walletProvider.wallet.publicKey,
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
    const pocketAccount = await this.instructionProvider.findPocketAccount(id);
    const state = await this.program.account.pocket.fetch(pocketAccount);
    const parseState = JSON.parse(JSON.stringify(state)) as PocketEntity;
    return [pocketAccount, parseState, state];
  }
}
