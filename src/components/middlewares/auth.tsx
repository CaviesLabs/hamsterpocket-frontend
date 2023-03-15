import { FC, ReactNode, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/src/hooks/useWallet";

interface Props {
  children: ReactNode;
}

const AUTH_ROUTES = [
  "/create-pocket",
  "/ended-pockets",
  "/my-pockets",
  "/portfolio",
  "/history",
];

const AuthMiddleware: FC<Props> = ({ children }) => {
  const router = useRouter();

  /**
   * @dev Wallet hook injected.
   */
  const wallet = useWallet();

  const isAuth = useCallback(() => {
    return !(AUTH_ROUTES.find((item) => router.asPath === item) === undefined);
  }, [router.asPath]);

  useEffect(() => {
    /** @dev Wait for 2s to re-connect wallet */
    const myTimer = setTimeout(() => {
      if (isAuth() && !wallet?.solanaWallet.publicKey) {
        router.push("/");
      }
    }, 2000);
    return () => clearTimeout(myTimer);
  }, [router.asPath, wallet]);

  return <>{children}</>;
};

export default AuthMiddleware;
