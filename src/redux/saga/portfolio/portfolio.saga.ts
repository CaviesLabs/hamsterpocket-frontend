import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";
import { portfolioService } from "@/src/services/portfolio.service";
import { setPortfolios } from "@/src/redux/actions/portfolio/portfolio.action";

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
      payload
    );

    yield put(setPortfolios(portfolios));

    callback && callback(portfolios);
  } catch (err) {
    console.error(err);
    callback && callback(null);
  }
}
