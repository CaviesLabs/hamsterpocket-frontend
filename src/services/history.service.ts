import { networkProvider } from "@/src/providers/network.provider";
import { HistoryEntity } from "@/src/entities/history.entity";
import { GetHistoriesDto } from "@/src/dto/history.dto";
import { DetailDto } from "@/src/dto/detail.dto";

export class HistoryService {
  public async getHistories(
    payload: GetHistoriesDto
  ): Promise<HistoryEntity[]> {
    return networkProvider.request<HistoryEntity[]>(`/pool/activity`, {
      method: "GET",
      params: payload,
    });
  }

  public async getHistory(payload: DetailDto): Promise<HistoryEntity> {
    return networkProvider.request<HistoryEntity>(`/histories/${payload.id}`, {
      method: "GET",
    });
  }
}

export const historyService = new HistoryService();
