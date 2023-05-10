import {
  SET_HISTORY,
  GET_HISTORIES,
  SET_HISTORIES,
  GET_HISTORY,
  GET_POCKET_ACTIVITIES,
} from "@/src/redux/actions";
import { CallBackSaga } from "@/src/redux/entities";
import { DetailDto } from "@/src/dto/detail.dto";
import { HistoryEntity } from "@/src/entities/history.entity";
import { GetHistoriesDto } from "@/src/dto/history.dto";

/**
 * @param histories
 * @returns
 * @description
 * Update history list in redux state
 */
export const setHistory = (data: HistoryEntity) => ({
  type: SET_HISTORY,
  payload: data,
});

/**
 * @param {HistoryEntity[]} data
 * @returns reducer.
 */
export const getHistories = (data: GetHistoriesDto) => ({
  type: GET_HISTORIES,
  payload: data,
});

/**
 * @dev Get activities of a pocket by pocket id.
 * @param {HistoryEntity[]} data
 * @returns reducer.
 */
export const getPocketActivities = (
  data: { pocketId: string },
  callback?: CallBackSaga<HistoryEntity[]>
) => ({
  type: GET_POCKET_ACTIVITIES,
  payload: data,
  callback,
});

/**
 * @param {HistoryEntity[]} data
 * @returns reducer.
 */
export const setHistories = (data: HistoryEntity[]) => ({
  type: SET_HISTORIES,
  payload: data,
});

/**
 * GET history detail
 * @returns.
 */
export const getHistory = (
  payload?: DetailDto,
  callback?: CallBackSaga<HistoryEntity>
) => ({
  type: GET_HISTORY,
  payload,
  callback,
});
