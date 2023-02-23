import { networkProvider } from "@/src/providers/network.provider";
import { SwapProgramProvider } from "@/src/providers/program/swap-program.provider";
import UtilsProvider from "@/src/utils/utils.provider";
import { Keypair } from "@solana/web3.js";

export class ProgramService {
  /**
   * @dev Program provider injected.
   * @private
   */
  private readonly swapProgramProvider: SwapProgramProvider;
  private readonly utilsProvider: UtilsProvider;

  constructor(swapProgramProvider: SwapProgramProvider) {
    /**
     * @dev Import providers.
     */
    this.swapProgramProvider = swapProgramProvider;
    this.utilsProvider = new UtilsProvider();
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
    return Keypair.generate().publicKey.toString().slice(0, 24);
  }
}
