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
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

export type WhiteListConfigs = {
  [key: string]: WhitelistEntity;
};

/** @dev Initiize context. */
export const WhitelistContext = createContext<{
  whiteLists: WhiteListConfigs;
  convertDecimalAmount(tokenAddress: string, source: number): number;
}>(null);

export const WhitelistProvider: FC<{ children: ReactNode }> = (props) => {
  const [whiteLists, setWhitelist] = useState<WhiteListConfigs>({});

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

  /**
   * @dev The function to convert amount of token to normal number by dividing its decimals.
   */
  const convertDecimalAmount = useCallback(
    (tokenAddress: string, source: number) => {
      return source / Math.pow(10, whiteLists[tokenAddress]?.decimals || 1);
    },
    [whiteLists]
  );

  return (
    <WhitelistContext.Provider
      value={{
        whiteLists,
        convertDecimalAmount,
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
