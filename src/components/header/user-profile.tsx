import { FC, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useWallet } from "@/src/hooks/useWallet";
import { disconnect as disconnectEvm } from "@wagmi/core";
import {
  LoggoutIcon,
  // NoneIcon,
  // PlusIcon,
  BookIcon,
  DropdownArrowIcon,
} from "@/src/components/icons";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { AVATAR_ENDPOINT, utilsProvider } from "@/src/utils";
import classnames from "classnames";
import styles from "./index.module.scss";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";

const UserProfile: FC = () => {
  const router = useRouter();
  const { chain, walletAddress } = useAppWallet();
  const { disconnect: disconnectSol } = useWallet();
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
        "relative flex items-center h-full border-solid border-[0px] border-purple rounded-[50px] cursor-pointer avatar-profile bg-[#242636] px-[10px] md:py-[10px] py-[5px]",
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
          {/* {chain === "SOL" ? "Solana" : "BNB Chain"} */}
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
              onClick={() => router.push(`/my-pockets`)}
              className="hover:text-purple normal-text flex items-center"
            >
              <BookIcon />
              <p className="ml-[5px]">My Pockets</p>
            </li>
            {/* <li
              onClick={() => router.push(`/create-pocket`)}
              className="hover:text-purple normal-text md:hidden flex items-center"
            >
              <PlusIcon />
              <p className="ml-[5px]">Create Pocket</p>
            </li>
            <li
              onClick={() => router.push(`/portfolio`)}
              className="hover:text-purple normal-text flex items-center"
            >
              <BookIcon />
              <p className="ml-[5px]">View Portfolio</p>
            </li>
            <li
              onClick={() => router.push(`/history`)}
              className="hover:text-purple normal-text flex items-center"
            >
              <NoneIcon />
              <p className="ml-[5px]">View History</p>
            </li> */}
            <li
              onClick={async () => {
                if (chain === "SOL") {
                  disconnectSol();
                } else {
                  await disconnectEvm();
                }
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
