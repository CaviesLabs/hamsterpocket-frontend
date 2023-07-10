import {
  createContext,
  useContext,
  ReactNode,
  FC,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";
import {
  PocketChef__factory,
  PocketRegistry__factory,
  PocketChef,
  PocketRegistry,
} from "@/src/providers/program/evm/typechain-types";
import { evmProgramService } from "@/src/services/evm-program.service";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { ChainId } from "@/src/entities/platform-config.entity";

/** @dev Initiize context. */
export const EvmWalletContext = createContext<{
  nativeBalance: string;
  createPocket(
    depositedAmount: BigNumber,
    createdPocketParams: Params.CreatePocketParamsStruct
  ): Promise<void>;
  depositPocket(pocketId: string, depositedAmount: BigNumber): Promise<void>;
  closePocket(pocketId: string): Promise<void>;
  closePositionPocket(pocket: PocketEntity): Promise<void>;
  pausePocket(pocketId: string): Promise<void>;
  withdrawPocket(pocketId: string): Promise<void>;
  resumePocket(pocketId: string): Promise<void>;
  signer: unknown;
}>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /**
  /* @dev Inject context of eth wallet. */
  const { platformConfig, chainId } = usePlatformConfig();

  /** @dev Define state for main contract. */
  const [contract, initContract] = useState<PocketChef>();
  const [balance, setBalance] = useState<string>("0");

  /** @dev Define state for pocket registry. */
  const [pocketRegistry, initPocketRegistry] = useState<PocketRegistry>();

  /** @dev Get Signer provider from wagmi. */
  const { data: signer } = useSigner({
    async onSuccess(data) {
      console.log("Signer got: ", data);
      const balance = await data.provider.getBalance(await data.getAddress());

      setBalance(ethers.utils.formatEther(balance));
    },
  });

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
        await signer.getAddress()
      );

      /** @dev Execute on-chain */
      await contract.createPocketAndDepositEther(
        { ...createdPocketParams, id: pocketId },
        {
          value: depositedAmount,
        }
      );
    },
    [signer, contract, chainId]
  );

  /**
   * @dev The function to deposit fund to a pocket in evm.
   * @params pocketId.
   */
  const depositPocket = useCallback(
    async (pocketId: string, depositedAmount: BigNumber) => {
      await contract.depositEther(pocketId, { value: depositedAmount });
    },
    [signer, contract]
  );

  /**
   * @dev The function to close pocket in evm.
   * @params pocketId.
   */
  const closePocket = useCallback(
    async (pocketId: string) => {
      await contract
        .connect(signer)
        .multicall([
          contract
            .connect(signer)
            .interface.encodeFunctionData("closePocket", [pocketId]),
          contract
            .connect(signer)
            .interface.encodeFunctionData("withdraw", [pocketId]),
        ]);
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

        fee = await evmProgramService.getQoute({
          chainId: pocket.chainId,
          baseTokenAddress: pocket.baseTokenAddress,
          targetTokenAddress: pocket.targetTokenAddress,
          amountIn: pocket.currentTargetTokenBalance.toString(),
          useV3: isV3,
          ammRouterAddress,
        });
      }

      await contract.closePosition(pocket.id || pocket._id, fee);
    },
    [signer, contract]
  );

  /**
   * @dev The function to pause pocket in evm.
   * @params pocketId.
   */
  const pausePocket = useCallback(
    async (pocketId: string) => {
      await contract.pausePocket(pocketId);
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
      await contract.restartPocket(pocketId);
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

  useEffect(() => {
    /** @dev Not in sol. */
    if (chainId == ChainId.sol || !signer) return;

    if (platformConfig?.programAddress) {
      console.log("init program address: ", platformConfig?.programAddress);
      initContract(
        PocketChef__factory.connect(platformConfig?.programAddress, signer)
      );
    }

    if (platformConfig?.registryAddress) {
      console.log("init program address: ", platformConfig?.registryAddress);
      initPocketRegistry(
        PocketRegistry__factory.connect(platformConfig?.registryAddress, signer)
      );
    }
  }, [platformConfig, signer, chainId]);

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
