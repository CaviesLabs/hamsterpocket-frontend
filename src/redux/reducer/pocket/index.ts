import {
  SET_ACTIVE_POCKET,
  SET_ACTIVE_POCKETS,
  SET_CLOSED_POCKET,
  SET_CLOSED_POCKETS,
} from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import { PocketEntity } from "@/src/entities/pocket.entity";

/**
 * @dev List active pockets.
 * @param {PocketEntity[]} state
 * @param {Action} action
 */
export const activePocketsReducer = (
  state: PocketEntity[] = [],
  action: Action
) => {
  if (action.type === SET_ACTIVE_POCKETS) {
    return action.payload;
  }
  return state;
};

/**
 * @dev Single active pocket detail.
 * @param {PocketEntity} state
 * @param {Action} action
 */
export const activePocketReducer = (
  state: PocketEntity = null,
  action: Action
) => {
  if (action.type === SET_ACTIVE_POCKET) {
    return action.payload;
  }
  return state;
};

/**
 * @dev List de-active pockets.
 * @param {PocketEntity[]} state
 * @param {Action} action
 */
export const closedPocketsReducer = (
  state: PocketEntity[] = [],
  action: Action
) => {
  if (action.type === SET_CLOSED_POCKETS) {
    return action.payload;
  }
  return state;
};

/**
 * @dev Single de-active pocket detail.
 * @param {PocketEntity} state
 * @param {Action} action
 */
export const closedPocketReducer = (
  state: PocketEntity = null,
  action: Action
) => {
  if (action.type === SET_CLOSED_POCKET) {
    return action.payload;
  }
  return state;
};
