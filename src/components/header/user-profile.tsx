import { FC, useRef, useState } from "react";
import { useWallet as useSolanaWallet } from "@/src/hooks/useWallet";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import { disconnect as disconnectEvm } from "@wagmi/core";
import {
  LoggoutIcon,
  BookIcon,
  DropdownArrowIcon,
} from "@/src/components/icons";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { AVATAR_ENDPOINT, utilsProvider } from "@/src/utils";
import classnames from "classnames";
import styles from "./index.module.scss";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";
import { useAptosWallet } from "@/src/hooks/useAptos";

const UserProfile: FC = () => {
  const { walletAddress } = useAppWallet();
  const { chainId, pushRouterWithChainId } = usePlatformConfig();
  const { disconnect: disconnectSol, solanaWallet } = useSolanaWallet();
  const { signer: evmSigner } = useEvmWallet();
  const { disconnect: disconnectAptos } = useAptosWallet();

  // const { disconnect: disconnectEvm } = useDisconnectEvm();

  /**
   * @description Define state of showing profile menu
   */
  const [show, setShow] = useState(false);

  /**
   * @dev reference to the button
   * close the dropdown when user click outside
   */
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    setShow(false);
  });

  return (
    <div
      className={classnames(
        "relative flex items-center h-full border-solid border-[0px] border-purple300 rounded-[50px] cursor-pointer avatar-profile bg-[#242636] px-[10px] md:py-[10px] py-[5px]",
        styles["avatar-profile"]
      )}
      ref={ref}
    >
      <img
        className="mr-[10px] w-[24px] h-[24px]"
        src={`${AVATAR_ENDPOINT}/${walletAddress}.png`}
      />
      <span
        className="text-[12px] md:text-[14px] text-white flex items-center"
        onClick={() => setShow(!show)}
      >
        <span className="normal-text text-dark50">
          {utilsProvider.makeShort(walletAddress, 3)}
        </span>
        <DropdownArrowIcon className="ml-2 text-dark50" />
      </span>
      <ul
        style={{ display: show ? "block" : "none" }}
        className={styles["toggle-container"]}
      >
        <div className={styles.container}>
          <ul>
            <li
              onClick={() => pushRouterWithChainId(`/my-pockets`)}
              className="hover:text-purple normal-text flex items-center"
            >
              <BookIcon />
              <p className="ml-[5px]">My Pockets</p>
            </li>
            <li
              onClick={async () => {
                /** @dev Force to disconnect sol wallet. */
                if (chainId === ChainId.sol || solanaWallet?.publicKey) {
                  await disconnectSol();
                }

                /** @dev Force to disconnect evm wallet. */
                if (chainId !== ChainId.sol || evmSigner !== undefined) {
                  await disconnectEvm();
                }

                /** @dev Force to disconnect aptos wallet. */
                if (chainId.toLowerCase().includes("aptos")) {
                  await disconnectAptos();
                }

                /** @dev Redirect to home. */
                pushRouterWithChainId("/");
              }}
              className="text-red300 flex items-center normal-text"
            >
              <LoggoutIcon />
              <p className="ml-[5px]">Disconnect</p>
            </li>
          </ul>
        </div>
      </ul>
    </div>
  );
};

export default UserProfile;
