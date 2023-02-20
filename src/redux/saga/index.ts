import { takeLatest } from "redux-saga/effects";
import { GET_HISTORIES, GET_HISTORY } from "@/src/redux/actions";
import {
  getHistories,
  getHistory,
} from "@/src/redux/saga/history/history.saga";

export default function* root() {
  yield takeLatest<any>(GET_HISTORY, getHistory);
  yield takeLatest<any>(GET_HISTORIES, getHistories);
}
