import {
  SET_ACTIVE_POCKET,
  GET_ACTIVE_POCKETS,
  SET_ACTIVE_POCKETS,
  GET_ACTIVE_POCKET,
  GET_CLOSED_POCKET,
  SET_CLOSED_POCKET,
  GET_CLOSED_POCKETS,
  SET_CLOSED_POCKETS,
} from "@/src/redux/actions";
import { CallBackSaga } from "@/src/redux/entities";
import { DetailDto } from "@/src/dto/detail.dto";
import { GetPocketsDto } from "@/src/dto/pocket.dto";
import { PocketEntity } from "@/src/entities/pocket.entity";

/**
 * GET active pocket detail
 * @returns.
 */
export const getActivePocket = (
  payload?: DetailDto,
  callback?: CallBackSaga<PocketEntity>
) => ({
  type: GET_ACTIVE_POCKET,
  payload,
  callback,
});

/**
 * @param PocketEntity
 * @returns
 * @description
 * Update active pocket entity in redux state
 */
export const setActivePocket = (data: PocketEntity) => ({
  type: SET_ACTIVE_POCKET,
  payload: data,
});

/**
 * GET active pocket list
 * @param {PocketEntity[]} data
 * @returns reducer.
 */
export const getActivePockets = (data: GetPocketsDto) => ({
  type: GET_ACTIVE_POCKETS,
  payload: data,
});

/**
 * @param {PocketEntity[]} data
 * @returns reducer.
 * @description
 * Update active pocket list in redux state
 */
export const setActivePockets = (data: PocketEntity[]) => ({
  type: SET_ACTIVE_POCKETS,
  payload: data,
});

/**
 * GET de-active pocket detail
 * @returns.
 */
export const getClosedPocket = (
  payload?: DetailDto,
  callback?: CallBackSaga<PocketEntity>
) => ({
  type: GET_CLOSED_POCKET,
  payload,
  callback,
});

/**
 * @param PocketEntity
 * @returns
 * @description
 * Update de-active pocket entity in redux state
 */
export const setClosedPocket = (data: PocketEntity) => ({
  type: SET_CLOSED_POCKET,
  payload: data,
});

/**
 * GET de-active pocket list
 * @param {PocketEntity[]} data
 * @returns reducer.
 */
export const getClosedPockets = (data: GetPocketsDto) => ({
  type: GET_CLOSED_POCKETS,
  payload: data,
});

/**
 * @param {PocketEntity[]} data
 * @returns reducer.
 * @description
 * Update de-active pocket list in redux state
 */
export const setClosedPockets = (data: PocketEntity[]) => ({
  type: SET_CLOSED_POCKETS,
  payload: data,
});
