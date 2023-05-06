import { FC, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWalletKit } from "@gokiprotocol/walletkit";
import { Button } from "@hamsterbox/ui-kit";
import { PURPLE_HEADER_PAGES } from "@/src/utils";
import { HamsterboxIcon } from "@/src/components/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import classnames from "classnames";
import UserProfile from "@/src/components/header/user-profile";
import styled from "@emotion/styled";

const Header: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [curSlug, setCurSlug] = useState<string>("#about-us");
  const [isScrolled, setIsScrolled] = useState(false);
  const [chain, setChain] = useState<"SOL" | "ETH">("SOL");
  const router = useRouter();

  /**
   * Check homepage and display logo on dark theme
   * beside, set text color is white
   */
  const isHomepage = router.pathname === "/";

  /**
   * @dev Import GoGi providers.
   */
  const { connect: connectWallet } = useWalletKit();
  const { walletAddress } = useAppWallet();
  // const wallet = useConnectedWallet();

  /**
   * @dev The function to desire which blockchain to connect.
   */
  const handleConnect = useCallback(() => {
    if (chain === "SOL") {
      connectWallet();
    }
  }, [chain]);
  /**
   * @description
   * This function set current selected section based on the location user are in
   */
  useEffect(() => {
    if (router.asPath.includes("#")) {
      setCurSlug(`#${router.asPath.split("#")[1]}`);
    }
  }, []);

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
        "app-header md:fixed md:z-50 w-full px-[12px] md:px-0 mobile:block mobile:shadow-lg mobile:bg-[#060710]",
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
            <a className="cursor-pointer" onClick={() => router.push("/")}>
              <HamsterboxIcon
                className={classnames("w-[140px] md:w-[180px] hamsterbox-icon")}
                color={"white"}
              />
            </a>
          </div>
          <div className="flex">
            <div
              className="hidden md:flex memu-wrapper flex items-center md:pr-[40px]"
              style={{ height: "44px" }}
            >
              {
                <ul className="menu-container float-left">
                  {walletAddress && (
                    <Button
                      className="!rounded-[100px] after:!rounded-[100px] !px-[20px]"
                      text="Create a Pocket"
                      size="small"
                      onClick={() => router.push("/create-pocket")}
                      theme={{
                        backgroundColor: "#735CF7",
                        color: "#FFFFFF",
                      }}
                    />
                  )}
                </ul>
              }
            </div>
            <div className="relative flex items-center right-[16px]">
              <div className="float-right relative">
                {!walletAddress ? (
                  <div className="relative flex items-center">
                    <div
                      className="mr-[10px] bg-dark3 px-[20px] flex py-[7px] rounded-[20px] cursor-pointer"
                      onClick={() => setChain(chain === "SOL" ? "ETH" : "SOL")}
                    >
                      <img
                        className="w-[24px] h-[24px]"
                        src={`/assets/images/${
                          chain === "SOL" ? "solana.svg" : "bnb.svg"
                        }`}
                      />
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-[5px]"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.3913 10.75C20.6947 10.75 20.9681 10.5673 21.0842 10.287C21.2003 10.0068 21.1362 9.68417 20.9217 9.46967L15.9217 4.46967C15.6288 4.17678 15.1539 4.17678 14.861 4.46967C14.5681 4.76256 14.5681 5.23744 14.861 5.53033L18.5807 9.25H3.00003C2.58581 9.25 2.25003 9.58579 2.25003 10C2.25003 10.4142 2.58581 10.75 3.00003 10.75H20.3913ZM3.00002 13.25C2.69668 13.25 2.4232 13.4327 2.30711 13.713C2.19103 13.9932 2.25519 14.3158 2.46969 14.5303L7.46969 19.5303C7.76259 19.8232 8.23746 19.8232 8.53035 19.5303C8.82325 19.2374 8.82325 18.7626 8.53035 18.4697L4.81068 14.75H20.3913C20.8055 14.75 21.1413 14.4142 21.1413 14C21.1413 13.5858 20.8055 13.25 20.3913 13.25H3.00002Z"
                          fill="#7886A0"
                        />
                      </svg>
                    </div>{" "}
                    {chain === "SOL" ? (
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
    background-color: #000000;
    @media screen and (max-width: 768px) {
      background-color: #060710;
    }
  }
`;
