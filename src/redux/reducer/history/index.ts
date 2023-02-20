import { SET_HISTORIES, SET_HISTORY } from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import { HistoryType } from "@/src/components/history";

/**
 * @dev List history by user.
 * @param {HistoryEntity} state
 * @param {Action} action
 */
export const historiesReducer = (state: HistoryType[] = [], action: Action) => {
  if (action.type === SET_HISTORIES) {
    return action.payload;
  }
  return state;
};

/**
 * @dev Single history detail.
 * @param {HistoryType} state
 * @param {Action} action
 */
export const historyReducer = (state: HistoryType = null, action: Action) => {
  if (action.type === SET_HISTORY) {
    return action.payload;
  }
  return state;
};
