import { ReactNode, useCallback, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { DurationObjectUnits } from "luxon";
import { BuyCondition, StopConditions } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { CreatePocketContext } from "./types";
import { BN } from "@project-serum/anchor";
import { ProgramService } from "@/src/services/program.service";
import {
  WSOL_ADDRESS,
  ALIAS_WMATIC_ADDRESS,
  convertDurationsTimeToHours,
  processStopConditions,
} from "@/src/utils";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { ErrorValidateContext } from "./useValidate";
import { SideMethod } from "@/src/dto/pocket.dto";
import { union } from "lodash";
import { CreatePocketDto as SolCreatePocketDto } from "@/src/dto/pocket.dto";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import {
  createdPocketPramsParserEvm,
  convertBigNumber,
  multipleBigNumber,
} from "@/src/utils/evm.parser";
import { useAptosWallet } from "@/src/hooks/useAptos";
import bigDecimal from "js-big-decimal";
import { toast } from "@hamsterbox/ui-kit";

export const CreatePocketProvider = (props: { children: ReactNode }) => {
  /** @dev Inject wallet provider. */
  const { solanaWallet, programService } = useWallet();

  /** @dev Inject app wallet to get both sol & eth account info. */
  const { walletAddress, balance } = useAppWallet();
  const { chainId, pushRouterWithChainId, platformConfig } =
    usePlatformConfig();

  /** @dev Inject eth function. */
  const { createPocket: createEvmPocket, signer: evmSigner } = useEvmWallet();

  /** @dev Inject aptos function. */
  const { createPocket: createAptosPocket } = useAptosWallet();

  /** @dev Inject functions from whitelist hook to use. */
  const { findPairLiquidity, findEntityByAddress, liquidities, whiteLists } =
    useWhiteList();

  const [pocketName, setPocketName] = useState("");
  const [baseTokenAddress, setBaseTokenAddress] = useState<[PublicKey, number]>(
    [new PublicKey(WSOL_ADDRESS), 9]
  );
  const [batchVolume, setBatchVolume] = useState<number>(0);
  const [startAt, setStartAt] = useState<Date>(new Date());
  const [buyCondition, setBuyCondition] = useState<BuyCondition>();
  const [stopConditions, setStopConditions] = useState<StopConditions[]>([]);
  const [depositedAmount, setDepositedAmount] = useState<number>(0);
  const [takeProfitAmount, setTakeProfitAmount] = useState<number>(0);
  const [stopLossAmount, setStopLossAmount] = useState<number>(0);
  const [createdEnable, setCreatedEnable] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<ErrorValidateContext>();
  const [targetTokenAddress, setTargetTokenAddress] = useState<
    [PublicKey?, number?]
  >([]);

  /** @dev Mint batch amount volume. */
  const [mintOrderSize, setMintOrderSize] = useState(0);

  /** @dev Avalabible tokens when choose base. */
  const [availableBaseTokens, setAvailableBaseTokens] = useState<string[]>([]);

  /** @dev Avalabible tokens when choose target. */
  const [availableTargetTokens, setAvailableTargetTokens] = useState<string[]>(
    []
  );

  /** @dev Default is every day */
  const [frequency, setFrequency] = useState<DurationObjectUnits>({ hours: 1 });

  /** @dev Define variable presenting for successful pocket creation. */
  const [successCreated, setSuccessCreated] = useState(false);

  /** @dev Define variable presenting whenther program is creating pool. */
  const [processing, setProcessing] = useState(false);

  /** @dev The function to validate. */
  const validateForms = useCallback(() => {
    return (
      Object.keys(errorMsgs).filter(
        (key) => errorMsgs?.[key as keyof ErrorValidateContext]
      ).length === 0
    );
  }, [errorMsgs]);

  /** @dev The function to modify stop conditions. */
  const handleModifyStopConditions = useCallback(
    (key: keyof StopConditions, value: any | "delete", primary = false) => {
      setStopConditions((prev) => {
        if (value === "delete") {
          const wantDelete = prev.find((item) => item[key] !== undefined);
          const wantDeletePrimary = wantDelete?.[key]?.primary;
          let updatedPrimary = false;
          return prev
            .filter((item) => item[key] === undefined)
            .map((condition: any) => {
              if (wantDeletePrimary && !updatedPrimary) {
                const fKey = Object.keys(condition)?.[0];
                updatedPrimary = true;
                return {
                  ...condition,
                  [fKey]: {
                    value: condition?.[fKey]?.value,
                    primary: true,
                  },
                };
              }
              return condition;
            });
        }

        /** @dev Filter condition not contains key. */
        let filteredConditions = prev.filter((item) => item[key] === undefined);
        filteredConditions = filteredConditions.map((condition: any) => {
          const fKey = Object.keys(condition)?.[0];
          return {
            [fKey]: {
              value: condition[fKey]?.value,
              primary:
                condition[fKey]?.primary !== undefined
                  ? primary
                    ? false
                    : condition[fKey]?.primary
                  : false,
            },
          };
        });

        /** @dev The function to handle update primary. */
        const checkPrimary = () => {
          if (!primary) {
            if (
              !filteredConditions.filter((condition: any) => {
                const fKey = Object.keys(condition)[0];
                return condition?.[fKey]?.primary;
              }).length
            ) {
              return true;
            }
          }
          return primary;
        };

        return [
          ...filteredConditions,
          { [key]: { value, primary: checkPrimary() } },
        ];
      });
    },
    [stopConditions]
  );

  /** @dev The function to execute pocket creation. */
  const handleCreatePocket = useCallback(async () => {
    try {
      /** @dev Enable UX when processing. */
      setProcessing(true);

      /** @dev Turn createdEnable when first click to create. */
      !createdEnable && setCreatedEnable(true);

      /** @dev Return when wallet not connected. */
      if (!walletAddress) return;

      /** @dev Validate if all form be valid. */
      if (!validateForms()) {
        throw new Error("NOT::VALIDATION");
      }

      /** @dev Check if sufficient funds to create or not. */
      if (
        new bigDecimal(balance).compareTo(new bigDecimal(depositedAmount)) < 0
      ) {
        toast.error(
          "Insufficient funds to create pocket, transfer more funds to your wallet and try again.",
          { theme: "dark" }
        );
        throw new Error("INSUFFICIENT_FUNDS");
      }

      /** @dev Convert address to string. */
      const [baseAddress, targetAddress] = await Promise.all([
        baseTokenAddress[0]?.toBase58().toString(),
        targetTokenAddress[0]?.toBase58().toString(),
      ]);

      /** @dev Get base and qoute address in liquidity pool. */
      let liqQuote;
      let marketId = "1111";
      let sideMethod: SideMethod = { sell: {} };

      if (chainId === ChainId.sol) {
        const [liqBase, _liqQuote, _marketId] = findPairLiquidity(
          baseAddress,
          targetAddress
        );

        /** @dev Desire for global vars. */
        liqQuote = _liqQuote;
        marketId = _marketId;

        /** @dev Handle to attract side method of pool.  */
        sideMethod = liqBase === baseAddress ? { sell: {} } : { buy: {} };
      }

      /** @dev Process stopConditions. */
      const processedStopConditions = stopConditions.map((condition) =>
        processStopConditions(condition, sideMethod)
      );

      /**
       * @dev Initalize pocket data for sol blockchain.
       */
      const solCreatedPocketData: SolCreatePocketDto = {
        id: ProgramService.generatePocketId(),
        name: pocketName,
        baseTokenAddress: new PublicKey(baseAddress),
        quoteTokenAddress: new PublicKey(
          chainId === ChainId.sol ? liqQuote : targetAddress
        ),
        startAt: new BN(
          parseInt((startAt.getTime() / 1000).toString()).toString()
        ),
        frequency: convertDurationsTimeToHours(frequency),
        batchVolume: new BN(
          multipleBigNumber(batchVolume, Math.pow(10, baseTokenAddress[1]))
        ),
        depositedAmount: new BN(
          multipleBigNumber(depositedAmount, Math.pow(10, baseTokenAddress[1]))
        ),
        side: sideMethod,
        marketId,
        buyCondition: buyCondition
          ? {
              [buyCondition.type]: buyCondition?.fromValue
                ? {
                    fromValue: buyCondition.fromValue,
                    toValue: buyCondition.toValue,
                  }
                : {
                    value: buyCondition.value,
                  },
            }
          : null,
        stopConditions: processedStopConditions.map((item) => ({
          [Object.keys(item)[0]]: {
            value: (item as any)[Object.keys(item)[0] as string]?.value,
            isPrimary: (item as any)[Object.keys(item)[0] as string]?.primary,
          },
        })),
      };

      if (chainId === ChainId.sol) {
        /**
         * @dev Execute interact with solana blockchain.
         */
        const response = await programService.createPocket(
          solCreatedPocketData
        );

        console.log(response);
      } else if (!chainId.toLowerCase().includes("aptos")) {
        let exchange = platformConfig?.whitelistedRouters?.[0];

        /** @dev BNB chain default has two trading exchange, filter to use uniswap only. */
        if (chainId === ChainId.bnb) {
          exchange = platformConfig.whitelistedRouters.find(
            (item) => item.ammTag === "uniswap"
          );
        }

        /**
         * @dev Process data from sol for evm.
         */
        let evmParams = createdPocketPramsParserEvm(
          whiteLists,
          solCreatedPocketData,
          baseTokenAddress[1],
          targetTokenAddress[1],
          whiteLists[baseTokenAddress[0].toBase58().toString()]?.realDecimals,
          whiteLists[targetTokenAddress[0].toBase58().toString()]?.realDecimals,
          walletAddress,
          exchange?.address,
          exchange?.routerVersion
        );

        /** @dev Process to get deposited amount in evm decimals. */
        const plufixWithDecimals = Math.pow(
          10,
          whiteLists[baseTokenAddress[0].toBase58().toString()]?.realDecimals
        );
        const evmDespositedAmount = convertBigNumber(
          depositedAmount,
          plufixWithDecimals
        );

        if (takeProfitAmount) {
          const evmTakeProfitAmount = convertBigNumber(
            takeProfitAmount,
            plufixWithDecimals
          );
          evmParams = {
            ...evmParams,
            takeProfitCondition: {
              stopType: "1",
              value: evmTakeProfitAmount,
            },
          };
        }

        if (stopLossAmount) {
          const evmStopLossAmount = convertBigNumber(
            stopLossAmount,
            plufixWithDecimals
          );
          evmParams = {
            ...evmParams,
            stopLossCondition: {
              stopType: "1",
              value: evmStopLossAmount,
            },
          };
        }

        /**
         * @dev Execute interact with eth blockchain.
         */
        const response = await createEvmPocket(evmDespositedAmount, {
          ...evmParams,
        });
        console.log(response);
      } else {
        /**
         * @dev Execute creating on Aptos chain.
         */
        const response = await createAptosPocket(
          whiteLists,
          solCreatedPocketData,
          baseTokenAddress[1],
          targetTokenAddress[1],
          whiteLists[baseTokenAddress[0].toBase58().toString()]?.realDecimals,
          whiteLists[targetTokenAddress[0].toBase58().toString()]?.realDecimals,
          depositedAmount,
          stopLossAmount,
          takeProfitAmount
        );
        console.log({ response });
      }
      setSuccessCreated(true);
    } catch (err: any) {
      console.warn(err);
    } finally {
      /** @dev Disable UX after processing. */
      setProcessing(false);
    }
  }, [
    startAt,
    chainId,
    balance,
    frequency,
    evmSigner,
    pocketName,
    whiteLists,
    batchVolume,
    solanaWallet,
    buyCondition,
    createdEnable,
    walletAddress,
    stopLossAmount,
    stopConditions,
    platformConfig,
    depositedAmount,
    takeProfitAmount,
    baseTokenAddress,
    targetTokenAddress,
    validateForms,
  ]);

  /** @dev Update mint order size. */
  useEffect(() => {
    (async () => {
      if (
        !baseTokenAddress.length ||
        !targetTokenAddress.length ||
        chainId !== ChainId.sol
      )
        return;
      /** @dev Convert address to string. */
      const [baseAddress, targetAddress] = await Promise.all([
        baseTokenAddress[0]?.toBase58().toString(),
        targetTokenAddress[0]?.toBase58().toString(),
      ]);

      /** @dev Get base and qoute address in liquidity pool. */
      const ppair = findPairLiquidity(baseAddress, targetAddress);
      setMintOrderSize(ppair?.[3]);
    })();
  }, [baseTokenAddress, targetTokenAddress, chainId, findPairLiquidity]);

  /**
   * @dev Update base token when chain changed.
   */
  useEffect(() => {
    if (chainId !== ChainId.sol) {
      setBaseTokenAddress([new PublicKey(ALIAS_WMATIC_ADDRESS), 9]);
    }
  }, [chainId]);

  /**
   * @dev dynamically update a list of available base tokens based on
   * the available liquidity data.
   */
  useEffect(() => {
    setAvailableBaseTokens(() => {
      return union(
        liquidities?.map((item) => [item.baseMint, item.quoteMint]).flat(1)
      );
    });
  }, [liquidities]);

  /**
   * @dev dynamically update a list of available target tokens based on
   * the selected base token and the available liquidity data.
   */
  useEffect(() => {
    if (chainId !== ChainId.sol) {
      return setAvailableTargetTokens(() => {
        return Object.keys(whiteLists)
          .filter((address) => {
            return !whiteLists?.[address]?.isNativeCoin;
          })
          .reverse();
      });
    }
    setAvailableTargetTokens(() => {
      const tokenAddress = baseTokenAddress[0]?.toBase58()?.toString();
      const tokenInfo =
        whiteLists[tokenAddress] || findEntityByAddress(tokenAddress);
      return union(
        liquidities
          ?.filter(
            (item) =>
              item.baseMint === tokenInfo?.address ||
              item.quoteMint === tokenInfo?.address
          )
          .map((item) => [item.baseMint, item.quoteMint])
          .flat(1)
          .filter((item) => item !== baseTokenAddress[0].toBase58().toString())
      );
    });
  }, [liquidities, baseTokenAddress, chainId, whiteLists]);

  return (
    <CreatePocketContext.Provider
      value={{
        pocketName,
        baseTokenAddress,
        targetTokenAddress,
        batchVolume,
        startAt,
        frequency,
        buyCondition,
        stopConditions,
        depositedAmount,
        processing,
        createdEnable,
        errorMsgs,
        availableBaseTokens,
        availableTargetTokens,
        mintOrderSize,
        takeProfitAmount,
        stopLossAmount,
        setTakeProfitAmount,
        setStopLossAmount,
        setPocketName,
        setBaseTokenAddress,
        setTargetTokenAddress,
        setBatchVolume,
        setStartAt,
        setFrequency,
        setBuyCondition,
        setDepositedAmount,
        handleModifyStopConditions,
        handleCreatePocket,
        setErrorMsgs,
      }}
    >
      {props.children}
      <SuccessTransactionModal
        isModalOpen={successCreated}
        handleOk={() => pushRouterWithChainId("/my-pockets")}
        handleCancel={() => setSuccessCreated(false)}
        okMessage="Back to Home"
        message="You have created pocket and deposited successful"
      />
    </CreatePocketContext.Provider>
  );
};
