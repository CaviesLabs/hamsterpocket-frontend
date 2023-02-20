import { GET_PORTFOLIOS, SET_PORTFOLIOS } from "@/src/redux/actions";
import { GetPortfoliosDto } from "@/src/dto/portfolio.dto";
import { PortfolioType } from "@/src/components/portfolio/types";

/**
 * @param {PortfolioType[]} data
 * @returns reducer.
 */
export const getPortfolios = (data: GetPortfoliosDto) => ({
  type: GET_PORTFOLIOS,
  payload: data,
});

/**
 * @param {PortfolioType[]} data
 * @returns reducer.
 */
export const setPortfolios = (data: PortfolioType[]) => ({
  type: SET_PORTFOLIOS,
  payload: data,
});
