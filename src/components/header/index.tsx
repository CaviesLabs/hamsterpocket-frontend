import { FC, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWalletKit } from "@gokiprotocol/walletkit";
import { Button } from "@hamsterbox/ui-kit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import classnames from "classnames";
import styled from "@emotion/styled";

import { ChainSelect } from "./chain-select";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { HamsterboxIcon } from "@/src/components/icons";
import { PURPLE_HEADER_PAGES } from "@/src/utils";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { ChainId } from "@/src/entities/platform-config.entity";
import UserProfile from "@/src/components/header/user-profile";
import { useAptosWallet } from "@/src/hooks/useAptos";

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { chainId, pushRouterWithChainId } = usePlatformConfig();
  const router = useRouter();

  /**
   * Check homepage and display logo on dark theme
   * beside, set text color is white
   */
  const isHomepage = router.pathname === "/";

  /**
   * @dev Import GoGi providers.
   */
  const { connect: connectAptos } = useAptosWallet();
  const { connect: connectWallet } = useWalletKit();
  const { walletAddress } = useAppWallet();

  /**
   * @dev The function to desire which blockchain to connect.
   */
  const handleConnect = useCallback(() => {
    if (chainId === ChainId.sol) {
      connectWallet();
    } else if (chainId.toLowerCase().includes("aptos")) {
      connectAptos();
    }
  }, [chainId, connectWallet, connectAptos]);

  /**
   * @description
   * This function will focus on header menu item when user scroll into the view
   * which menu-item present for
   */
  useEffect(() => {
    const header = document.getElementById("app-header");
    const className = "scrolled-header";
    window.onscroll = () => {
      if (
        document.body.scrollTop > 120 ||
        document.documentElement.scrollTop > 120
      ) {
        !header?.classList.contains(className) && setIsScrolled(true);
      } else {
        header?.classList.contains(className) && setIsScrolled(false);
      }
    };
  });

  return (
    <StyledHeader
      className={classnames(
        "app-header md:fixed md:z-50 w-full px-[12px] md:px-0 mobile:block mobile:shadow-lg mobile:bg-[#060710] md:px-[30px]",
        {
          /**
           * @dev Restrict fill purple background & clear border for specific pages.
           */
          "bg-purpleBg border-b-[0px]": PURPLE_HEADER_PAGES.filter((item) =>
            router.asPath.includes(item)
          ).length,
          "text-white": !isScrolled && isHomepage,
          "scrolled-header shadow-lg": isScrolled,
        }
      )}
      id="app-header"
    >
      <div className="w-full py-[18px] md:py-[25px] flow-root">
        <div className="md:max-w-[1440px] mx-auto flex justify-between">
          <div className="logo-wrapper md:mt-0 flex items-center">
            <a
              className="cursor-pointer"
              onClick={() => pushRouterWithChainId("/")}
            >
              <HamsterboxIcon
                className={classnames("w-[140px] md:w-[180px] hamsterbox-icon")}
                color={"white"}
              />
            </a>
          </div>
          <div className="flex">
            <div
              className="flex memu-wrapper flex items-center md:pr-[22px]"
              style={{ height: "44px" }}
            >
              {
                <ul className="menu-container float-left flex items-center">
                  {walletAddress && (
                    <div className="mobile:hidden">
                      <Button
                        className="!rounded-[100px] after:!rounded-[100px] !px-[20px]"
                        text="Create a Pocket"
                        size="small"
                        onClick={() => pushRouterWithChainId("/strategy")}
                        theme={{
                          backgroundColor: "#735CF7",
                          color: "#FFFFFF",
                        }}
                      />
                    </div>
                  )}
                  <ChainSelect />
                </ul>
              }
            </div>
            <div className="relative flex items-center right-[16px]">
              <div className="float-right relative">
                {!walletAddress ? (
                  <div className="relative flex items-center">
                    {chainId === ChainId.sol ||
                    chainId.toLowerCase().includes("aptos") ? (
                      <Button
                        className="!px-8 mobile:!text-[12px] mobile:!px-[10px] mobile:!py-[3px]"
                        size="small"
                        text="Connect Wallet"
                        onClick={handleConnect}
                        theme={{
                          backgroundColor: "#735CF7",
                          color: "#FFFFFF",
                        }}
                      />
                    ) : (
                      <ConnectButton.Custom>
                        {({ account, chain, openConnectModal, mounted }) => {
                          if (
                            account &&
                            (router.asPath === `/` ||
                              router.asPath === `/${chainId}` ||
                              router.asPath === `/${chainId}/`)
                          ) {
                            pushRouterWithChainId("/my-pockets");
                            return <></>;
                          }

                          return (
                            <div
                              {...(!mounted && {
                                "aria-hidden": true,
                                style: {
                                  opacity: 0,
                                  pointerEvents: "none",
                                  userSelect: "none",
                                },
                              })}
                            >
                              {(() => {
                                if (!mounted || !account || !chain) {
                                  return (
                                    <Button
                                      className="!px-8 mobile:!text-[12px] mobile:!px-[10px] mobile:!py-[3px]"
                                      size="small"
                                      text="Connect Wallet"
                                      onClick={openConnectModal}
                                      theme={{
                                        backgroundColor: "#735CF7",
                                        color: "#FFFFFF",
                                      }}
                                    />
                                  );
                                }
                              })()}
                            </div>
                          );
                        }}
                      </ConnectButton.Custom>
                    )}{" "}
                  </div>
                ) : (
                  <UserProfile />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.div`
  transition: background-color 0.3s ease;
  &.scrolled-header {
    background-color: #121320;
    @media screen and (max-width: 768px) {
      background-color: #121320;
    }
  }
`;
