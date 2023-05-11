import {
  createContext,
  useContext,
  ReactNode,
  FC,
  useCallback,
  useEffect,
} from "react";
import { useSigner, useBalance } from "wagmi";
// import pocketChefContract from "@/src/providers/program/evm/artifacts/contracts/PocketChef.sol/PocketChef.json";
import { BigNumber } from "ethers";
import { Params } from "@/src/providers/program/evm/typechain-types/contracts/PocketChef";
import { PocketChef__factory } from "@/src/providers/program/evm/typechain-types";
import { evmProgramService } from "@/src/services/evm-program.service";
import { MATIC_ADDRESS } from "@/src/utils";
import { fetchBalance } from "@wagmi/core";

/** @dev Initiize context. */
export const EvmWalletContext = createContext<{
  nativeBalance: string;
  createPocket(
    depositedAmount: BigNumber,
    createdPocketParams: Params.CreatePocketParamsStruct
  ): Promise<void>;
  depositPocket(pocketId: string, depositedAmount: BigNumber): Promise<void>;
  closePocket(pocketId: string): Promise<void>;
  pausePocket(pocketId: string): Promise<void>;
  withdrawPocket(pocketId: string): Promise<void>;
  resumePocket(pocketId: string): Promise<void>;
  signer: unknown;
}>(null);

/** @dev Expose wallet provider for usage. */
export const EvmWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /** @dev Get Signer provider from wagmi. */
  const { data: signer } = useSigner({
    onSuccess(data) {
      console.log("Signer got: ", data);
    },
  });

  /** @dev Initilize contract from signer provider. */
  const contract = PocketChef__factory.connect(
    "0x9ac25725B8465E70cc2458592C9104c0f06C8e87",
    signer
  );

  /** @dev Get chain native token balance. */
  const { data: nativeBalanceData } = useBalance({
    address: MATIC_ADDRESS,
    formatUnits: "gwei",
  });

  useEffect(() => {
    console.log("get balace");
    (async () => {
      console.log("get balace");
      const balance = await fetchBalance({
        address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
        chainId: 80001,
      });
      console.log({ balance });
    })();
  });

  console.log({ signer });
  const createPocket = useCallback(
    async (
      depositedAmount: BigNumber,
      createdPocketParams: Params.CreatePocketParamsStruct
    ) => {
      /** @dev Execute off-chain */
      const pocketId = await evmProgramService.createPocketOffChain(
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

  const depositPocket = useCallback(
    async (pocketId: string, despositedAmount: BigNumber) => {
      await contract.depositEther(pocketId, { value: despositedAmount });
    },
    [signer, contract]
  );

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

  const pausePocket = useCallback(
    async (pocketId: string) => {
      await contract.pausePocket(pocketId);
    },
    [signer, contract]
  );

  const resumePocket = useCallback(
    async (pocketId: string) => {
      console.log("resume pocket", pocketId);
      await contract.restartPocket(pocketId);
    },
    [signer, contract]
  );

  const withdrawPocket = useCallback(
    async (pocketId: string) => {
      await contract.withdraw(pocketId);
    },
    [signer, contract]
  );

  return (
    <EvmWalletContext.Provider
      value={{
        createPocket,
        depositPocket,
        closePocket,
        pausePocket,
        withdrawPocket,
        resumePocket,
        signer: signer,
        nativeBalance: nativeBalanceData?.formatted,
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
