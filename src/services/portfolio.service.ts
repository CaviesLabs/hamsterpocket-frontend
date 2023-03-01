import { networkProvider } from "@/src/providers/network.provider";
import { PortfoliosMock } from "@/src/services/mock.service";
import {
  PortfolioEntity,
  PortfolioStatisticEntity,
} from "@/src/entities/portfolio.entity";
import {
  GetPortfoliosDto,
  GetPortfolioStatisticDto,
} from "@/src/dto/portfolio.dto";

export class PortfolioService {
  public async getStatistic(
    payload: GetPortfolioStatisticDto
  ): Promise<PortfolioStatisticEntity[]> {
    const address = payload.ownerAddress;
    delete payload.ownerAddress;
    return networkProvider.request<PortfolioStatisticEntity[]>(
      // TODO change token base
      `/portfolio/${address}/base-token/So11111111111111111111111111111111111111112`,
      {
        method: "GET",
        params: payload,
      }
    );
  }

  public async getPortfolios(
    payload: GetPortfoliosDto
  ): Promise<PortfolioEntity[]> {
    const address = payload.ownerAddress;
    delete payload.ownerAddress;
    return networkProvider
      .request<PortfolioEntity[]>(`/portfolio/${address}/user-tokens`, {
        method: "GET",
        params: payload,
      })
      .catch(() => {
        return PortfoliosMock;
      });
  }
}

export const portfolioService = new PortfolioService();
