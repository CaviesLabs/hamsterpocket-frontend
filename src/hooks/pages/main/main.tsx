import { ReactNode, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { MainContext } from "./types";
import { useUI } from "./useUI";
import { useRouter } from "./useRouter";
// import { getPlatformConfig } from "@/src/redux/actions/platform-config/platform.action";
import ReduxState from "@/src/redux/entities/state";

export const MainProvider = (props: { children: ReactNode }) => {
  /**
   * @dev Get redux state.
   */
  const reduxState = useSelector((app: ReduxState) => app);

  /**
   * @dev Define condition to show Nft-detail modal.
   */
  const [nftModal, setNftModal] = useState(false);

  /**
   * @dev Define function to open nft-details modal.
   */
  const openNftDetailModal = useCallback(() => setNftModal(true), [nftModal]);

  /** @dev Call hook to use functions related to UI process. */
  useUI();

  /** @dev Call hooks to detect router changes. */
  const { transitionLoading, fistLoading } = useRouter();

  return (
    <MainContext.Provider
      value={{
        openNftDetailModal,
        transitionLoading,
        fistLoading,
        ...reduxState,
      }}
    >
      {/**
       * @dev Render pages.
       */}
      {props.children}
    </MainContext.Provider>
  );
};
