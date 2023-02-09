import { networkProvider } from "@/src/providers/network.provider";
import { SwapProgramProviderV0 } from "@/src/providers/program/swap-program-v0.provider";
import UtilsProvider from "@/src/utils/utils.provider";
import { uuid } from "uuidv4";

export class ProgramService {
  /**
   * @dev Program provider injected.
   * @private
   */
  private readonly swapProgramProvider: SwapProgramProviderV0;
  private readonly utilsProvider: UtilsProvider;

  constructor(swapProgramProvider: SwapProgramProviderV0) {
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
  public static generateUID() {
    return uuid().slice(0, 10);
  }
}
