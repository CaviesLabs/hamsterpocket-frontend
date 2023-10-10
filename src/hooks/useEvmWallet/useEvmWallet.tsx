import {
  FC,
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  createContext,
} from "react";
import {
  JsonRpcSigner,
  BrowserProvider,
  BigNumberish as BigNumber,
} from "ethers";
import {
  PocketChef__factory,
  PocketRegistry__factory,
} from "@/src/providers/program/evm/typechain-types";
import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";

import { useWalletClient } from "wagmi";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import {
  EvmProgramService,
  evmProgramService,
} from "@/src/services/evm-program.service";

import { createPublicClient, formatEther, http } from "viem";
import { useEvmWalletKit } from "./evm-wallet-kit.provider";

/** @dev Define the number of confirmations which each transaction should wait for. */
const CONFIRMATIONS = 5;

/** @dev Initialize context. */
export const EvmWalletContext = createContext<{
  signer: unknown;
  nativeBalance: string;
  closePocket(pocketId: string): Promise<void>;
  pausePocket(pocketId: string): Promise<void>;
  resumePocket(pocketId: string): Promise<void>;
  withdrawPocket(pocketId: string): Promise<void>;
  closePositionPocket(pocket: PocketEntity): Promise<void>;
  depositPocket(pocketId: string, depositedAmount: BigNumber): Promise<void>;
  createPocket(
    depositedAmount: BigNumber,
    createdPocketParams: Params.CreatePocketParamsStruct
  ): Promise<void>;
}>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletProvider: FC<{ children: ReactNode }> = (props) => {
  const client = useWalletClient();
  const { platformConfig, chainId } = usePlatformConfig();
  const { chain } = useEvmWalletKit();
  const [balance, setBalance] = useState<string>("0");

  const signer = useMemo(() => {
    if (client?.data && chain && platformConfig) {
      const { account, chain, transport } = client.data;

      if (chain.id === platformConfig?.chainId) {
        const provider = new BrowserProvider(transport as any, {
          chainId: chain.id,
          name: chain.name,
          ensAddress: chain.contracts?.ensRegistry?.address,
        });

        return new JsonRpcSigner(provider, account.address);
      }
    }

    return null;
  }, [client, chain, platformConfig]);

  const pocketChef = useMemo(() => {
    if (platformConfig && signer) {
      return PocketChef__factory.connect(
        platformConfig?.programAddress,
        signer
      );
    }
    return null;
  }, [platformConfig, signer]);

  const pocketRegistry = useMemo(() => {
    if (platformConfig && signer) {
      return PocketRegistry__factory.connect(
        platformConfig?.registryAddress,
        signer
      );
    }
    return null;
  }, [platformConfig, signer]);

  // Initialize public client.
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: chain,
      transport: http(),
    });
  }, [chain]);

  // Fetch native balance.
  const fetchNativeBalance = useCallback(async () => {
    const balance = await publicClient.getBalance({
      address: signer.address as any,
    });

    setBalance(formatEther(balance));
  }, [client, signer, publicClient]);

  // Fetch native balance.
  useEffect(() => {
    if (!signer || chainId === ChainId.sol) return;
    fetchNativeBalance();
  }, [signer]);

  /**
   * @dev The function to create a pocket in evm.
   * @params depositedAmount.
   * @params params.
   */
  const createPocket = useCallback(
    async (
      depositedAmount: BigNumber,
      createdPocketParams: Params.CreatePocketParamsStruct
    ) => {
      /** @dev Execute off-chain */
      const pocketId = await evmProgramService.createPocketOffChain(
        chainId,
        signer.address
      );

      /** @dev Execute on-chain */
      const tx = await pocketChef.createPocketAndDepositEther(
        { ...createdPocketParams, id: pocketId },
        { value: depositedAmount }
      );

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);

      /** @dev Sync pocket. */
      await new EvmProgramService().sync(pocketId);
    },
    [signer, pocketChef, chainId]
  );

  /**
   * @dev The function to deposit fund to a pocket in evm.
   * @params pocketId.
   */
  const depositPocket = useCallback(
    async (pocketId: string, depositedAmount: BigNumber) => {
      const tx = await pocketChef.depositEther(pocketId, {
        value: depositedAmount,
      });

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, pocketChef]
  );

  /**
   * @dev The function to close pocket in evm.
   * @params pocketId.
   */
  const closePocket = useCallback(
    async (pocketId: string) => {
      const tx = await pocketChef
        .connect(signer)
        .multicall([
          pocketChef
            .connect(signer)
            .interface.encodeFunctionData("closePocket", [pocketId]),
          pocketChef
            .connect(signer)
            .interface.encodeFunctionData("withdraw", [pocketId]),
        ]);

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, pocketChef, platformConfig, client, chain]
  );

  /**
   * @dev The function to close position of pocket in evm.
   * @params pocketId.
   */
  const closePositionPocket = useCallback(
    async (pocket: PocketEntity) => {
      /**
       * @dev Call to hamster server to get fee.
       */
      let isV3 = platformConfig?.whitelistedRouters[0]?.isV3 || false;
      let ammRouterAddress =
        platformConfig?.whitelistedRouters[0]?.address || "";

      /** @dev BNB chain default has two trading exchange, filter to use uniswap only. */
      if (pocket.chainId === ChainId.bnb) {
        const exchange = platformConfig.whitelistedRouters.find(
          (item) => item.ammTag === "uniswap"
        );

        /** @dev Update address. */
        ammRouterAddress = exchange?.address;
        isV3 = exchange?.isV3;
      }

      const { fee } = await evmProgramService.getQuote({
        chainId: pocket.chainId,
        baseTokenAddress: pocket.baseTokenAddress,
        targetTokenAddress: pocket.targetTokenAddress,
        amountIn: pocket.currentTargetTokenBalance.toString(),
        useV3: isV3,
        ammRouterAddress,
      });

      const tx = await pocketChef
        .connect(signer)
        .multicall([
          pocketChef
            .connect(signer)
            .interface.encodeFunctionData("closePosition", [
              pocket.id || pocket._id,
              fee,
              0,
            ]),
          pocketChef
            .connect(signer)
            .interface.encodeFunctionData("withdraw", [
              pocket.id || pocket._id,
            ]),
        ]);

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, pocketChef]
  );

  /**
   * @dev The function to pause pocket in evm.
   * @params pocketId.
   */
  const pausePocket = useCallback(
    async (pocketId: string) => {
      const tx = await pocketChef.pausePocket(pocketId);
      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, pocketChef]
  );

  /**
   * @dev The function to resume pocket in evm.
   * @params pocketId.
   */
  const resumePocket = useCallback(
    async (pocketId: string) => {
      console.log("resume pocket", pocketId);
      const tx = await pocketChef.restartPocket(pocketId);
      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, pocketChef]
  );

  /**
   * @dev The function to withdraw pocket in evm.
   * @params pocketId.
   */
  const withdrawPocket = useCallback(
    async (pocketId: string) => {
      const pocketStatus = (await pocketRegistry.pockets(pocketId)).status;
      if (Number(pocketStatus) !== 3) {
        await closePocket(pocketId);
      } else {
        const tx = await pocketChef.withdraw(pocketId);
        /** @dev Wait for confirmation. */
        await (tx as any).wait(CONFIRMATIONS);
      }
    },
    [signer, pocketChef, pocketRegistry, closePocket]
  );

  return (
    <EvmWalletContext.Provider
      value={{
        createPocket,
        depositPocket,
        closePocket,
        closePositionPocket,
        pausePocket,
        withdrawPocket,
        resumePocket,
        signer: signer,
        nativeBalance: balance,
      }}
    >
      {props.children}
    </EvmWalletContext.Provider>
  );
};

/** @dev Use context hook. */
export const useEvmWallet = () => {
  const context = useContext(EvmWalletContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
