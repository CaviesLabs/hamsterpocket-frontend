/**
 * @dev Define list portfolio dto
 */
export class GetPortfoliosDto {
  ownerAddress: string;
  sortBy: string[];

  limit?: number;
  offset?: number;
  search?: string;
  chainId: string;
}

/**
 * @dev Define portfolio statistic dto
 */
export class GetPortfolioStatisticDto {
  ownerAddress: string;
}
