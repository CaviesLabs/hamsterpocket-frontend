// import { User } from "firebase/auth";
// import { UserChatEntity } from "@/src/entities/chatroom.entity";
// import { NftEntity } from "@/src/dto/nft.dto";
// import { SwapProposalEntity } from "@/src/entities/proposal.entity";
// import { PlatformConfigDto } from "@/src/entities/platform-config.entity";
import { ProfileDto } from "@/src/dto/profile.dto";
import { HistoryType } from "@/src/components/history";
import { PortfolioType } from "@/src/components/portfolio/types";
import { PocketEntity } from "@/src/dto/pocket.dto";
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
  portfolios: PortfolioType[];
  activePocket: PocketEntity;
  closedPocket: PocketEntity;
  activePockets: PocketEntity[];
  closedPockets: PocketEntity[];
}
