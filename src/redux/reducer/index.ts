import { combineReducers } from "redux";
// import userReducer from "./user";
// import userChatReducer from "./user-chat";
// import nftReducer from "./nft";
// import hProfileReducer from "./hamster-profile";
// import hPublicProfileReducer from "./hamster-profile/public-profile";
// import platformConfigReducer from "./platform-config";
// import { proposalReducer, proposalsReducer } from "./proposal";
import State from "@/src/redux/entities/state";

/**
 * @dev Initialize reducer for app state management.
 */
const reducer = combineReducers<State>({});

/**
 * @dev Declare default state for app.
 */
export const initState: State = {};

export default reducer;
