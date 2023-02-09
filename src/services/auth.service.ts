import { SolanaSigner } from "@/src/providers/signature.provider";
import { StorageProvider } from "@/src/providers/storage.provider";
import * as bs from "bs58";
import { SIGN_MESSAGE } from "@/src/utils";
import { networkProvider } from "@/src/providers/network.provider";
import { TokenSetEntity } from "@/src/entities/token-set.entity";

/**
 * @dev Declare service serve for firebase authentication.
 */
export class AuthService {
  /**
   * @dev Auth provider injected.
   */
  private readonly storageProvider: StorageProvider;

  /**
   * @dev Initilize service.
   * @param {StorageProvider} storageProvider.
   */
  constructor(storageProvider: StorageProvider) {
    /** @dev Import storage provider. */
    this.storageProvider = storageProvider;
  }

  /**
   * @dev Get stored credentials.
   */
  public async getStoredCredentials(): Promise<{
    email: string;
    password: string;
  }> {
    try {
      /** @dev Get auth credential from storage. */
      const authData = JSON.parse(
        this.storageProvider.getItem("userCredential")
      );

      return authData as { email: string; password: string };
    } catch {
      throw new Error("Unauthorized");
    }
  }

  /**
   * @dev The function to login with Solana wallet.
   * @param {string} walletAddress.
   * @param {string} signedData.
   * @returns {Function}
   */
  public async signInWithWallet(walletAddress: string, signedData: Uint8Array) {
    /** @dev Check if @var {signedData} is valid. */
    if (!SolanaSigner.verify(SIGN_MESSAGE, signedData, walletAddress)) {
      throw new Error("The wallet is not authorized by user");
    }

    await this.loginWithHamsterApi(walletAddress, signedData);
  }

  /**
   * @dev Define the function to restrict access token into hamsterswap server.
   * @param {string} identityId.
   * @param {Uint8Array} signedData.
   * @return {UserCredential}
   */
  public async loginWithHamsterApi(
    identityId: string,
    signedData: Uint8Array
  ): Promise<any> {
    await networkProvider.request(`/auth/challenge/request`, {
      method: "POST",
      data: {
        target: identityId,
      },
    });
    const userCredentials = await networkProvider
      .request(`/user/idp/solana-wallet/availability/check`, {
        method: "POST",
        data: {
          identityId,
        },
      })
      .then(async () => {
        /**
         * @dev Sign up to Hamster server with signature
         * once user haven't registered yet
         */
        const base64Signature = btoa(
          JSON.stringify({
            desiredWallet: identityId,
            rawContent: SIGN_MESSAGE,
            signature: bs.encode(signedData),
          })
        );

        /**
         * @dev Post sign up to Hamster server and save accessToken.
         */
        return await networkProvider.request<TokenSetEntity>(
          `/auth/idp/solana-wallet/sign-up`,
          {
            method: "POST",
            data: {
              base64Signature,
            },
          }
        );
      })
      .catch(async () => {
        /**
         * @dev Sign in to Hamster server with signature
         * once user have registered yet
         */
        const base64Signature = btoa(
          JSON.stringify({
            desiredWallet: identityId,
            signature: bs.encode(signedData),
          })
        );

        /**
         * @dev Post sign in to Hamster server and save accessToken.
         */
        return await networkProvider.request<TokenSetEntity>(
          `/auth/idp/solana-wallet/sign-in`,
          {
            method: "POST",
            data: {
              base64Signature,
            },
          }
        );
      });

    /**
     * @dev Save @var {hAccessToken} into local storage.
     */
    this.storageProvider.setItem(
      "hAccessToken",
      (userCredentials as any).accessToken
    );
  }

  /**
   * @dev The function to logout
   * @return {Function}
   */
  public async logout() {
    try {
      /**
       * @dev Logout from hamster server.
       */
      await networkProvider.requestWithCredentials(`/auth/logout`, {
        method: "POST",
      });

      /**
       * @dev Remove stroaged session.
       */
      this.storageProvider.removeItem("hAccessToken");
      this.storageProvider.removeItem("userCredential");
      this.storageProvider.removeItem("accessToken");
      this.storageProvider.removeItem("use-solana/wallet-config", true);
      this.storageProvider.removeItem("walletName", true);
    } catch {}
  }
}
