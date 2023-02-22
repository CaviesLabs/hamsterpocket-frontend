import { combineReducers } from "redux";
import hProfileReducer from "./profile";
import { historyReducer, historiesReducer } from "./history";
import {
  activePocketReducer,
  activePocketsReducer,
  closedPocketReducer,
  closedPocketsReducer,
} from "./pocket";
import { portfoliosReducer, portfolioStatisticReducer } from "./portfolio";
import State from "@/src/redux/entities/state";

/**
 * @dev Initialize reducer for app state management.
 */
const reducer = combineReducers<State>({
  hProfile: hProfileReducer,
  history: historyReducer,
  histories: historiesReducer,
  portfolios: portfoliosReducer,
  portfolioStatistic: portfolioStatisticReducer,
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
  portfolioStatistic: null,
  activePocket: null,
  closedPocket: null,
  activePockets: [],
  closedPockets: [],
};

export default reducer;
