import { CreatePocketDto as SolCreatePocketDto } from "@/src/dto/pocket.dto";
import {
  BuyConditionOnChain as SolBuyConditionOnChain,
  StopConditionsOnChain as SolStopConditionsOnChain,
  PriceConditionType,
} from "@/src/entities/pocket.entity";
import {
  CreatePocketParams as CreatePocketParamsAptos,
  DepositParams,
} from "@/src/providers/program/aptos/params.type";
import {
  AMM,
  AutoCloseConditionClosedWith as AutoCloseConditionClosedWithAptos,
  OpenPositionOperator as OpenPositionOperatorAptos,
  StopConditionStoppedWith as StopConditionStoppedWithAptos,
} from "@/src/providers/program/aptos/entities/pocket.entity";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { Keypair } from "@solana/web3.js";
import { WSOL_ADDRESS } from "@/src/utils";
import { ChainId } from "@/src/entities/platform-config.entity";
import bigDecimal from "js-big-decimal";

export const convertBigNumber = (value: number, decimals: number) => {
  return BigInt(`${parseInt(bigDecimal.multiply(value, decimals))}`);
  // if (decimals > 10 ** 10) {
  //   return BigInt(
  //     `0x${parseInt(bigDecimal.multiply(value, decimals)).toString(16)}`
  //   );
  // } else {
  //   return BigInt(
  //     `0x${parseInt(bigDecimal.multiply(value, decimals)).toString(16)}`
  //   );
  // }
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
        aptosValue = (condition as any)[type]?.value?.toNumber()?.toString();
        break;
      case "batchAmountReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_BATCH_AMOUNT;
        break;
      case "spentBaseTokenAmountReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_SPENT_BASE_AMOUNT;
        const solReverd =
          condition[type].value.toNumber() / Math.pow(10, baseTokenDecimals);
        aptosValue = convertBigNumber(solReverd, 10 ** realBaseTokenDecimals);
        break;
      case "quoteTokenAmountReach":
        conditionOperator =
          AutoCloseConditionClosedWithAptos.CLOSED_WITH_RECEIVED_TARGET_AMOUNT;
        const solReverd1 =
          condition[type].value.toNumber() / Math.pow(10, targetTokenDecimals);
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
  }

  if (solBuyCondition[type].fromValue) {
    const fromValueReverted =
      solBuyCondition[type].fromValue.toNumber() /
      Math.pow(10, targetTokenDecimals);
    const toValueReverted =
      solBuyCondition[type].toValue.toNumber() /
      Math.pow(10, targetTokenDecimals);
    return [
      operator,
      convertBigNumber(fromValueReverted, 10 ** realTargetTokenDecimals),
      convertBigNumber(toValueReverted, 10 ** realTargetTokenDecimals),
    ];
  } else {
    const valueReverted =
      solBuyCondition[type].value.toNumber() /
      Math.pow(10, targetTokenDecimals);
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
  depositedAmount: number
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
      startAt: BigInt(solCreatedPocketDto.startAt.toNumber().toString()),
      frequency: BigInt(
        solCreatedPocketDto.frequency?.hours?.toNumber()?.toString() * 3600
      ),

      /**
       * @dev Revert value from alias decimals to real decimals.
       */
      batchVolume: BigInt(
        (
          (solCreatedPocketDto.batchVolume.toNumber() /
            Math.pow(10, baseTokenDecimals)) *
          Math.pow(10, realBaseTokenDecimals)
        ).toString()
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
      stopLossCondition: [StopConditionStoppedWithAptos.UNSET, BigInt(0)],
      takeProfitCondition: [StopConditionStoppedWithAptos.UNSET, BigInt(0)],
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
