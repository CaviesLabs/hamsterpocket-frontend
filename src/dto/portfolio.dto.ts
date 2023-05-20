import { ChainId } from "../entities/platform-config.entity";

/**
 * @dev Define list portfolio dto
 */
export class GetPortfoliosDto {
  ownerAddress: string;
  sortBy: string[];

  limit?: number;
  offset?: number;
  search?: string;
  chainId: ChainId;
}

/**
 * @dev Define portfolio statistic dto
 */
export class GetPortfolioStatisticDto {
  ownerAddress: string;
}
