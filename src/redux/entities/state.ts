// import { User } from "firebase/auth";
// import { UserChatEntity } from "@/src/entities/chatroom.entity";
// import { NftEntity } from "@/src/dto/nft.dto";
// import { SwapProposalEntity } from "@/src/entities/proposal.entity";
// import { PlatformConfigDto } from "@/src/entities/platform-config.entity";
import { ProfileDto } from "@/src/dto/profile.dto";
import { HistoryType } from "@/src/components/history";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";
import { PocketEntity } from "@/src/entities/pocket.entity";
// import { ProposalDto } from "@/src/dto/proposal.dto";

/**
 * @dev Initialize app state.
 */
export default interface State {
  // user: User;
  // userChats: UserChatEntity[];
  // nft: NftEntity[];
  // proposal: ProposalDto;
  // proposals: SwapProposalEntity[];
  hProfile: ProfileDto;
  // hPublicProfile: hProfileDto;
  // platformConfig: PlatformConfigDto;
  history: HistoryType;
  histories: HistoryType[];
  portfolios: PortfolioEntity[];
  activePocket: PocketEntity;
  closedPocket: PocketEntity;
  activePockets: PocketEntity[];
  closedPockets: PocketEntity[];
}
