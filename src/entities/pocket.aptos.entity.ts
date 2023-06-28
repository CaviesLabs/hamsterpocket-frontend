export interface DepositParamsAptos {
  id: string;
  coinType: string;
  amount: bigint;
}

export interface ExecTradingParamsAptos {
  id: string;
  baseCoinType: string;
  targetCoinType: string;
  minAmountOut: bigint;
}

export interface WithdrawParamsAptos {
  id: string;
  baseCoinType: string;
  targetCoinType: string;
}

export interface CreatePocketParamsAptos {
  id: string;
  baseCoinType: string;
  targetCoinType: string;
  amm: AMM;
  startAt: bigint;
  frequency: bigint;
  batchVolume: bigint;
  openPositionCondition: [OpenPositionOperatorAptos, bigint, bigint];
  stopLossCondition: [StopConditionStoppedWithAptos, bigint];
  takeProfitCondition: [StopConditionStoppedWithAptos, bigint];
  autoClosedConditions: [AutoCloseConditionClosedWithAptos, bigint][];
}

export interface UpdatePocketParamsAptos {
  id: string;
  startAt: bigint;
  frequency: bigint;
  batchVolume: bigint;
  openPositionCondition: [OpenPositionOperatorAptos, bigint, bigint];
  stopLossCondition: [StopConditionStoppedWithAptos, bigint];
  takeProfitCondition: [StopConditionStoppedWithAptos, bigint];
  autoClosedConditions: [AutoCloseConditionClosedWithAptos, bigint][];
}

export interface GetPocketParamsAptos {
  id: string;
}

export interface SetInteractiveTargetParamsAptos {
  target: string;
  value: boolean;
}

export interface SetAllowedOperatorParamsAptos {
  target: string;
  value: boolean;
}

export interface CreateResourceAccountParamsAptos {
  seed: string;
  ownerAddress: string;
  amountToFund: bigint;
}

export interface GetQuoteParamsAptos {
  baseCoinType: string;
  targetCoinType: string;
  amountIn: bigint;
}
export interface PocketResponseTypeAptos {
  amm: string;
  auto_close_conditions: {
    closed_with: string;
    value: string;
  }[];
  base_coin_type: string;
  base_coin_balance: string;
  batch_volume: string;
  executed_batch_amount: string;
  frequency: string;
  id: string;
  next_scheduled_execution_at: string;
  open_position_condition: {
    operator: string;
    value_x: string;
    value_y: string;
  };
  owner: string;
  start_at: string;
  status: string;
  stop_loss_condition: {
    stopped_with: string;
    value: string;
  };
  take_profit_condition: {
    stopped_with: string;
    value: string;
  };
  target_coin_type: string;
  target_coin_balance: string;
  total_closed_position_in_target_amount: string;
  total_deposited_base_amount: string;
  total_received_fund_in_base_amount: string;
  total_received_target_amount: string;
  total_swapped_base_amount: string;
}

export enum PocketStatusAptos {
  STATUS_ACTIVE = 0x0,
  STATUS_PAUSED = 0x1,
  STATUS_CLOSED = 0x2,
  STATUS_WITHDRAWN = 0x3,
}

export enum AMM {
  PCS = 0x0,
}

export enum OpenPositionOperatorAptos {
  UNSET = 0x0,
  OPERATOR_EQ = 0x1,
  OPERATOR_NEQ = 0x2,
  OPERATOR_GT = 0x3,
  OPERATOR_GTE = 0x4,
  OPERATOR_LT = 0x5,
  OPERATOR_LTE = 0x6,
  OPERATOR_BW = 0x7,
  OPERATOR_NBW = 0x8,
}

export enum StopConditionStoppedWithAptos {
  UNSET = 0x0,
  STOPPED_WITH_PRICE = 0x1,
  STOPPED_WITH_PORTFOLIO_VALUE_DIFF = 0x2,
  STOPPED_WITH_PORTFOLIO_PERCENT_DIFF = 0x3,
}

export enum AutoCloseConditionClosedWithAptos {
  CLOSED_WITH_END_TIME = 0x0,
  CLOSED_WITH_BATCH_AMOUNT = 0x1,
  CLOSED_WITH_SPENT_BASE_AMOUNT = 0x2,
  CLOSED_WITH_RECEIVED_TARGET_AMOUNT = 0x3,
}
