import { FC, useRef, useState } from "react";
import { DropdownArrowIcon } from "@/src/components/icons";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import classnames from "classnames";
import styles from "./index.module.scss";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";

export type ChainItem = {
  id: string;
  image: string;
  name?: string;
};

const chains: ChainItem[] = [
  {
    id: "bnb",
    image: "/assets/images/bnb.svg",
  },
  {
    id: "xdc",
    image: "https://xinfin.org/assets/images/brand-assets/xdc-icon.png",
  },
  {
    id: "okt",
    image:
      "https://cdn.bitkeep.vip/u_b_1697a330-c21d-11ed-bb06-6b42bb500220.png",
  },
  {
    id: "polygon_mumbai",
    image: "/assets/images/matic.png",
    name: "mumbai",
  },
  {
    id: "solana",
    image: "/assets/images/solana.svg",
  },
];

export const ChainSelect: FC = () => {
  const { chainId, switchChainId } = usePlatformConfig();
  const { walletAddress } = useAppWallet();

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
        "relative border-solid border-[0px] border-purple300 rounded-[50px] cursor-pointer avatar-profile bg-[#242636] p-[10px] ml-[5px]",
        styles["chain-select"]
      )}
      ref={ref}
    >
      <span
        className="text-[12px] md:text-[14px] text-white flex items-center"
        onClick={() => !walletAddress && setShow(!show)}
      >
        <img
          className="w-[24px] h-[24px]"
          src={chains.find((item) => item.id === chainId)?.image}
        />
        <DropdownArrowIcon className="ml-2 text-dark50" />
      </span>
      <ul
        style={{ display: show ? "block" : "none" }}
        className={styles["toggle-container"]}
      >
        <div className={styles.container}>
          <ul>
            {chains
              .filter((item) => item.id !== chainId)
              .map((item, key) => (
                <li
                  key={`kksk-${key}`}
                  onClick={() => switchChainId(item.id)}
                  className="hover:text-purple normal-text flex items-center"
                >
                  <img className="w-[24px] h-[24px]" src={item.image} />
                  <p className="ml-[5px]">
                    {(item.name || item.id).toUpperCase()}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </ul>
    </div>
  );
};
