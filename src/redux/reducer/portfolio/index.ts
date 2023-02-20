import { SET_PORTFOLIOS } from "@/src/redux/actions";
import { Action } from "@/src/redux/entities/interfaces/action";
import { PortfolioType } from "@/src/components/portfolio/types";

/**
 * @dev List history by user.
 * @param {PortfolioType} state
 * @param {Action} action
 */
export const portfoliosReducer = (
  state: PortfolioType[] = [],
  action: Action
) => {
  if (action.type === SET_PORTFOLIOS) {
    return action.payload;
  }
  return state;
};
