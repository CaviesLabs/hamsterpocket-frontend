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
}

export const poolService = new PoolService();
