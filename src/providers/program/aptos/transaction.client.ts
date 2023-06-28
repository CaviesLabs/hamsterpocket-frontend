import { AptosAccount, AptosClient, HexString, TxnBuilderTypes } from "aptos";
import * as aptosWalletAdapter from "@pontem/aptos-wallet-adapter";
import { RESOURCE_ACCOUNT_SEED } from "./libs/constants";

/**
 * @notice Transaction client to send transaction to aptos blockchain
 */
export class TransactionSigner {
  /**
   * @dev Initialize transaction signer
   * @param signer
   */
  constructor(private readonly signer: aptosWalletAdapter.WalletContextState) {
  }

  /**
   * @notice Sign and send message
   * @param payload
   */
  public async signAndSendTransaction(payload: any) {
    // this.signer
    const client = new AptosClient(process.env.APTOS_NODE_URL);

    const rawTx = await client.generateRawTransaction(
      new HexString(this.signer.account.address.toString()),
      payload
    );

    const result = await client.simulateTransaction(
      new TxnBuilderTypes.Ed25519PublicKey(
        new HexString(this.signer.account.publicKey.toString()).toUint8Array()
      ),
      rawTx
    );
    if (!result[0].success) {
      throw new Error(`${result[0].vm_status}`);
    }

    const realPayload = result[0].payload;

    if ((realPayload as any).arguments[0].includes("0x")) {
      (realPayload as any).arguments[0] = new HexString(
        (realPayload as any).arguments[0]
      ).toUint8Array();
    }
    return this.signer.signAndSubmitTransaction(realPayload as any);
  }

  /**
   * @notice Simulate transaction
   * @param payload
   */
  public async simulate(payload: any) {
    const client = new AptosClient(process.env.APTOS_NODE_URL);

    const rawTx = await client.generateRawTransaction(
      new HexString(this.signer.account.address.toString()),
      payload
    );

    return client.simulateTransaction(
      new TxnBuilderTypes.Ed25519PublicKey(
        new HexString(this.signer.account.publicKey.toString()).toUint8Array()
      ),
      rawTx
    );
  }

  /**
   * @notice Read program state from
   */
  public async view(payload: any) {
    return new AptosClient(process.env.APTOS_NODE_URL).view(payload);
  }

  /**
   * @notice get current signer address
   */
  public getAddress() {
    return this.signer.account.address;
  }

  /**
   * @notice Expose client for external use
   */
  public getClient() {
    return this.signer.wallet;
  }

  /**
   * @notice Get hamster pocket resource account
   */
  public getResourceAccount() {
    return AptosAccount.getResourceAccountAddress(
      new HexString(this.signer.account.address.toString()),
      new TextEncoder().encode(RESOURCE_ACCOUNT_SEED)
    );
  }
}
