import { SET_HISTORIES, SET_HISTORY } from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import { HistoryEntity } from "@/src/entities/history.entity";

/**
 * @dev List history by user.
 * @param {HistoryEntity} state
 * @param {Action} action
 */
export const historiesReducer = (
  state: HistoryEntity[] = [],
  action: Action
) => {
  if (action.type === SET_HISTORIES) {
    return action.payload;
  }
  return state;
};

/**
 * @dev Single history detail.
 * @param {HistoryEntity} state
 * @param {Action} action
 */
export const historyReducer = (state: HistoryEntity = null, action: Action) => {
  if (action.type === SET_HISTORY) {
    return action.payload;
  }
  return state;
};
