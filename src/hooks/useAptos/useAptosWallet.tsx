import {
  FC,
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useWallet, PontemWalletName } from "@pontem/aptos-wallet-adapter";
import { TransactionBuilder } from "@/src/providers/program/aptos/transaction.builder";
import { TransactionSigner } from "@/src/providers/program/aptos/transaction.client";
import { AptosProgramService } from "@/src/services/aptos-program.service";
import { CreatePocketDto as SolCreatePocketDto } from "@/src/dto/pocket.dto";
import { createdPocketPramsParserAptos } from "@/src/utils/aptos.parser";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";

/** @dev Initiize context. */
export const AptosWalletContext = createContext<{
  walletAddress: string;
  connect(): void;
  disconnect(): void;

  /**
   * @dev The function to create pocket.
   * @param solCreatePocketDto
   * @param baseTokenDecimals
   * @param targetTokenDecimals
   * @param realBaseTokenDecimals
   * @param realTargetTokenDecimals
   * @param depositedAmount
   */
  createPocket(
    aptosWhiteLists: { [key: string]: WhitelistEntity },
    solCreatePocketDto: SolCreatePocketDto,
    baseTokenDecimals: number,
    targetTokenDecimals: number,
    realBaseTokenDecimals: number,
    realTargetTokenDecimals: number,
    depositedAmount: number
  ): Promise<void>;

  /**
   * @dev The function to pause pocket.
   * @param pocketId.
   */
  pausePocket(pocketId: string): Promise<void>;

  /**
   * @dev The function to restart pocket.
   * @param pocketId.
   */
  resumePocket(pocketId: string): Promise<void>;

  /**
   * @dev The function to withraw auto-closed pocket.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {string} targetTokenAddress.
   * @returns {void}.
   */
  withdrawPocket(
    pocketId: string,
    baseTokenAddress: string,
    targetTokenAddress: string
  ): Promise<void>;

  /**
   * @dev The function to close pocket and withdraw assets into owner's wallet.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {string} targetTokenAddress.
   * @returns {void}.
   */
  closePocket(
    pocketId: string,
    baseTokenAddress: string,
    targetTokenAddress: string
  ): Promise<void>;

  /**
   * @dev Deposit base token amount into pocket.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {bigint} depositedAmount.
   * @returns {void}.
   */
  depositPocket(
    pocketId: string,
    baseTokenAddress: string,
    depositedAmount: bigint
  ): Promise<void>;
}>(null);

/** @dev Expose wallet provider for usage. */
export const AptosWalletProvider: FC<{ children: ReactNode }> = (props) => {
  /** @dev Inject aptos wallet context. */
  const { connect: connectAptos, account, disconnect } = useWallet();
  const signer = useWallet();

  /** @dev Inject program provider. */
  const [builder, initBuilder] = useState<TransactionBuilder>();
  const [service, initService] = useState<AptosProgramService>();

  /** @dev Get chain platform config. */
  const { platformConfig, chainId } = usePlatformConfig();

  /** @dev Define aptos client */

  /** @internal @dev The function to open wallet popup for connecting. */
  const handleConnect = () => {
    connectAptos(PontemWalletName);
  };

  /** @internal @dev The function to disconnect for connecting. */
  const handleDisconnect = () => {
    disconnect();
  };

  /**
   * @external @dev The function to create pocket on Aptos chain.
   * @params @var {SolCreatePocketDto} solCreatePocketDto Raw creation payload in Solana chain.
   * @params @var {number} depositAmount.
   */
  const createPocket = useCallback(
    async (
      aptosWhiteLists: { [key: string]: WhitelistEntity },
      solCreatePocketDto: SolCreatePocketDto,
      baseTokenDecimals: number,
      targetTokenDecimals: number,
      realBaseTokenDecimals: number,
      realTargetTokenDecimals: number,
      depositedAmount: number
    ) => {
      if (!service || !platformConfig || !signer || !account) return;

      /**
       * @dev Parse raw payload in Solana to Aptos.
       */
      const [createdParams, depositedParams] = createdPocketPramsParserAptos(
        aptosWhiteLists,
        solCreatePocketDto,
        baseTokenDecimals,
        targetTokenDecimals,
        realBaseTokenDecimals,
        realTargetTokenDecimals,
        depositedAmount
      );

      /** @dev Execute transaction. */
      console.log({ createdParams });
      await service.createPocket(
        chainId,
        account?.address?.toString(),
        createdParams,
        depositedParams
      );
    },
    [service, platformConfig, signer, account, chainId]
  );

  /**
   * @external
   * @dev The function to pause pocket.
   * @params @var {string} pocketId.
   */
  const pausePocket = useCallback(
    async (pocketId: string) => {
      if (!service || !platformConfig || !signer || !account) return;
      /** @dev Execute transaction. */
      await service.pausePocket(pocketId);
    },
    [service, platformConfig, signer, account]
  );

  /**
   * @external
   * @dev The function to restart pocket.
   * @params @var {string} pocketId.
   */
  const resumePocket = useCallback(
    async (pocketId: string) => {
      if (!service || !platformConfig || !signer || !account) return;
      /** @dev Execute transaction. */
      await service.resumePocket(pocketId);
    },
    [service, platformConfig, signer, account]
  );

  /**
   * @external
   * @dev The function to withraw auto-closed pocket.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {string} targetTokenAddress.
   * @returns {void}.
   */
  const withdrawPocket = useCallback(
    async (
      pocketId: string,
      baseTokenAddress: string,
      targetTokenAddress: string
    ) => {
      if (!service || !platformConfig || !signer || !account) return;
      /** @dev Execute transaction. */
      await service.withdrawPocket(
        pocketId,
        baseTokenAddress,
        targetTokenAddress
      );
    },
    [service, platformConfig, signer, account]
  );

  /**
   * @external
   * @dev The function to close pocket and withdraw assets into owner's wallet.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {string} targetTokenAddress.
   * @returns {void}.
   */
  const closePocket = useCallback(
    async (
      pocketId: string,
      baseTokenAddress: string,
      targetTokenAddress: string
    ) => {
      if (!service || !platformConfig || !signer || !account) return;
      /** @dev Execute transaction. */
      await service.closePocket(pocketId, baseTokenAddress, targetTokenAddress);
    },
    [service, platformConfig, signer, account]
  );

  /**
   * @external
   * @dev The function to close pocket and withdraw assets into owner's wallet.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {string} targetTokenAddress.
   * @returns {void}.
   */
  const depositPocket = useCallback(
    async (
      pocketId: string,
      baseTokenAddress: string,
      depositedAmount: bigint
    ) => {
      if (!service || !platformConfig || !signer || !account) return;
      /** @dev Execute transaction. */
      await service.depositPocket(pocketId, baseTokenAddress, depositedAmount);
    },
    [service, platformConfig, signer, account]
  );

  /**
   * @dev Watch contexts and update builder provider.
   */
  useEffect(() => {
    if (
      !signer ||
      !platformConfig ||
      !platformConfig?.chainName.toLowerCase().includes("aptos")
    )
      return;

    /**
     * @dev Initialize Aptos builder.
     */
    initBuilder(
      new TransactionBuilder(
        new TransactionSigner(signer),
        platformConfig.programAddress
      )
    );
  }, [signer, platformConfig, initBuilder]);

  /**
   * @dev Watch contexts and update services.
   */
  useEffect(() => {
    if (!signer || !builder) return;

    /**
     * @dev Initilize Aptos program service.
     */
    initService(new AptosProgramService(builder));
  }, [signer, builder]);

  return (
    <AptosWalletContext.Provider
      value={{
        walletAddress: account?.address?.toString(),
        connect: handleConnect,
        disconnect: handleDisconnect,
        createPocket,
        pausePocket,
        resumePocket,
        withdrawPocket,
        closePocket,
        depositPocket,
      }}
    >
      {props.children}
    </AptosWalletContext.Provider>
  );
};

/** @dev Use context hook. */
export const useAptosWallet = () => {
  const context = useContext(AptosWalletContext);
  if (!context) {
    throw new Error("Must be in provider");
  }
  return context;
};
