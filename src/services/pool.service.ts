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

  public async getPocketById(payload: {
    pocketId: string;
  }): Promise<PocketEntity[]> {
    return networkProvider
      .request<PocketEntity[]>(`/pool/${payload.pocketId}`, {
        method: "GET",
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
  public async syncWalletPockets(
    walletAddress: string,
    evm = false,
    aptos = false,
    chainId = ""
  ): Promise<any> {
    return networkProvider.request<any>(
      aptos
        ? `/pool/user/aptos/${walletAddress}/sync?chainId=${chainId}`
        : evm
        ? `/pool/user/evm/${walletAddress}/sync?chainId=${chainId}`
        : `/pool/user/${walletAddress}/sync`,
      {
        method: "POST",
        data: {},
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      }
    );
  }
}

export const poolService = new PoolService();
