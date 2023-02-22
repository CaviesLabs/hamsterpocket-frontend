import {
  GET_PORTFOLIO_STATISTIC,
  GET_PORTFOLIOS,
  SET_PORTFOLIO_STATISTIC,
  SET_PORTFOLIOS,
} from "@/src/redux/actions";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";
import {
  PortfolioEntity,
  PortfolioStatisticEntity,
} from "@/src/entities/portfolio.entity";

/**
 * @param {PortfolioEntity[]} data
 * @returns reducer.
 */
export const getPortfolios = (data: GetPortfoliosDto) => ({
  type: GET_PORTFOLIOS,
  payload: data,
});

/**
 * @param {PortfolioEntity[]} data
 * @returns reducer.
 */
export const setPortfolios = (data: PortfolioEntity[]) => ({
  type: SET_PORTFOLIOS,
  payload: data,
});

/**
 * @param {PortfolioStatisticEntity[]} data
 * @returns reducer.
 */
export const getPortfolioStatistic = (data: GetPortfoliosDto) => ({
  type: GET_PORTFOLIO_STATISTIC,
  payload: data,
});

/**
 * @param {PortfolioStatisticEntity[]} data
 * @returns reducer.
 */
export const setPortfolioStatistic = (data: PortfolioStatisticEntity) => ({
  type: SET_PORTFOLIO_STATISTIC,
  payload: data,
});
