import { networkProvider } from "@/src/providers/network.provider";
import { HistoryEntity } from "@/src/components/history";
import { GetHistoriesDto } from "@/src/dto/history.dto";
import { DetailDto } from "@/src/dto/detail.dto";
import { HistoriesMock } from "@/src/services/mock.service";

export class HistoryService {
  public async getHistories(
    payload: GetHistoriesDto
  ): Promise<HistoryEntity[]> {
    return networkProvider
      .request<HistoryEntity[]>(`/histories`, {
        method: "GET",
        params: payload,
      })
      .catch(() => {
        return HistoriesMock;
      });
  }

  public async getHistory(payload: DetailDto): Promise<HistoryEntity> {
    return networkProvider.request<HistoryEntity>(`/histories/${payload.id}`, {
      method: "GET",
    });
  }
}

export const historyService = new HistoryService();
