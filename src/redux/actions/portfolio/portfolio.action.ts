import { GET_PORTFOLIOS, SET_PORTFOLIOS } from "@/src/redux/actions";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";

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
