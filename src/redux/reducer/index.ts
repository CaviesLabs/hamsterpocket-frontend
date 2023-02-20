import { combineReducers } from "redux";
import hProfieReducer from "./profile";
import { historyReducer, historiesReducer } from "./history";
import State from "@/src/redux/entities/state";

/**
 * @dev Initialize reducer for app state management.
 */
const reducer = combineReducers<State>({
  hProfile: hProfieReducer,
  history: historyReducer,
  histories: historiesReducer,
});

/**
 * @dev Declare default state for app.
 */
export const initState: State = {
  hProfile: null,
  history: null,
  histories: [],
};

export default reducer;
