import { FC, useMemo, useRef, useState } from "react";
import { utilsProvider, AVATAR_ENDPOINT } from "@/src/utils";
import { useConnectedWallet } from "@saberhq/use-solana";
import { useRouter } from "next/router";
import { useWallet } from "@/src/hooks/useWallet";
import { LoggoutIcon } from "@/src/components/icons";
import classnames from "classnames";
import styles from "./index.module.scss";
import { DownOutlined } from "@ant-design/icons";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";

const UserProfile: FC = () => {
  const wallet = useConnectedWallet();
  const router = useRouter();
  const { disconnect } = useWallet();

  /**
   * @dev Get wallet public key address.
   */
  const walletPublicKey = useMemo(
    () => wallet?.publicKey?.toString(),
    [wallet]
  );

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
        "relative flex items-center h-full py-[3px] px-[10px] border-solid border-[0px] border-purple rounded-[5px] cursor-pointer avatar-profile",
        styles["avatar-profile"]
      )}
      ref={ref}
    >
      <img
        className="w-[20px] md:w-[40px] h-[auto] mr-[10px]"
        src={`${AVATAR_ENDPOINT}/${walletPublicKey}.png`}
        alt="Boring avatar"
      />
      <span
        className="text-[7px] md:text-[14px] text-white flex items-center"
        onClick={() => setShow(!show)}
      >
        {utilsProvider.makeShort(walletPublicKey, 3)}{" "}
        <DownOutlined style={{ fontSize: 14 }} className="ml-2" />
      </span>
      <ul
        style={{ display: show ? "block" : "none" }}
        className={styles["toggle-container"]}
      >
        <div className={styles.container}>
          <ul>
            <li
              onClick={() => router.push(`/my-pockets`)}
              className="hover:text-purple normal-text"
            >
              My Pockets
            </li>
            <li
              onClick={() => router.push(`/portfolio`)}
              className="hover:text-purple normal-text"
            >
              View Portfolio
            </li>
            <li
              onClick={() => router.push(`/history`)}
              className="hover:text-purple normal-text"
            >
              View History
            </li>
            <li
              onClick={disconnect}
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
