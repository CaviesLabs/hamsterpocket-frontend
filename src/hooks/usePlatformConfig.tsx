/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FC,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
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

/** @dev Initialize context. */
export const PlatformConfigContext = createContext<{
  chainId: string;
  platformConfig: PlatformConfigEntity;
  chainInfos: { [key: string]: PlatformConfigEntity };

  /**
   * @dev Dex url based on platformConfig for each chains.
   */
  dexUrl: string;

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
  const [desiredChainId, setDesiredChainId] = useState<string>("");
  const [dexUrl, setDexUrl] = useState("");
  const [
    platformConfigBasedDesiredChainId,
    setPlatformConfigBasedDesiredChainId,
  ] = useState<PlatformConfigEntity>();

  /** @dev Inject router. */
  const router = useRouter();

  useEffect(() => {
    const chainId = router.query?.chainId;
    if (chainId) {
      setDesiredChainId(chainId as string);
    }
  }, [router]);

  /**
   * @dev Watch changes in desired id.
   */
  useEffect(() => {
    setPlatformConfigBasedDesiredChainId(platformConfig?.[desiredChainId]);

    const config = platformConfig?.[desiredChainId];
    if (config) {
      setDexUrl(() => {
        let dexUrl = config.whitelistedRouters?.[0]?.dexUrl;
        if (desiredChainId === ChainId.bnb) {
          dexUrl = config?.whitelistedRouters?.find(
            (item) => item.ammTag === "uniswap"
          )?.dexUrl;
        }

        return dexUrl;
      });
    }
  }, [platformConfig, desiredChainId, router]);

  /**
   * @dev The function to switch chain.
   * @params chainId.
   */
  const handleSwitchChain = useCallback(
    (chainId: string) => {
      if (!platformConfig) return;
      window.localStorage.setItem("chainId", chainId);

      const lastSlug = router.asPath.substring(
        router.asPath.indexOf("/", 1),
        router.asPath.length
      );

      /** @dev If home page. */
      const isHomePage = Object.keys(platformConfig).find(
        (item) => lastSlug === `/${item}` || lastSlug === `/${item}/`
      );
      if (isHomePage) {
        return router.push(`/${chainId}`);
      }

      router.push(`/${chainId}/${lastSlug}`);
    },
    [router, platformConfig]
  );

  /** @dev The function to desire chainId in case user do not force chainId by URL. */
  useEffect(() => {
    if (router.asPath === "/") {
      if (window.localStorage.getItem("chainId")) {
        setDesiredChainId(window.localStorage.getItem("chainId"));
      } else {
        setDesiredChainId(ChainId.bnb);
      }
    }
  }, [router]);

  return (
    <PlatformConfigContext.Provider
      value={{
        chainId: desiredChainId,
        platformConfig: platformConfigBasedDesiredChainId,
        dexUrl,
        chainInfos: platformConfig,
        switchChainId: (chainId: string) => handleSwitchChain(chainId),
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
