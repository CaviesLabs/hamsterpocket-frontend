import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { whitelistService } from "@/src/services/whitelist.service";
// import { radyumService } from "@/src/services/radyum.service";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { LiquidityEntity } from "@/src/entities/radyum.entity";
//useSWR allows the use of SWR inside function components
import useSWR from "swr";

export type WhiteListConfigs = {
  [key: string]: WhitelistEntity;
};

/** @dev Initiize context. */
export const WhitelistContext = createContext<{
  whiteLists: WhiteListConfigs;
  convertDecimalAmount(tokenAddress: string, source: number): number;
  findPairLiquidity(
    baseTokenAddress: string,
    targetTokenAddress: string
  ): LiquidityEntity;
}>(null);

export const WhitelistProvider: FC<{ children: ReactNode }> = (props) => {
  const [whiteLists, setWhitelist] = useState<WhiteListConfigs>({});

  const { data: liquidities } = useSWR("/api/liquidity-data", (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((res) => res as LiquidityEntity[])
  );

  // console.log(data, error);

  /**
   * @dev Get whitelist data from Hamster server when first load.
   */
  useEffect(() => {
    (async () => {
      try {
        const result = await whitelistService.getWhitelist();
        const res: WhiteListConfigs = {};
        result.forEach((_) => (res[_.address] = _));
        setWhitelist(res);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // /**
  //  * @dev The function to get liquidies data from Radyumm.
  //  */
  // useEffect(() => {
  //   (async () => {
  //     const res = await radyumService.getLiquidity();
  //     setLiquidities(res);
  //   })();
  // }, []);

  /**
   * @dev The function to convert amount of token to normal number by dividing its decimals.
   */
  const convertDecimalAmount = useCallback(
    (tokenAddress: string, source: number) => {
      return source / Math.pow(10, whiteLists[tokenAddress]?.decimals || 1);
    },
    [whiteLists]
  );

  /**
   * @dev The function to find pair liquidity data.
   */
  const findPairLiquidity = useCallback(
    (baseTokenAddress: string, targetTokenAddress: string) => {
      return liquidities.find(
        (item) =>
          item.baseMint === baseTokenAddress &&
          item.quoteMint === targetTokenAddress
      );
    },
    [liquidities]
  );

  return (
    <WhitelistContext.Provider
      value={{
        whiteLists,
        convertDecimalAmount,
        findPairLiquidity,
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
