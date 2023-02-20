import { networkProvider } from "@/src/providers/network.provider";
import { HistoryType } from "@/src/components/history";
import { GetHistoriesDto } from "@/src/dto/history.dto";
import { DetailDto } from "@/src/dto/detail.dto";
import { HistoriesMock } from "@/src/services/mock.service";

export class HistoryService {
  public async getHistories(payload: GetHistoriesDto): Promise<HistoryType[]> {
    return networkProvider
      .request<HistoryType[]>(`/histories`, {
        method: "GET",
        params: payload,
      })
      .catch(() => {
        return HistoriesMock;
      });
  }

  public async getHistory(payload: DetailDto): Promise<HistoryType> {
    return networkProvider.request<HistoryType>(`/histories/${payload.id}`, {
      method: "GET",
    });
  }
}

export const historyService = new HistoryService();
