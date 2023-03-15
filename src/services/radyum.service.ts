import { networkProvider } from "@/src/providers/network.provider";
import { LiquidityEntity } from "@/src/entities/radyum.entity";

export class RadyumService {
  private END_POINT = "https://api.raydium.io/v2/sdk/liquidity/mainnet.json";

  /**
   * @dev The function to get liquidity arrays from Radyum.
   * @returns @arrays {LiquidityEntity}
   */
  public async getLiquidity(): Promise<LiquidityEntity[]> {
    /**
     * @dev Get data from network.
     */
    const response = await networkProvider.request<{
      name: string;
      official: LiquidityEntity[];
      unOfficial: LiquidityEntity[];
    }>(this.END_POINT, {
      method: "GET",
    });

    return response.official.concat(response.unOfficial);
  }
}

export const radyumService = new RadyumService();
