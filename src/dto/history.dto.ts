/**
 * @dev Define list history dto
 */
export class GetHistoriesDto {
  /** @dev pagination fields */
  limit?: number;
  offset?: number;

  ownerAddress: string;
  search?: string;
}
