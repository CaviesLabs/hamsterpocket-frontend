import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { historyService } from "@/src/services/history.service";
import {
  setHistories,
  setHistory,
} from "@/src/redux/actions/history/history.action";
import { HistoryEntity } from "@/src/entities/history.entity";
import { GetHistoriesDto } from "@/src/dto/history.dto";
import { DetailDto } from "@/src/dto/detail.dto";

/**
 * @param callback
 * @description
 * Fetch histories data
 */
export function* getHistories({
  payload,
  callback,
}: SagaPayload<GetHistoriesDto, HistoryEntity[]>) {
  try {
    const histories: HistoryEntity[] = yield call(
      historyService.getHistories,
      payload
    );

    yield put(setHistories(histories));

    callback && callback(histories);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}

/**
 * @param callback
 * @description
 * Fetch activites of each pocket.
 */
export function* getPocketActivities({
  payload,
  callback,
}: SagaPayload<{ pocketId: string }, HistoryEntity[]>) {
  try {
    const histories: HistoryEntity[] = yield call(
      historyService.getPocketActivities,
      payload
    );

    callback && callback(histories);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}

/**
 * @param callback
 * @description
 * Fetch history data
 */
export function* getHistory({
  payload,
  callback,
}: SagaPayload<DetailDto, HistoryEntity>) {
  try {
    const history: HistoryEntity = yield call(
      historyService.getHistory,
      payload
    );

    yield put(setHistory(history));

    callback && callback(history);
  } catch (err) {
    console.error("222222222", err);
    callback && callback(null);
  }
}
