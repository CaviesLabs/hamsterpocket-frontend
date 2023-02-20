import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { historyService } from "@/src/services/history.service";
import {
  setHistories,
  setHistory,
} from "@/src/redux/actions/history/history.action";
import { HistoryType } from "@/src/components/history";
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
}: SagaPayload<GetHistoriesDto, HistoryType[]>) {
  try {
    const histories: HistoryType[] = yield call(
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
 * Fetch history data
 */
export function* getHistory({
  payload,
  callback,
}: SagaPayload<DetailDto, HistoryType>) {
  try {
    const history: HistoryType = yield call(historyService.getHistory, payload);

    yield put(setHistory(history));

    callback && callback(history);
  } catch (err) {
    console.error("222222222", err);
    callback && callback(null);
  }
}
