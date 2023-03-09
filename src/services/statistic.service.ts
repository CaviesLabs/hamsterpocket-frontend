import { networkProvider } from "@/src/providers/network.provider";
import { StatisticEntity } from "@/src/entities/statistic.entity";
import { StatisticMock } from "@/src/services/mock.service";

export class StatisticService {
  async getStatistic(): Promise<StatisticEntity> {
    try {
      /**
       * @dev Call to HamsterPocket server to get statistic info.
       */
      const response = await networkProvider.request<StatisticEntity>(
        "/statistics/latest",
        {
          data: {},
        }
      );

      return response;
    } catch {
      return StatisticMock;
    }
  }
}

export const statisticService = new StatisticService();
