import { FC, useMemo, useRef, useState } from "react";

import classnames from "classnames";
import styles from "./index.module.scss";

import { useAppWallet } from "@/src/hooks/useAppWallet";
import { DropdownArrowIcon } from "@/src/components/icons";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import useOnClickOutside from "@/src/hooks/useOnClickOutside";

export const ChainSelect: FC = () => {
  const { chainId, switchChainId, chainInfos } = usePlatformConfig();
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

  const chains = useMemo(() => {
    if (!chainInfos) return [];
    return Object.keys(chainInfos).map((key) => ({
      id: key,
      name: chainInfos?.[key]?.chainName,
      image: chainInfos?.[key]?.chainLogo,
    }));
  }, [chainInfos]);

  const avaliableChains = useMemo(() => {
    return chains
      .filter((item) => item.id !== chainId)
      .filter((item) => {
        if (
          process.env.ENV === "prod" &&
          (item.id === "polygon_mumbai" || item.id.includes("testnet"))
        ) {
          return false;
        }
        return true;
      });
  }, [chains, chainId]);

  return (
    <div
      className={classnames(
        "relative border-solid border-[0px] border-purple300 rounded-[50px] cursor-pointer avatar-profile bg-[#242636] p-[10px] ml-[5px] mobile:mr-[20px] mobile:py-[6px]",
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
        style={{
          display: show ? "block" : "none",
          bottom: `-${avaliableChains.length * 39}px`,
        }}
        className={styles["toggle-container"]}
      >
        <div className={styles.container}>
          <ul>
            {avaliableChains.map((item, key) => (
              <li
                key={`kksk-${key}`}
                onClick={() => {
                  switchChainId(item.id);
                  setShow(false);
                }}
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
