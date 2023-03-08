import { ProfileDto } from "@/src/dto/profile.dto";
import { HistoryEntity } from "@/src/entities/history.entity";
import {
  PortfolioEntity,
  PortfolioStatisticEntity,
} from "@/src/entities/portfolio.entity";
import { PocketEntity } from "@/src/entities/pocket.entity";
// import { ProposalDto } from "@/src/dto/proposal.dto";

/**
 * @dev Initialize app state.
 */
export default interface State {
  hProfile: ProfileDto;
  history: HistoryEntity;
  histories: HistoryEntity[];
  portfolios: PortfolioEntity[];
  portfolioStatistic: PortfolioStatisticEntity;
  activePocket: PocketEntity;
  closedPocket: PocketEntity;
  activePockets: PocketEntity[];
  closedPockets: PocketEntity[];
}
