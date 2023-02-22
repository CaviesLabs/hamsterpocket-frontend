import { SET_PORTFOLIO_STATISTIC, SET_PORTFOLIOS } from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import {
  PortfolioEntity,
  PortfolioStatisticEntity,
} from "@/src/entities/portfolio.entity";

/**
 * @dev List portfolios by user.
 * @param {PortfolioEntity} state
 * @param {Action} action
 */
export const portfoliosReducer = (
  state: PortfolioEntity[] = [],
  action: Action
) => {
  if (action.type === SET_PORTFOLIOS) {
    return action.payload;
  }
  return state;
};

/**
 * @dev List portfolio statistic by user.
 * @param {PortfolioEntity} state
 * @param {Action} action
 */
export const portfolioStatisticReducer = (
  state: PortfolioStatisticEntity = null,
  action: Action
) => {
  if (action.type === SET_PORTFOLIO_STATISTIC) {
    return action.payload;
  }
  return state;
};
