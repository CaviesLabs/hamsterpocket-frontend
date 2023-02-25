import { networkProvider } from "@/src/providers/network.provider";
import { PocketProgramProvider } from "@/src/providers/program";
import { Keypair } from "@solana/web3.js";
import { CreatePocketDto } from "@/src/dto/pocket.dto";
import { WalletContextState as WalletProvider } from "@solana/wallet-adapter-react";
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
    console.log("creating", { createPocketDto });
    /** @dev Call to HamsterBox server to initialize the proposal. */
    await networkProvider.request("/pool", {
      method: "POST",
      data: {
        ownerAddress: walletProvider.publicKey?.toBase58()?.toString(),
        targetTokenAddress: createPocketDto.targetTokenAddress
          ?.toBase58()
          ?.toString(),
        baseTokenAddress: createPocketDto.baseTokenAddress
          ?.toBase58()
          ?.toString(),
      },
    });

    return await this.pocketProgramProvider.createProposal(
      walletProvider,
      createPocketDto
    );
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
        await this.sync(poolId);
        resolve(data);
      }, 4000)
    );
  }

  /**
   * @dev The function to sync the data of pool
   * @param {string} poolId
   */
  public async sync(poolId: string): Promise<any> {
    return networkProvider.request(`/pool/${poolId}/sync`, {
      method: "PATCH",
    });
  }

  /**
   * @dev Generate id following uuid types.
   * @static
   * @returns {string}
   */
  public static generatePocketId() {
    // return uuid().slice(0, 10);
    return Keypair.generate().publicKey.toString().slice(0, 24);
  }
}
