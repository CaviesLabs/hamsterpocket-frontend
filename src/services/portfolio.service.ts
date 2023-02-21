import { networkProvider } from "@/src/providers/network.provider";
import { PortfoliosMock } from "@/src/services/mock.service";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";

export class PortfolioService {
  public async getPortfolios(
    payload: GetPortfoliosDto
  ): Promise<PortfolioEntity[]> {
    return networkProvider
      .request<PortfolioEntity[]>(`/portfolio`, {
        method: "GET",
        params: payload,
      })
      .catch(() => {
        return PortfoliosMock;
      });
  }
}

export const portfolioService = new PortfolioService();
