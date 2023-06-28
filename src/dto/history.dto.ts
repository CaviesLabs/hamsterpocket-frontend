/**
 * @dev Define list history dto
 */
export class GetHistoriesDto {
  /** @dev pagination fields */
  limit?: number;
  offset?: number;

  statuses?: string[];

  timeFrom?: string;
  timeTo?: string;

  ownerAddress: string;
  search?: string;
  chainId: string;
}
