import { combineReducers } from "redux";
import hProfieReducer from "./profile";
import { historyReducer, historiesReducer } from "./history";
import {
  activePocketReducer,
  activePocketsReducer,
  closedPocketReducer,
  closedPocketsReducer,
} from "./pocket";
import { portfoliosReducer } from "./portfolio";
import State from "@/src/redux/entities/state";

/**
 * @dev Initialize reducer for app state management.
 */
const reducer = combineReducers<State>({
  hProfile: hProfieReducer,
  history: historyReducer,
  histories: historiesReducer,
  portfolios: portfoliosReducer,
  activePocket: activePocketReducer,
  closedPocket: closedPocketReducer,
  activePockets: activePocketsReducer,
  closedPockets: closedPocketsReducer,
});

/**
 * @dev Declare default state for app.
 */
export const initState: State = {
  hProfile: null,
  history: null,
  histories: [],
  portfolios: [],
  activePocket: null,
  closedPocket: null,
  activePockets: [],
  closedPockets: [],
};

export default reducer;
