import { networkProvider } from "@/src/providers/network.provider";
import { Keypair } from "@solana/web3.js";

export class EvmProgramService {
  /**
   * @dev The function to create pocket onchain & ofchain.
   * Step 1: Create a empty pocket offchain to Hamster server.
   * Step 2: Create pocket onchain.
   * Step 3: Sync pocket after creation.
   * @param {WalletProvider}
   * @param {CreatePocketDto}
   */
  public async createPocketOffChain(walletAddress: string): Promise<any> {
    /** @dev Call to HamsterBox server to initialize the proposal. */
    const response = await networkProvider.request<any>(
      `/pool/mumbai/${walletAddress}`,
      {
        method: "POST",
        data: {},
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      }
    );

    return response?._id;
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
    return networkProvider.request(`/pool/evm/${poolId}/sync`, {
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

export const evmProgramService = new EvmProgramService();
