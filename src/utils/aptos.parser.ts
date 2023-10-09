import bigDecimal from "js-big-decimal";
import { Keypair } from "@solana/web3.js";
import { WSOL_ADDRESS } from "@/src/utils";
import { BN } from "@project-serum/anchor";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { ChainId } from "@/src/entities/platform-config.entity";
import { CreatePocketDto as SolCreatePocketDto } from "@/src/dto/pocket.dto";

import {
  PriceConditionType,
  BuyConditionOnChain as SolBuyConditionOnChain,
  StopConditionsOnChain as SolStopConditionsOnChain,
} from "@/src/entities/pocket.entity";
import {
  DepositParams,
  CreatePocketParams as CreatePocketParamsAptos,
} from "@/src/providers/program/aptos/params.type";
import {
  AMM,
  OpenPositionOperator as OpenPositionOperatorAptos,
  StopConditionStoppedWith as StopConditionStoppedWithAptos,
  AutoCloseConditionClosedWith as AutoCloseConditionClosedWithAptos,
} from "@/src/providers/program/aptos/entities/pocket.entity";

/**
 * @dev The function to convert number to big aptos number.
 */
export const convertBigNumber = (value: number, decimals: number) => {
  return BigInt(
    `${parseInt(bigDecimal.multiply(parseFloat(value.toString()), decimals))}`
  );
};

/**
 * @dev The function to devide big number.
 * @param value
 * @param decimals
 * @returns
 */
export const devideBigNumber = (value: number | BN, decimals: number) => {
  return Number.parseFloat(
    new bigDecimal(value.toString())
      .divide(new bigDecimal(decimals), 8)
      .getValue()
      .toString()
  );
};

/**
 * @param solStopConditions
 * @returns
 */
export const convertToAptosStopCondition = (
  solStopConditions: SolStopConditionsOnChain[],
  baseTokenDecimals: number,
  targetTokenDecimals: number,
  realBaseTokenDecimals: number,
  realTargetTokenDecimals: number
): [AutoCloseConditionClosedWithAptos, bigint][] => {
  return solStopConditions.map((condition) => {
    const type = Object.keys(condition)[0];
    let conditionOperator: AutoCloseConditionClosedWithAptos;
    let aptosValue;
    switch (type) {
      case "endTimeReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_END_TIME;
        aptosValue = (condition as any)[type]?.value?.toString();
        break;
      case "batchAmountReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_BATCH_AMOUNT;
        break;
      case "spentBaseTokenAmountReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_SPENT_BASE_AMOUNT;
        const solReverd = devideBigNumber(
          condition[type].value,
          Math.pow(10, baseTokenDecimals)
        );
        aptosValue = convertBigNumber(solReverd, 10 ** realBaseTokenDecimals);
        break;
      case "quoteTokenAmountReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_RECEIVED_TARGET_AMOUNT;
        const solReverd1 = devideBigNumber(
          condition[type].value,
          Math.pow(10, targetTokenDecimals)
        );
        aptosValue = convertBigNumber(
          solReverd1,
          10 ** realTargetTokenDecimals
        );
        break;
    }
    return [conditionOperator, aptosValue];
  });
};

/**
 * @param
 */
export const convertToAptosBuyCondition = (
  solBuyCondition: SolBuyConditionOnChain,
  targetTokenDecimals: number,
  realTargetTokenDecimals: number
): [OpenPositionOperatorAptos, bigint, bigint] => {
  let operator: OpenPositionOperatorAptos;
  if (!solBuyCondition || !Object.keys(solBuyCondition)?.length) {
    return [OpenPositionOperatorAptos.UNSET, BigInt(0), BigInt(0)];
  }

  const type = Object.keys(solBuyCondition)[0];
  switch (type) {
    case PriceConditionType.GT:
      operator = OpenPositionOperatorAptos.OPERATOR_GT;
      break;
    case PriceConditionType.GTE:
      operator = OpenPositionOperatorAptos.OPERATOR_GTE;
      break;
    case PriceConditionType.LT:
      operator = OpenPositionOperatorAptos.OPERATOR_LT;
      break;
    case PriceConditionType.LTE:
      operator = OpenPositionOperatorAptos.OPERATOR_LTE;
      break;
    case PriceConditionType.BW:
      operator = OpenPositionOperatorAptos.OPERATOR_BW;
      break;
    case PriceConditionType.NBW:
      operator = OpenPositionOperatorAptos.OPERATOR_NBW;
      break;
    case PriceConditionType.EQ:
      operator = OpenPositionOperatorAptos.OPERATOR_EQ;
      break;
    case PriceConditionType.NEQ:
      operator = OpenPositionOperatorAptos.OPERATOR_NEQ;
      break;
  }

  if (solBuyCondition[type].fromValue) {
    const fromValueReverted = devideBigNumber(
      solBuyCondition[type].fromValue,
      Math.pow(10, targetTokenDecimals)
    );
    const toValueReverted = devideBigNumber(
      solBuyCondition[type].toValue,
      Math.pow(10, targetTokenDecimals)
    );
    return [
      operator,
      convertBigNumber(fromValueReverted, 10 ** realTargetTokenDecimals),
      convertBigNumber(toValueReverted, 10 ** realTargetTokenDecimals),
    ];
  } else {
    const valueReverted = devideBigNumber(
      solBuyCondition[type].value,
      Math.pow(10, targetTokenDecimals)
    );
    return [
      operator,
      convertBigNumber(valueReverted, 10 ** realTargetTokenDecimals),
      convertBigNumber(valueReverted, 10 ** realTargetTokenDecimals),
    ];
  }
};

/**
 * @dev The function to convert data from sol chain to eth chain.
 * @param solCreatedPocketDto
 * @param baseTokenDecimals
 * @param targetTokenDecimals
 * @param realBaseTokenDecimals
 * @param realTargetTokenDecimals
 * @param walletAddress
 * @returns
 */
export const createdPocketPramsParserAptos = (
  aptosWhiteLists: { [key: string]: WhitelistEntity },
  solCreatedPocketDto: SolCreatePocketDto,
  baseTokenDecimals: number,
  targetTokenDecimals: number,
  realBaseTokenDecimals: number,
  realTargetTokenDecimals: number,
  depositedAmount: number,
  stopLossAmount: number,
  takeProfitAmount: number
): [CreatePocketParamsAptos, DepositParams] => {
  return [
    {
      id: solCreatedPocketDto.id,

      /**
       * @dev Desired universal router based on evm chain id.
       */
      amm: AMM.PCS,

      /**
       * @dev Convert sol public key to eth string address.
       */
      baseCoinType:
        aptosWhiteLists[
          solCreatedPocketDto.baseTokenAddress.toBase58().toString()
        ].address,

      /**
       * @dev Convert sol public key to eth string address.
       */
      targetCoinType:
        aptosWhiteLists[
          solCreatedPocketDto.quoteTokenAddress.toBase58().toString()
        ].address,

      /**
       * @dev Convert big number which already convert before to default.
       */
      startAt: BigInt(solCreatedPocketDto.startAt.toString()),
      frequency: BigInt(
        solCreatedPocketDto.frequency?.hours?.toNumber()?.toString() * 3600
      ),

      /**
       * @dev Revert value from alias decimals to real decimals.
       */
      batchVolume: convertBigNumber(
        devideBigNumber(
          solCreatedPocketDto.batchVolume,
          Math.pow(10, baseTokenDecimals)
        ),
        Math.pow(10, realBaseTokenDecimals)
      ),

      /**
       * @dev Convert stop conditions type in sol to Aptos.
       */
      autoClosedConditions: convertToAptosStopCondition(
        solCreatedPocketDto.stopConditions,
        baseTokenDecimals,
        targetTokenDecimals,
        realBaseTokenDecimals,
        realTargetTokenDecimals
      ),

      /**
       * @dev Convert buy conditions in sol chain to Aptos.
       */
      openPositionCondition: convertToAptosBuyCondition(
        solCreatedPocketDto.buyCondition,
        targetTokenDecimals,
        realTargetTokenDecimals
      ),
      stopLossCondition:
        stopLossAmount === 0
          ? [StopConditionStoppedWithAptos.UNSET, BigInt(0)]
          : [
              StopConditionStoppedWithAptos.STOPPED_WITH_PRICE,
              convertBigNumber(stopLossAmount, 10 ** realBaseTokenDecimals),
            ],
      takeProfitCondition:
        takeProfitAmount === 0
          ? [StopConditionStoppedWithAptos.UNSET, BigInt(0)]
          : [
              StopConditionStoppedWithAptos.STOPPED_WITH_PRICE,
              convertBigNumber(takeProfitAmount, 10 ** realBaseTokenDecimals),
            ],
    },
    {
      id: solCreatedPocketDto.id,
      coinType:
        aptosWhiteLists[
          solCreatedPocketDto.baseTokenAddress.toBase58().toString()
        ].address,
      amount: convertBigNumber(depositedAmount, 10 ** realBaseTokenDecimals),
    },
  ];
};

/**
 * @dev The function to convert list of tokens in evm to support sol chain.
 */
export const makeAliasForAptosWhitelist = (
  source: WhitelistEntity[],
  chainId: ChainId
): WhitelistEntity[] => {
  /**
   * @dev Filter based on chainId.
   */
  let evmFilerted = source.filter((item) => item.chainId !== ChainId.sol);
  evmFilerted = evmFilerted.filter((item) => item.chainId === chainId);

  /**
   * @dev Make alias for properties.
   */
  evmFilerted = evmFilerted.map((item) => {
    return {
      ...item,
      aliasAddress: !item?.isNativeCoin
        ? Keypair.generate().publicKey.toBase58().toString()
        : WSOL_ADDRESS,
      realDecimals: item.decimals,
      decimals: 9,
    };
  });
  return evmFilerted;
};
