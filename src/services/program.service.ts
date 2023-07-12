import { networkProvider } from "@/src/providers/network.provider";
import { PocketProgramProvider } from "@/src/providers/program";
import { Keypair } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
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
   * @param createPocketDto
   */
  public async createPocket(createPocketDto: CreatePocketDto): Promise<any> {
    const address =
      this.pocketProgramProvider.walletProvider.wallet.publicKey.toBase58();

    /** @dev Call to HamsterBox server to initialize the proposal. */
    const response = await networkProvider.request<any>(
      `/pool/solana/${address}`,
      {
        method: "POST",
        data: {},
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      }
    );

    return this.requestAndSync(response?._id, async () => {
      return await this.pocketProgramProvider.createPocket({
        ...createPocketDto,
        id: response?._id,
      });
    });
  }

  /**
   * @dev The function to close pocket onchain & ofchain.
s   * @param pocket
   */
  public async closePocket(pocket: PocketEntity): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.closePocket(pocket);
    });
  }

  /**
   * @dev The function to close pocket onchain & ofchain.
   * @param pocket
   */
  public async withdrawPocket(pocket: PocketEntity): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.withdrawPocket(pocket);
    });
  }

  /**
   * @dev The function to delete ended pocket and claim fee which pay for create these pocket.
   * @param pocket
   */
  public async claimPocketFee(pocket: PocketEntity): Promise<any> {
    return this.pocketProgramProvider.closePocketAccount(pocket);
  }

  /**
   * @dev The function to pause pocket onchain & ofchain.
   * @param pocket
   */
  public async pausePocket(pocket: PocketEntity): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.pausePocket(pocket);
    });
  }

  /**
   * @dev The function to pause pocket onchain & ofchain.
   * @param pocket
   */
  public async resumePocket(pocket: PocketEntity): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.resumePocket(pocket);
    });
  }

  /**
   * @dev The function to close pocket onchain & ofchain.
   * @param pocket
   * @param depositedAmount
   */
  public async depositPocket(
    pocket: PocketEntity,
    depositedAmount: BN
  ): Promise<any> {
    return this.requestAndSync(pocket.id, async () => {
      return await this.pocketProgramProvider.depositToPocket(
        pocket,
        depositedAmount
      );
    });
  }

  /**
   * @dev Get pocket account.
   */
  public async getPocketAccount(pocketId: string): Promise<any> {
    return this.pocketProgramProvider.getPocketState(pocketId);
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
      data: {},
      headers: {
        "content-type": "text/plain;charset=UTF-8",
      },
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
