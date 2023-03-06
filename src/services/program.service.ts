import { networkProvider } from "@/src/providers/network.provider";
import { PocketProgramProvider } from "@/src/providers/program";
import { Keypair } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { WalletContextState as WalletProvider } from "@solana/wallet-adapter-react";
import { CreatePocketDto } from "@/src/dto/pocket.dto";
import { PocketEntity } from "@/src/entities/pocket.entity";
import UtilsProvider from "@/src/utils/utils.provider";

export class ProgramService {
  /**
   * @dev Program provider injected.
   * @private
   */
  private readonly pocketProgramProvider: PocketProgramProvider;
  private readonly utilsProvider: UtilsProvider;

  constructor(swapProgramProvider: PocketProgramProvider) {
    /**
     * @dev Import providers.
     */
    this.pocketProgramProvider = swapProgramProvider;
    this.utilsProvider = new UtilsProvider();
  }

  /**
   * @dev The function to create pocket onchain & ofchain.
   * Step 1: Create a empty pocket offchain to Hamster server.
   * Step 2: Create pocket onchain.
   * Step 3: Sync pocket after creation.
   * @param {WalletProvider}
   * @param {CreatePocketDto}
   */
  public async createPocket(
    walletProvider: WalletProvider,
    createPocketDto: CreatePocketDto
  ): Promise<any> {
    /** @dev Call to HamsterBox server to initialize the proposal. */
    const response = await networkProvider.request<any>("/pool", {
      method: "POST",
      data: {
        ownerAddress: walletProvider.publicKey?.toBase58()?.toString(),
        targetTokenAddress: createPocketDto.quoteTokenAddress
          ?.toBase58()
          ?.toString(),
        baseTokenAddress: createPocketDto.baseTokenAddress
          ?.toBase58()
          ?.toString(),
      },
    });

    return this.requestAndSync(response?._id, async () => {
      return await this.pocketProgramProvider.createPocket(walletProvider, {
        ...createPocketDto,
        id: response?._id,
      });
    });
  }

  /**
   * @dev The function to close pocket onchain & ofchain.
   * @param {WalletProvider}
   * @param {PocketEntity}
   */
  public async closePocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.closePocket(
        walletProvider,
        pocket
      );
    });
  }

  /**
   * @dev The function to pause pocket onchain & ofchain.
   * @param {WalletProvider}
   * @param {PocketEntity}
   */
  public async pausePocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.pausePocket(
        walletProvider,
        pocket
      );
    });
  }

  /**
   * @dev The function to pause pocket onchain & ofchain.
   * @param {WalletProvider}
   * @param {PocketEntity}
   */
  public async resumePocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity
  ): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.resumePocket(
        walletProvider,
        pocket
      );
    });
  }

  /**
   * @dev The function to close pocket onchain & ofchain.
   * @param {WalletProvider}
   * @param {PocketEntity}
   */
  public async depositPocket(
    walletProvider: WalletProvider,
    pocket: PocketEntity,
    depositedAmount: BN
  ): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.depositToPocket(
        walletProvider,
        pocket,
        depositedAmount
      );
    });
  }

  /**
   * @dev Sync pool by id.
   */
  public async requestAndSync(
    poolId: string,
    fn: () => Promise<any>
  ): Promise<any> {
    /**
     * @dev {Network}
     */
    const data = await fn();
    return new Promise(async (resolve) =>
      setTimeout(async () => {
        try {
          await this.sync(poolId);
        } finally {
          resolve(data);
        }
      }, 15000)
    );
  }

  /**
   * @dev The function to sync the data of pool
   * @param {string} poolId
   */
  public async sync(poolId: string): Promise<any> {
    return networkProvider.request(`/pool/${poolId}/sync`, {
      method: "POST",
    });
  }

  /**
   * @dev Generate id following uuid types.
   * @static
   * @returns {string}
   */
  public static generatePocketId() {
    return Keypair.generate().publicKey.toString().slice(0, 24);
  }
}
