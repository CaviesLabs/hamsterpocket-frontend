import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet } from "@saberhq/use-solana";
import { Button } from "@hamsterbox/ui-kit";
import { PURPLE_HEADER_PAGES } from "@/src/utils";
import classnames from "classnames";
import UserProfile from "@/src/components/header/user-profile";
import { HamsterboxIcon } from "@/src/components/icons";
import styled from "@emotion/styled";

const Header: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [curSlug, setCurSlug] = useState<string>("#about-us");
  const [isScrolled, setIsScrolled] = useState(false);
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
  const wallet = useConnectedWallet();

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
      className={classnames("app-header fixed z-50 w-full  px-[12px] md:px-0", {
        /**
         * @dev Restrict fill purple background & clear border for specific pages.
         */
        "bg-purpleBg border-b-[0px]": PURPLE_HEADER_PAGES.filter((item) =>
          router.asPath.includes(item)
        ).length,
        "text-white": !isScrolled && isHomepage,
        "scrolled-header shadow-lg": isScrolled,
      })}
      id="app-header"
    >
      <div className="w-full py-[18px] md:py-[25px] flow-root">
        <div className="md:max-w-[1140px] mx-auto flex justify-between">
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
                  {wallet && (
                    <Button
                      className="!rounded-[100px] after:!rounded-[100px] !px-[20px]"
                      text="Create a Pocket"
                      size="small"
                      onClick={() => router.push("/create-pocket")}
                      theme={{
                        backgroundColor: "#B998FB",
                        color: "#FFFFFF",
                      }}
                    />
                  )}
                </ul>
              }
            </div>
            <div className="relative flex items-center right-[16px]">
              <div className="float-right relative">
                {!wallet ? (
                  <div className="relative">
                    {" "}
                    <Button
                      className="!px-8 mobile:!text-[12px] mobile:!px-[10px] mobile:!py-[3px]"
                      size="small"
                      text="Connect Wallet"
                      onClick={connectWallet}
                      theme={{
                        backgroundColor: "#B998FB",
                        color: "#FFFFFF",
                      }}
                    />{" "}
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
  }
`;
