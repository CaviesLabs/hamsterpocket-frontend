import { combineReducers } from "redux";
import hProfieReducer from "./profile";
import State from "@/src/redux/entities/state";

/**
 * @dev Initialize reducer for app state management.
 */
const reducer = combineReducers<State>({
  hProfile: hProfieReducer,
});

/**
 * @dev Declare default state for app.
 */
export const initState: State = {
  hProfile: null,
};

export default reducer;
