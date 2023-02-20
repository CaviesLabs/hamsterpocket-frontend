import { call, put } from "redux-saga/effects";
import { SagaPayload } from "@/src/redux/entities";
import { PortfolioType } from "@/src/components/portfolio/types";
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
}: SagaPayload<GetPortfoliosDto, PortfolioType[]>) {
  try {
    const portfolios: PortfolioType[] = yield call(
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
