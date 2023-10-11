import bigDecimal from "js-big-decimal";

import { toBigInt } from "ethers";
import { Keypair } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { WSOL_ADDRESS } from "@/src/utils";
import { ChainId } from "@/src/entities/platform-config.entity";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { CreatePocketDto as SolCreatePocketDto } from "@/src/dto/pocket.dto";
import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";

import {
  PriceConditionType,
  BuyConditionOnChain as SolBuyConditionOnChain,
  StopConditionsOnChain as SolStopConditionsOnChain,
} from "@/src/entities/pocket.entity";

/**
 * @dev The function to convert number to big ether number.
 */
export const convertBigNumber = (value: number | BN, decimals: number) => {
  return toBigInt(
    `0x${parseInt(
      bigDecimal.multiply(parseFloat(value.toString()), decimals)
    ).toString(16)}`
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
      .divide(new bigDecimal(decimals), 20)
      .getValue()
      .toString()
  );
};

/**
 * @dev The function to multiple big number.
 * @param value
 * @param decimals
 * @returns
 */
export const multipleBigNumber = (value: number | BN, decimals: number) => {
  return new bigDecimal(value.toString())
    .multiply(new bigDecimal(decimals))
    .getValue()
    .toString();
};

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
        ethValue = (condition as any)[type]?.value?.toNumber()?.toString();
        break;
      case "batchAmountReach":
        conditionOperator = "1";
        break;
      case "spentBaseTokenAmountReach":
        conditionOperator = "2";
        const solReverd = devideBigNumber(
          condition[type].value,
          Math.pow(10, baseTokenDecimals)
        );
        ethValue = convertBigNumber(solReverd, 10 ** realBaseTokenDecimals);
        break;
      case "quoteTokenAmountReach":
        conditionOperator = "3";
        const solReverd1 = devideBigNumber(
          condition[type].value,
          Math.pow(10, targetTokenDecimals)
        );
        ethValue = convertBigNumber(solReverd1, 10 ** realTargetTokenDecimals);
        break;
    }
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
  targetTokenDecimals: number,
  realTargetTokenDecimals: number
) => {
  let operator;
  if (!solBuyCondition || !Object.keys(solBuyCondition)?.length) {
    return {
      operator: "0",
      value0: "0",
      value1: "0",
    };
  }

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
    const fromValueReverted = devideBigNumber(
      solBuyCondition[type].fromValue,
      Math.pow(10, targetTokenDecimals)
    );
    const toValueReverted = devideBigNumber(
      solBuyCondition[type].toValue,
      Math.pow(10, targetTokenDecimals)
    );
    return {
      operator,
      value0: convertBigNumber(
        fromValueReverted,
        10 ** realTargetTokenDecimals
      ),
      value1: convertBigNumber(toValueReverted, 10 ** realTargetTokenDecimals),
    };
  } else {
    const valueReverted = devideBigNumber(
      solBuyCondition[type].value,
      Math.pow(10, targetTokenDecimals)
    );
    return {
      operator,
      value0: convertBigNumber(valueReverted, 10 ** realTargetTokenDecimals),
      value1: convertBigNumber(valueReverted, 10 ** realTargetTokenDecimals),
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
  ethWhiteLists: { [key: string]: WhitelistEntity },
  solCreatedPocketDto: SolCreatePocketDto,
  baseTokenDecimals: number,
  targetTokenDecimals: number,
  realBaseTokenDecimals: number,
  realTargetTokenDecimals: number,
  walletAddress: string,
  ammRouterAddress: string,
  ammRouterVersion: string
): Params.CreatePocketParamsStruct => {
  return {
    id: solCreatedPocketDto.id,
    owner: walletAddress,

    /**
     * @dev Desired universal router based on evm chain id.
     */
    ammRouterVersion: ammRouterVersion,
    ammRouterAddress: ammRouterAddress,

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
    batchVolume: convertBigNumber(
      devideBigNumber(
        solCreatedPocketDto.batchVolume,
        Math.pow(10, baseTokenDecimals)
      ),
      Math.pow(10, realBaseTokenDecimals)
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
      targetTokenDecimals,
      realTargetTokenDecimals
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

/**
 * @dev The function to convert list of tokens in evm to support sol chain.
 */
export const makeAliasForEvmWhitelist = (
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

  console.debug({ evmFilerted });
  return evmFilerted;
};
