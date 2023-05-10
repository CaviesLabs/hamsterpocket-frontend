import { takeLatest } from "redux-saga/effects";
import {
  GET_ACTIVE_POCKETS,
  GET_POCKET_BY_ID,
  GET_CLOSED_POCKETS,
  GET_HISTORIES,
  GET_HISTORY,
  GET_POCKET_ACTIVITIES,
  GET_PORTFOLIO_STATISTIC,
  GET_PORTFOLIOS,
  SYNC_WALLET_POCKETS,
} from "@/src/redux/actions";
import {
  getHistories,
  getHistory,
  getPocketActivities,
} from "@/src/redux/saga/history/history.saga";
import {
  getPortfolios,
  getPortfolioStatistic,
} from "@/src/redux/saga/portfolio/portfolio.saga";
import {
  getActivePockets,
  getClosedPockets,
  syncWalletPockets,
  getPocketById,
} from "@/src/redux/saga/pocket/pocket.saga";

export default function* root() {
  yield takeLatest<any>(GET_HISTORY, getHistory);
  yield takeLatest<any>(GET_HISTORIES, getHistories);
  yield takeLatest<any>(GET_POCKET_ACTIVITIES, getPocketActivities);
  yield takeLatest<any>(GET_PORTFOLIOS, getPortfolios);
  yield takeLatest<any>(GET_PORTFOLIO_STATISTIC, getPortfolioStatistic);
  yield takeLatest<any>(GET_ACTIVE_POCKETS, getActivePockets);
  yield takeLatest<any>(GET_POCKET_BY_ID, getPocketById);
  yield takeLatest<any>(GET_CLOSED_POCKETS, getClosedPockets);
  yield takeLatest<any>(SYNC_WALLET_POCKETS, syncWalletPockets);
}
