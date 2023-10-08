import { TransactionBuilder } from "@/src/providers/program/aptos/transaction.builder";
import {
  CreatePocketParams,
  DepositParams,
} from "@/src/providers/program/aptos/params.type";
import { networkProvider } from "@/src/providers/network.provider";

export class AptosProgramService {
  /**
   * @dev Initilize modules.
   * @params @TransactionBuilder Provider to call contract.
   */
  constructor(private transtractionBuilder: TransactionBuilder) {}

  /**
   * @dev Create pocket.
   * @params @var {string} walletAddress.
   * @params @var {CreatePocketParams} createPocketParams.
   * @params @var {DepositParams} depositParams.
   * @param chainId
   * @param walletAddress
   * @param createPocketParams
   * @param depositParams
   */
  public async createPocket(
    chainId: string,
    walletAddress: string,
    createPocketParams: CreatePocketParams,
    depositParams: DepositParams
  ) {
    /** @dev Call to HamsterBox server to initialize the proposal. */
    const response = await networkProvider.request<any>(
      `/pool/${chainId}/${walletAddress}`,
      {
        method: "POST",
        data: {},
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      }
    );

    /**
     * @dev Create on-chain.
     */
    console.log({ ...createPocketParams, id: response?._id });
    console.log({ ...depositParams, id: response?._id });
    // eslint-disable-next-line prettier/prettier
    return {
      pocketId: response?._id,
      data: await this.transtractionBuilder
        .buildCreatePocketAndDepositTransaction(
          { ...createPocketParams, id: response?._id },
          { ...depositParams, id: response?._id }
        )
        .execute(),
    };
  }

  /**
   * @dev Pause pocket.
   * @param @var {string} pocketId.
   */
  public async pausePocket(pocketId: string) {
    return this.transtractionBuilder
      .buildPausePocketTransaction({
        id: pocketId,
      })
      .execute();
  }

  /**
   * @dev Restart pocket.
   * @param @var {string} pocketId.
   */
  public async resumePocket(pocketId: string) {
    return this.transtractionBuilder
      .buildRestartPocketTransaction({
        id: pocketId,
      })
      .execute();
  }

  /**
   * @dev Withraw auto-closed pocket.
   * @param @var {string} pocketId.
   * @param @var {string}  baseTokenAddress.
   * @param @var {string}  targetTokenAddress.
   * @returns {void}.
   */
  public async withdrawPocket(
    pocketId: string,
    baseTokenAddress: string,
    targetTokenAddress: string
  ) {
    return this.transtractionBuilder
      .buildClosePocketAndWithdrawTransaction(
        {
          id: pocketId,
        },
        {
          id: pocketId,
          baseCoinType: baseTokenAddress,
          targetCoinType: targetTokenAddress,
        }
      )
      .execute();
  }

  /**
   * @dev Close pocket and withdraw assets into owner's wallet.
   * @param @var {string} pocketId.
   * @param @var {string}  baseTokenAddress.
   * @param @var {string}  targetTokenAddress.
   * @returns {void}.
   */
  public async closePocket(
    pocketId: string,
    baseTokenAddress: string,
    targetTokenAddress: string
  ) {
    return this.transtractionBuilder
      .buildClosePocketAndWithdrawTransaction(
        {
          id: pocketId,
        },
        {
          id: pocketId,
          baseCoinType: baseTokenAddress,
          targetCoinType: targetTokenAddress,
        }
      )
      .execute();
  }

  /**
   * @dev Deposit base token amount into pocket.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {bigint} depositedAmount.
   * @returns {void}.
   */
  public async depositPocket(
    pocketId: string,
    baseTokenAddress: string,
    depositedAmount: bigint
  ) {
    return this.transtractionBuilder
      .buildDepositTransaction({
        id: pocketId,
        coinType: baseTokenAddress,
        amount: depositedAmount,
      })
      .execute();
  }

  /**
   * @dev Deposit base token amount into pocket.
   * @param @var {string} pocketId.
   * @param @var {string} baseTokenAddress.
   * @param @var {string} targetTokenAddress.
   * @returns {void}.
   */
  public async reversePocket(
    pocketId: string,
    baseTokenAddress: string,
    targetTokenAddress: string
  ) {
    return this.transtractionBuilder
      .buildClosePositionAndWithdrawTransaction({
        id: pocketId,
        baseCoinType: baseTokenAddress,
        targetCoinType: targetTokenAddress,
        minAmountOut: BigInt(0),
      })
      .execute();
  }

  /**
   * @dev The function to sync the data of pool
   * @param {string} poolId
   */
  public async sync(poolId: string): Promise<any> {
    return networkProvider.request(`/pool/aptos/${poolId}/sync`, {
      method: "POST",
      data: {},
      headers: {
        "content-type": "text/plain;charset=UTF-8",
      },
    });
  }
}
