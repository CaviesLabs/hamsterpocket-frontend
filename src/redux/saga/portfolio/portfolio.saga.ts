import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import {
  PortfolioEntity,
  PortfolioStatisticEntity,
} from "@/src/entities/portfolio.entity";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";
import { portfolioService } from "@/src/services/portfolio.service";
import {
  setPortfolios,
  setPortfolioStatistic,
} from "@/src/redux/actions/portfolio/portfolio.action";

/**
 * @param callback
 * @description
 * Fetch portfolios data
 */
export function* getPortfolios({
  payload,
  callback,
}: SagaPayload<GetPortfoliosDto, PortfolioEntity[]>) {
  try {
    const portfolios: PortfolioEntity[] = yield call(
      portfolioService.getPortfolios,
      {
        ...payload,
      }
    );

    yield put(setPortfolios(portfolios));

    callback && callback(portfolios);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}

/**
 * @param callback
 * @description
 * Fetch portfolio statistic data
 */
export function* getPortfolioStatistic({
  payload,
  callback,
}: SagaPayload<GetPortfoliosDto, PortfolioStatisticEntity>) {
  try {
    const statistic: PortfolioStatisticEntity = yield call(
      portfolioService.getStatistic,
      {
        ...payload,
      }
    );

    yield put(setPortfolioStatistic(statistic));
    callback && callback(statistic);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}
