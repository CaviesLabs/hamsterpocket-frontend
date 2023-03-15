import { useEffect } from "react";
import { useConnectedWallet } from "@saberhq/use-solana";
import { useWallet } from "@/src/hooks/useWallet";
import { authService } from "@/src/services";
import { SIGN_MESSAGE } from "@/src/utils";

/**
 * @dev Delayed hook to check if wallet is disconnected, will reset all auth sessions
 * */
let delayed: NodeJS.Timeout;

/** @dev Expore authenticate hook to process tasks related user authentcation */
export const useAuth = () => {
  /** @dev Get Wallet info from @saberhq hook. */
  const wallet = useConnectedWallet();

  /** @dev Import signMessage function to use. */
  const { signMessage, disconnect } = useWallet();

  /** @dev The function to login. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = async () => {
    try {
      /** @dev Sign message to get signature. */
      const signature = await signMessage(SIGN_MESSAGE);

      /** @dev Call function to sign message in wallet and login firebase & hamsterbox server. */
      await authService.signInWithWallet(
        wallet?.publicKey?.toString(),
        signature
      );

      /** @dev Get hamster profile. */
    } catch {}
  };

  /** @dev The function to handle authentication. */
  const handleAuth = async () => {
    /**
     * @dev
     * Verify if user already signined with wallet before by fetching profile session,
     * if have not already sigin, sign in with wallet to Hamster server.
     * */
    // handleLogin();
  };

  /**
   * @dev Listen wallet changes.
   */
  useEffect(() => {
    /** @dev Force to clear. */
    delayed && clearTimeout(delayed);

    /**
     * @dev Condition to reset or login.
     */
    if (wallet?.publicKey?.toString()) {
      handleAuth();
    } else {
      /**
       * @dev Delayed checking mean when user disconnect completed from wallet, it will reset authentication session.
       */
      delayed = setTimeout(async () => {
        await disconnect();
      }, 3000);
    }

    return () => delayed && clearTimeout(delayed);
  }, [wallet]);
};
