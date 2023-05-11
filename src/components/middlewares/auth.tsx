import { FC, ReactNode, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useAppWallet } from "@/src/hooks/useAppWallet";

interface Props {
  children: ReactNode;
}

const AUTH_ROUTES = [
  "/create-pocket",
  "/ended-pockets",
  "/my-pockets",
  "/portfolio",
  "/history",
  "/pocket",
  "/strategy",
];

const AuthMiddleware: FC<Props> = ({ children }) => {
  const router = useRouter();

  /**
   * @dev Wallet hook injected.
   */
  const wallet = useAppWallet();

  const isAuth = useCallback(() => {
    return !(
      AUTH_ROUTES.find(
        (item) => router.asPath === item || router.asPath.includes(item)
      ) === undefined
    );
  }, [router.asPath]);

  useEffect(() => {
    /** @dev Wait for 2s to re-connect wallet */
    const myTimer = setTimeout(() => {
      if (isAuth() && !wallet?.walletAddress) {
        router.push("/");
      }
    }, 1000);
    return () => clearTimeout(myTimer);
  }, [router.asPath, wallet]);

  return <>{children}</>;
};

export default AuthMiddleware;
