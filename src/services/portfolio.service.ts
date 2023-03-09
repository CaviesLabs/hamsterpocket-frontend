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

  /**
   * @dev Make call to hamster server to sync all pockets owned by a wallet address.
   * @param walletAddress
   * @returns
   */
  public async syncWalletPortfolio(walletAddress: string): Promise<any> {
    return networkProvider.request<any>(
      `/portfolio/${walletAddress}/portfolio/sync`,
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

export const portfolioService = new PortfolioService();
