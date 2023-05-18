/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FC,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import {
  PlatformConfigEntity,
  ChainId,
} from "@/src/entities/platform-config.entity";
import useSWR from "swr";

export type WhiteListConfigs = {
  [key: string]: WhitelistEntity;
};

/** @dev Initiize context. */
export const PlatformConfigContext = createContext<{
  chainId: ChainId;
  platformConfig: PlatformConfigEntity;

  /**
   * @dev Override router function with chainId slug.
   */
  pushRouterWithChainId(uri: string): void;
  switchChainId(chainId: string): void;
}>(null);

export const PlatformConfigProvider: FC<{ children: ReactNode }> = (props) => {
  /** @dev Fetch market data. */
  const { data: platformConfig } = useSWR(
    `${process.env.API_URL}/platform-config`,
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((res) => res as { [key: string]: PlatformConfigEntity })
  );

  /** @dev Define desired chain id, @default bsc proxied router. */
  const [desiredChainId, setDesiredChainId] = useState<ChainId>(ChainId.bnb);
  const [
    platformConfigBasedDesiredChainId,
    setPlatformConfigBasedDesiredChainId,
  ] = useState<PlatformConfigEntity>();

  /** @dev Inject router. */
  const router = useRouter();

  useEffect(() => {
    const chainId = router.query?.chainId;
    console.log("desired route chainId", chainId);
    if (chainId) {
      setDesiredChainId(chainId as ChainId);
    }
  }, [router]);

  useEffect(() => {
    setPlatformConfigBasedDesiredChainId(platformConfig?.[desiredChainId]);
  }, [platformConfig, desiredChainId]);

  // router.asPath.indexOf("/", 1);
  // console.log(
  //   router.asPath.substring(router.asPath.indexOf("/", 1), router.asPath.length)
  // );

  return (
    <PlatformConfigContext.Provider
      value={{
        chainId: desiredChainId,
        platformConfig: platformConfigBasedDesiredChainId,
        switchChainId: (chainId: string) =>
          router.push(
            `/${chainId}/${router.asPath.substring(
              router.asPath.indexOf("/", 1),
              router.asPath.length
            )}`
          ),
        pushRouterWithChainId: (uri: "self" | string) =>
          router.push(
            uri === "self" ? router.asPath : `/${desiredChainId}${uri}`
          ),
      }}
    >
      {props.children}
    </PlatformConfigContext.Provider>
  );
};

/** @dev Export use context function */
export const usePlatformConfig = () => {
  const context = useContext(PlatformConfigContext);
  if (context === undefined) {
    throw new Error("Muse be in context provider");
  }
  return context;
};
