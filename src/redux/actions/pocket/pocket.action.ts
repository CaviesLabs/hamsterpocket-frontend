import {
  SET_ACTIVE_POCKET,
  GET_ACTIVE_POCKETS,
  SET_ACTIVE_POCKETS,
  GET_ACTIVE_POCKET,
  GET_CLOSED_POCKET,
  SET_CLOSED_POCKET,
  GET_CLOSED_POCKETS,
  SET_CLOSED_POCKETS,
  SYNC_WALLET_POCKETS,
  GET_POCKET_BY_ID,
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
 * GET pocket by id.
 * @returns.
 */
export const getPocketById = (
  payload: { pocketId: string },
  callback?: CallBackSaga<PocketEntity>
) => ({
  type: GET_POCKET_BY_ID,
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
export const getClosedPockets = (
  data: GetPocketsDto,
  callback?: CallBackSaga<any>
) => ({
  type: GET_CLOSED_POCKETS,
  payload: data,
  callback,
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

/**
 * @dev Request to sync all pockets owned by wallet.
 * @param data Wallet address.
 * @returns {boolean}
 */
export const syncWalletPockets = (
  data: {
    walletAddress: string;
    evm?: boolean;
    aptos?: boolean;
    chainId?: string;
  },
  callback?: CallBackSaga<any>
) => ({
  type: SYNC_WALLET_POCKETS,
  payload: data,
  callback,
});
