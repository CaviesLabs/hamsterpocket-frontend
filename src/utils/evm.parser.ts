import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";
import { CreatePocketDto as SolCreatePocketDto } from "@/src/dto/pocket.dto";
import { BigNumber } from "ethers";
import {
  ethWhiteLists,
  BSC_UNIVERSAL_ROUTER,
  MATIC_UNIVERSAL_ROUTER,
} from "@/src/utils";
import {
  BuyConditionOnChain as SolBuyConditionOnChain,
  StopConditionsOnChain as SolStopConditionsOnChain,
  PriceConditionType,
} from "@/src/entities/pocket.entity";

/**
 * @dev The function to convert number to big ether number.
 */
export const convertToEtherBigNumber = (value: number) =>
  BigNumber.from(value.toString());

/**
 * @param solStopConditions
 * @returns
 */
export const convertToEtherStopCondition = (
  solStopConditions: SolStopConditionsOnChain[],
  baseTokenDecimals: number,
  targetTokenDecimals: number,
  realBaseTokenDecimals: number,
  realTargetTokenDecimals: number
) => {
  return solStopConditions.map((condition) => {
    const type = Object.keys(condition)[0];
    let conditionOperator;
    let ethValue;
    switch (type) {
      case "endTimeReach":
        conditionOperator = "0";
        break;
      case "batchAmountReach":
        conditionOperator = "1";
        break;
      case "spentBaseTokenAmountReach":
        conditionOperator = "2";
        const solReverd =
          condition[type].value.toNumber() / Math.pow(10, baseTokenDecimals);
        const ethReverd = solReverd * Math.pow(10, realBaseTokenDecimals);
        ethValue = convertToEtherBigNumber(ethReverd);
        break;
      case "quoteTokenAmountReach":
        conditionOperator = "3";
        const solReverd1 =
          condition[type].value.toNumber() / Math.pow(10, targetTokenDecimals);
        const ethReverd1 = solReverd1 * Math.pow(10, realTargetTokenDecimals);
        ethValue = convertToEtherBigNumber(ethReverd1);
        break;
    }
    console.log(type);
    console.log(conditionOperator);
    return {
      operator: conditionOperator,
      value: ethValue,
    };
  });
};

/**
 * @param
 */
export const convertToEtherBuyCondition = (
  solBuyCondition: SolBuyConditionOnChain,
  baseTokenDecimals: number,
  realBaseTokenDecimals: number
) => {
  let operator;
  const type = Object.keys(solBuyCondition)[0];

  switch (type) {
    case PriceConditionType.GT:
      operator = "1";
      break;
    case PriceConditionType.GTE:
      operator = "2";
      break;
    case PriceConditionType.LT:
      operator = "3";
      break;
    case PriceConditionType.LTE:
      operator = "4";
      break;
    case PriceConditionType.BW:
      operator = "5";
      break;
    case PriceConditionType.NBW:
      operator = "6";
      break;
  }

  if (solBuyCondition[type].fromValue) {
    return {
      operator,
      value0: convertToEtherBigNumber(
        (solBuyCondition[type].fromValue.toNumber() /
          Math.pow(10, baseTokenDecimals)) *
          Math.pow(10, realBaseTokenDecimals)
      ),
      value1: convertToEtherBigNumber(
        (solBuyCondition[type].toValue.toNumber() /
          Math.pow(10, baseTokenDecimals)) *
          Math.pow(10, realBaseTokenDecimals)
      ),
    };
  } else {
    return {
      operator,
      value0: convertToEtherBigNumber(
        (solBuyCondition[type].value.toNumber() /
          Math.pow(10, baseTokenDecimals)) *
          Math.pow(10, realBaseTokenDecimals)
      ),
      value1: convertToEtherBigNumber(
        (solBuyCondition[type].value.toNumber() /
          Math.pow(10, baseTokenDecimals)) *
          Math.pow(10, realBaseTokenDecimals)
      ),
    };
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
export const createdPocketPramsParserEvm = (
  solCreatedPocketDto: SolCreatePocketDto,
  baseTokenDecimals: number,
  targetTokenDecimals: number,
  realBaseTokenDecimals: number,
  realTargetTokenDecimals: number,
  walletAddress: string
): Params.CreatePocketParamsStruct => {
  console.log(new Date(solCreatedPocketDto.startAt.toNumber() * 1000));
  return {
    id: solCreatedPocketDto.id,
    owner: walletAddress,

    /**
     * @dev Desired universal router based on evm chain id.
     */
    ammRouterAddress:
      process.env.EVM_CHAIN_ID === "matic"
        ? MATIC_UNIVERSAL_ROUTER
        : BSC_UNIVERSAL_ROUTER,

    /**
     * @dev Convert sol public key to eth string address.
     */
    baseTokenAddress:
      ethWhiteLists[solCreatedPocketDto.baseTokenAddress.toBase58().toString()]
        .address,

    /**
     * @dev Convert sol public key to eth string address.
     */
    targetTokenAddress:
      ethWhiteLists[solCreatedPocketDto.quoteTokenAddress.toBase58().toString()]
        .address,

    startAt: solCreatedPocketDto.startAt.toNumber().toString(),

    /**
     * @dev Revert value from alias decimals to real decimals.
     */
    batchVolume: BigNumber.from(
      (
        (solCreatedPocketDto.batchVolume.toNumber() /
          Math.pow(10, baseTokenDecimals)) *
        Math.pow(10, realBaseTokenDecimals)
      ).toString()
    ),

    /**
     * @dev Convert stop conditions type in sol to eth.
     */
    stopConditions: convertToEtherStopCondition(
      solCreatedPocketDto.stopConditions,
      baseTokenDecimals,
      targetTokenDecimals,
      realBaseTokenDecimals,
      realTargetTokenDecimals
    ),

    /**
     * @dev Convert big number which already convert before to default.
     */
    frequency: `${
      solCreatedPocketDto.frequency?.hours?.toNumber()?.toString() * 3600
    }`,
    openingPositionCondition: convertToEtherBuyCondition(
      solCreatedPocketDto.buyCondition,
      baseTokenDecimals,
      realBaseTokenDecimals
    ),
    takeProfitCondition: {
      stopType: "0",
      value: "0",
    },
    stopLossCondition: {
      stopType: "0",
      value: "0",
    },
  };
};
