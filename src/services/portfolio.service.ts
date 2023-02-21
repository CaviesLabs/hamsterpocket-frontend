import { networkProvider } from "@/src/providers/network.provider";
import { PortfoliosMock } from "@/src/services/mock.service";
import { PortfolioType } from "@/src/components/portfolio/types";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";

export class PortfolioService {
  public async getPortfolios(
    payload: GetPortfoliosDto
  ): Promise<PortfolioType[]> {
    return networkProvider
      .request<PortfolioType[]>(`/portfolio`, {
        method: "GET",
        params: payload,
      })
      .catch(() => {
        return PortfoliosMock;
      });
  }
}

export const portfolioService = new PortfolioService();
