import {
  createContext,
  useContext,
  ReactNode,
  FC,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useSigner, useBalance, useAccount } from "wagmi";
import { BigNumber } from "ethers";
import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";
import {
  PocketChef__factory,
  PocketRegistry__factory,
  PocketChef,
  PocketRegistry,
} from "@/src/providers/program/evm/typechain-types";
import { evmProgramService } from "@/src/services/evm-program.service";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";

/** @dev Initiize context. */
export const EvmWalletContext = createContext<{
  nativeBalance: string;
  createPocket(
    depositedAmount: BigNumber,
    createdPocketParams: Params.CreatePocketParamsStruct
  ): Promise<void>;
  depositPocket(pocketId: string, depositedAmount: BigNumber): Promise<void>;
  closePocket(pocketId: string): Promise<void>;
  closePositionPocket(pocketId: string): Promise<void>;
  pausePocket(pocketId: string): Promise<void>;
  withdrawPocket(pocketId: string): Promise<void>;
  resumePocket(pocketId: string): Promise<void>;
  signer: unknown;
}>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /**
  /* @dev Inject context of eth wallet. */
  const ethWallet = useAccount();
  const { platformConfig } = usePlatformConfig();

  /** @dev Define state for main contract. */
  const [contract, initContract] = useState<PocketChef>();

  /** @dev Define state for pocket registry. */
  const [pocketRegistry, initPocketRegistry] = useState<PocketRegistry>();

  /** @dev Get Signer provider from wagmi. */
  const { data: signer } = useSigner({
    onSuccess(data) {
      console.log("Signer got: ", data);
    },
  });

  /** @dev Get chain native token balance. */
  const { data: nativeBalanceData } = useBalance({
    address: ethWallet?.address,
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
      console.log({ signer });
      const pocketId = await evmProgramService.createPocketOffChain(
        process.env.EVM_CHAIN_ID === "bsc" ? "bnb" : "mumbai",
        await signer.getAddress()
      );

      /** @dev Execute on-chain */
      console.log({ ...createdPocketParams, id: pocketId });
      await contract.createPocketAndDepositEther(
        { ...createdPocketParams, id: pocketId },
        {
          value: depositedAmount,
        }
      );
    },
    [signer, contract]
  );

  /**
   * @dev The function to deposit fund to a pocket in evm.
   * @params pocketId.
   */
  const depositPocket = useCallback(
    async (pocketId: string, despositedAmount: BigNumber) => {
      await contract.depositEther(pocketId, { value: despositedAmount });
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
    async (pocketId: string) => {
      await contract.closePosition(pocketId);
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
      console.log({ pocketStatus });
      if (pocketStatus !== 3) {
        await closePocket(pocketId);
      } else {
        await contract.withdraw(pocketId);
      }
    },
    [signer, contract, pocketRegistry]
  );

  useEffect(() => {
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
  }, [platformConfig, signer]);

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
        nativeBalance: parseFloat(nativeBalanceData?.formatted).toFixed(3),
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
