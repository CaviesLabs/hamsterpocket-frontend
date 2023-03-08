import { networkProvider } from "@/src/providers/network.provider";
import { ActivePocketsMock } from "@/src/services/mock.service";
import { GetPocketsDto } from "@/src/dto/pocket.dto";
import { PocketEntity } from "@/src/entities/pocket.entity";

export class PoolService {
  public async getPockets(payload: GetPocketsDto): Promise<PocketEntity[]> {
    return networkProvider
      .request<PocketEntity[]>(`/pool`, {
        method: "GET",
        params: payload,
      })
      .catch(() => {
        return ActivePocketsMock;
      });
  }

  /**
   * @dev Make call to hamster server to sync all pockets owned by a wallet address.
   * @param walletAddress
   * @returns
   */
  public async syncWalletPockets(walletAddress: string): Promise<any> {
    return networkProvider.request<any>(`/pool/user/${walletAddress}/sync`, {
      method: "POST",
    });
  }
}

export const poolService = new PoolService();
