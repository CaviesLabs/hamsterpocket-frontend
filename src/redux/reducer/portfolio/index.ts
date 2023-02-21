import { SET_PORTFOLIOS } from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";

/**
 * @dev List history by user.
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
