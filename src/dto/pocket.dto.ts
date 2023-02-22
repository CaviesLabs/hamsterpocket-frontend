import { PocketStatus } from "@/src/entities/pocket.entity";

export interface PocketDto {}

/**
 * @dev Define list pocket dto
 */
export class GetPocketsDto {
  ownerAddress: string;
  statuses?: PocketStatus[];
}
