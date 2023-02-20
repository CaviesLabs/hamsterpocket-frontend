import {
  SET_HISTORY,
  GET_HISTORIES,
  SET_HISTORIES,
  GET_HISTORY,
} from "@/src/redux/actions";
import { CallBackSaga } from "@/src/redux/entities";
import { DetailDto } from "@/src/dto/detail.dto";
import { HistoryType } from "@/src/components/history";
import { GetHistoriesDto } from "@/src/dto/history.dto";

/**
 * @param histories
 * @returns
 * @description
 * Update history list in redux state
 */
export const setHistory = (data: HistoryType) => ({
  type: SET_HISTORY,
  payload: data,
});

/**
 * @param {HistoryType[]} data
 * @returns reducer.
 */
export const getHistories = (data: GetHistoriesDto) => ({
  type: GET_HISTORIES,
  payload: data,
});

/**
 * @param {HistoryType[]} data
 * @returns reducer.
 */
export const setHistories = (data: HistoryType[]) => ({
  type: SET_HISTORIES,
  payload: data,
});

/**
 * GET history detail
 * @returns.
 */
export const getHistory = (
  payload?: DetailDto,
  callback?: CallBackSaga<HistoryType>
) => ({
  type: GET_HISTORY,
  payload,
  callback,
});
