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
  JsonRpcProvider,
  BigNumberish as BigNumber,
} from "ethers";
import {
  PocketChef,
  PocketRegistry,
  PocketChef__factory,
  PocketRegistry__factory,
} from "@/src/providers/program/evm/typechain-types";
import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";

import { useWalletClient } from "wagmi";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { ChainId } from "@/src/entities/platform-config.entity";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { evmProgramService } from "@/src/services/evm-program.service";

import { createPublicClient, formatEther, http } from "viem";
import { useEvmWalletKit } from "./evm-wallet-kit.provider";

/** @dev Define the number of confirmations which each transaction should wait for. */
const CONFIRMATIONS = 5;

/** @dev Initiize context. */
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
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [contract, initContract] = useState<PocketChef>();
  const [pocketRegistry, initPocketRegistry] = useState<PocketRegistry>();

  // Initialize public client.
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: chain,
      transport: http(),
    });
  }, [chain]);

  // Get json rpc provider.
  const jsonRpcProvider = useMemo(() => {
    return new JsonRpcProvider(platformConfig?.rpcUrl);
  }, [platformConfig]);

  // Fetch native balance.
  const fetchNativeBalance = useCallback(async () => {
    const balance = await publicClient.getBalance({
      address: signer.address as any,
    });

    setBalance(formatEther(balance));
  }, [client, signer, publicClient]);

  // Convert wagmi client to rpc signer.
  useEffect(() => {
    if (!client?.data || chainId === ChainId.sol) return;
    if (!signer) {
      const { account, chain, transport } = client.data;
      const provider = new BrowserProvider(transport as any, {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      });

      setSigner(new JsonRpcSigner(provider, account.address));
    }
  }, [client]);

  // Fetch native balance.
  useEffect(() => {
    if (!signer || !jsonRpcProvider || chainId === ChainId.sol) return;
    fetchNativeBalance();
  }, [client]);

  // Initialize contract.
  useEffect(() => {
    if (
      !signer ||
      !chainId ||
      !platformConfig ||
      chainId === ChainId.sol ||
      chainId.includes("aptos")
    )
      return;

    if (platformConfig?.programAddress) {
      initContract(
        PocketChef__factory.connect(platformConfig?.programAddress, signer)
      );
    }

    if (platformConfig?.registryAddress) {
      initPocketRegistry(
        PocketRegistry__factory.connect(platformConfig?.registryAddress, signer)
      );
    }
  }, [platformConfig, signer, chainId]);

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
      const tx = await contract.createPocketAndDepositEther(
        { ...createdPocketParams, id: pocketId },
        { value: depositedAmount }
      );

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, contract, chainId]
  );

  /**
   * @dev The function to deposit fund to a pocket in evm.
   * @params pocketId.
   */
  const depositPocket = useCallback(
    async (pocketId: string, depositedAmount: BigNumber) => {
      const tx = await contract.depositEther(pocketId, {
        value: depositedAmount,
      });

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, contract]
  );

  /**
   * @dev The function to close pocket in evm.
   * @params pocketId.
   */
  const closePocket = useCallback(
    async (pocketId: string) => {
      const tx = await contract
        .connect(signer)
        .multicall([
          contract
            .connect(signer)
            .interface.encodeFunctionData("closePocket", [pocketId]),
          contract
            .connect(signer)
            .interface.encodeFunctionData("withdraw", [pocketId]),
        ]);

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, contract]
  );

  /**
   * @dev The function to close position of pocket in evm.
   * @params pocketId.
   */
  const closePositionPocket = useCallback(
    async (pocket: PocketEntity) => {
      let fee = "0";

      /**
       * @dev Call to hamster server to get fee.
       */
      if (
        pocket.chainId === ChainId.polygon_mumbai ||
        pocket.chainId === ChainId.bnb
      ) {
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

        fee = await evmProgramService.getQuote({
          chainId: pocket.chainId,
          baseTokenAddress: pocket.baseTokenAddress,
          targetTokenAddress: pocket.targetTokenAddress,
          amountIn: pocket.currentTargetTokenBalance.toString(),
          useV3: isV3,
          ammRouterAddress,
        });
      }

      const tx = await contract
        .connect(signer)
        .multicall([
          contract
            .connect(signer)
            .interface.encodeFunctionData("closePosition", [
              pocket.id || pocket._id,
              fee,
              0,
            ]),
          contract
            .connect(signer)
            .interface.encodeFunctionData("withdraw", [
              pocket.id || pocket._id,
            ]),
        ]);

      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, contract]
  );

  /**
   * @dev The function to pause pocket in evm.
   * @params pocketId.
   */
  const pausePocket = useCallback(
    async (pocketId: string) => {
      const tx = await contract.pausePocket(pocketId);
      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, contract]
  );

  /**
   * @dev The function to resume pocket in evm.
   * @params pocketId.
   */
  const resumePocket = useCallback(
    async (pocketId: string) => {
      console.log("resume pocket", pocketId);
      const tx = await contract.restartPocket(pocketId);
      /** @dev Wait for confirmation. */
      await (tx as any).wait(CONFIRMATIONS);
    },
    [signer, contract]
  );

  /**
   * @dev The function to withdraw pocket in evm.
   * @params pocketId.
   */
  const withdrawPocket = useCallback(
    async (pocketId: string) => {
      const pocketStatus = (await pocketRegistry.pockets(pocketId)).status;
      if (pocketStatus !== 3) {
        await closePocket(pocketId);
      } else {
        await contract.withdraw(pocketId);
      }
    },
    [signer, contract, pocketRegistry]
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
