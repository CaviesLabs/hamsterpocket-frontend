import {
  FC,
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { whitelistService } from "@/src/services/whitelist.service";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { LiquidityEntity } from "@/src/entities/radyum.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { makeAliasForEvmWhitelist } from "@/src/utils/evm.parser";
import Decimal from "decimal.js";
import useSWR from "swr";

export type WhiteListConfigs = {
  [key: string]: WhitelistEntity;
};

/** @dev Initiize context. */
export const WhitelistContext = createContext<{
  whiteLists: WhiteListConfigs;
  liquidities: LiquidityEntity[];
  convertDecimalAmount(tokenAddress: string, source: number): number;
  analyzeDecimals(veryComplexDecimalsValue: number): ReactNode;

  /**
   * @dev The function find entitiy base real address.
   * @param address {token address}
   */
  findEntityByAddress(address: string): WhitelistEntity;

  /**
   * @dev The function handle to get qoute and base token.
   * @param string {baseTokenAddress}
   * @param string {targetTokenAddress}
   * @returns {Array[baseToken, qouteToken, marketId]}
   */
  findPairLiquidity(
    baseTokenAddress: string,
    targetTokenAddress: string
  ): [string, string, string, number];
}>(null);

export const WhitelistProvider: FC<{ children: ReactNode }> = (props) => {
  const [whiteLists, setWhitelist] = useState<WhiteListConfigs>({});

  /** @dev Inject wallet account info. */
  const { chainId } = usePlatformConfig();

  /** @dev Fetch market data. */
  const { data: liquidities } = useSWR(
    `${process.env.API_URL}/whitelist/market`,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => res as LiquidityEntity[])
  );

  /**
   * @dev Get whitelist data from Hamster server when first load.
   */
  useEffect(() => {
    (async () => {
      try {
        /** @dev Fetch whitelist in sol chain. */
        const result = await whitelistService.getWhitelist();
        if (chainId === ChainId.sol) {
          const res: WhiteListConfigs = {};
          result.forEach((_) => {
            /** desc Convert Wrapped SOL to SOL */
            if (_.name === "Wrapped SOL") {
              _.name = "SOL";
            }
            res[_.address] = _;
          });
          setWhitelist(res);
        } else {
          const processedList = makeAliasForEvmWhitelist(result, chainId);
          const res: WhiteListConfigs = {};
          processedList.forEach((_) => {
            res[_.aliasAddress] = _;
          });
          setWhitelist(res);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [chainId]);

  /**
   * @dev The function to find pair liquidity data.
   * @returns ppair[]
   */
  const findPairLiquidity = useCallback(
    (
      baseTokenAddress: string,
      targetTokenAddress: string
    ): [string, string, string, number] => {
      /** Find ppair available liquidity pool. */
      const ppair = [
        liquidities.find(
          (item) =>
            item?.baseMint === baseTokenAddress &&
            item?.quoteMint === targetTokenAddress
        ) || null,
        liquidities.find(
          (item) =>
            item?.baseMint === targetTokenAddress &&
            item?.quoteMint === baseTokenAddress
        ) || null,
      ].filter((item) => item !== null)?.[0];
      return [
        ppair.baseMint || "",
        ppair.quoteMint || "",
        ppair.marketId,
        ppair.minOrderSizeForBaseMint,
      ];
    },
    [liquidities]
  );

  /**
   * @dev The function find entitiy base real address.
   * @param address {token address}
   */
  const findEntityByAddress = useCallback(
    (address: string) => {
      const keyFound = Object.keys(whiteLists).find(
        (key) =>
          whiteLists[key]?.address?.toLowerCase() === address?.toLowerCase()
      );

      return keyFound ? whiteLists[keyFound] : null;
    },
    [whiteLists, chainId]
  );

  /**
   * @dev The function to convert amount of token to normal number by dividing its decimals.
   */
  const convertDecimalAmount = useCallback(
    (tokenAddress: string, source: number) => {
      const tokenEntity =
        whiteLists[tokenAddress] || findEntityByAddress(tokenAddress);
      return (
        source /
        Math.pow(10, tokenEntity?.realDecimals || tokenEntity?.decimals || 1)
      );
    },
    [whiteLists, chainId, findEntityByAddress]
  );

  /**
   * @notice Analyze decimals for smart display
   * @param veryComplexDecimalsValue
   */
  const analyzeDecimals = (veryComplexDecimalsValue: number): ReactNode => {
    if (!veryComplexDecimalsValue) return null;
    const valueStr = new Decimal(veryComplexDecimalsValue)?.toFixed();
    const newStr = valueStr.replace(/(0)+$/, "");
    const zeroMatched = newStr.match(/\.(0)+/);

    if (!zeroMatched || zeroMatched[0]?.replace(".", "").split("").length < 3) {
      return (
        <span className="mx-[3px]">
          {veryComplexDecimalsValue?.toFixed(5).replace(/0+$/, "")}
        </span>
      );
    }

    const baseValue = newStr.split(".")[0];
    const [matchedStr] = zeroMatched;
    const totalZero = matchedStr.replace(".", "").split("").length;
    const restValue = newStr.replace(`${baseValue}${matchedStr}`, "");
    return (
      <span className="mx-[3px]">
        {baseValue}.0<sub>{totalZero}</sub>
        {(restValue.length > 5 ? restValue.substring(0, 5) : restValue).replace(
          /0+$/,
          ""
        )}
      </span>
    );
  };

  return (
    <WhitelistContext.Provider
      value={{
        whiteLists,
        liquidities,
        convertDecimalAmount,
        findPairLiquidity,
        findEntityByAddress,
        analyzeDecimals,
      }}
    >
      {props.children}
    </WhitelistContext.Provider>
  );
};

/** @dev Export use context function */
export const useWhiteList = () => {
  const context = useContext(WhitelistContext);
  if (context === undefined) {
    throw new Error("Muse be in context provider");
  }
  return context;
};
