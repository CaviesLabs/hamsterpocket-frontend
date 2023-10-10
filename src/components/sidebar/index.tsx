import { FC, useMemo, ReactNode, useCallback } from "react";
import { useRouter } from "next/router";
import {
  TabMenuIcon,
  TabHistoryIcon,
  TabProfileIcon,
  TabStrategyIcon,
} from "@/src/components/icons";
import { HamsterboxIcon, CaviesIcon } from "@/src/components/icons";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import classNames from "classnames";
export interface FooterItem {
  name: string;
  uri: string;
  newWindow?: boolean | true;
}

export interface SocialItem {
  image: string;
  uri: string;
}
export interface SideBarMenuItem {
  name: string;
  uri: string;
  icon(color: string): ReactNode;
  sideUris?: string[];
  newWindow?: boolean | true;
}

export const SideBar: FC = () => {
  const { pushRouterWithChainId, chainId } = usePlatformConfig();
  const router = useRouter();

  const footers = useMemo<FooterItem[]>(
    () => [
      {
        name: "About Us",
        uri: "https://cavies.notion.site/About-Cavies-72e60c00426b450e8e57ca3ea5acb0d0",
      },
      {
        name: "Contact Us",
        uri: "mailto:contact@cavies.xyz",
      },
      {
        name: "How it work",
        uri: "https://cavies.notion.site/HamsterPocket-3d9c0a80b312457188f286fd523dc2f4",
      },
    ],
    []
  );

  /**
   * @dev Define @arrays of each tab items.
   */
  const tabItems = useMemo<SideBarMenuItem[]>(
    () => [
      {
        name: "My Pockets",
        uri: `/${chainId}/my-pockets`,
        sideUris: [`/${chainId}/pocket`],
        icon: (color: string) => <TabMenuIcon color={color} />,
      },
      {
        name: "History",
        uri: `/${chainId}/history`,
        icon: (color: string) => <TabHistoryIcon color={color} />,
      },
      {
        name: "Strategy",
        uri: `/${chainId}/strategy`,
        sideUris: [`${chainId}/create-pocket`],
        icon: (color: string) => <TabStrategyIcon color={color} />,
      },
      {
        name: "Profile",
        uri: `/${chainId}/profile`,
        icon: (color: string) => <TabProfileIcon color={color} />,
      },
    ],
    [chainId]
  );

  /**
   * @dev The function to enable ui for active.
   */
  const isActive = useCallback(
    (uri: string, sideUris?: string[]) => {
      if (uri === router.asPath.toString()) {
        return true;
      }

      if (
        sideUris &&
        sideUris.filter((uri) => router.asPath.toString().includes(uri)).length
      ) {
        return true;
      }

      /** @dev Return default value.  */
      return false;
    },
    [router]
  );

  return (
    <div className="w-full h-full px-[10px] py-[7px] border-solid border-r-[1px] border-dark90 relative min-h-[100vh]">
      {tabItems.map((item, index) => (
        <div
          onClick={() => router.push(item.uri)}
          className={classNames(
            "cursor-pointer flow-root sidebarBreakpoint:flex sidebarBreakpoint:justify-center mb-[20px] py-[20px] px-[20px] hover:bg-[#121320] rounded-[8px]",
            {
              "bg-[#121320]": isActive(item.uri, item.sideUris),
            }
          )}
          key={`tab-menu-item-${index}`}
        >
          <div className="flex float-right w-[150px]">
            <div className="float-left">
              {item.icon(
                isActive(item.uri, item.sideUris) ? "#735CF7" : "#7886A0"
              )}
            </div>
            <p
              className={classNames(
                "text-[16px] normal-text float-left ml-[10px] sidebarBreakpoint:hidden text-dark50",
                {
                  "!text-purple300": isActive(item.uri, item.sideUris),
                }
              )}
            >
              {item.name}
            </p>
          </div>
        </div>
      ))}
      <div className="absolute right-0 left-0 bottom-[200px] sidebarBreakpoint:hidden">
        <div className="menu-wrapper md:pt-0 pt-[20px]">
          <ul className="footer-menu w-[100%]">
            {footers.map((item, index) => (
              <li
                key={`footer-item-${index}`}
                className="text-center mr-2 leading-[35px] md:leading-[25px] mt-[10px]"
              >
                <a
                  target={item.newWindow === false ? "" : "_blank"}
                  href={item.uri}
                  className="p-2 text-[14px] md:text-[14px] normal-text text-dark50 regular-text"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a onClick={() => pushRouterWithChainId("/")}>
          <HamsterboxIcon
            className="w-[155px] h-auto  mx-auto cursor-pointer mt-[10px]"
            color="white"
          />
        </a>
        <div className="flex mx-auto mt-[14px] justify-center items-start">
          <div className="top-0 regular-text text-[14px] mr-[5px] text-dark30">
            by
          </div>
          <a href="https://cavies.xyz/" target="_blank">
            <CaviesIcon className="w-[110px] h-auto" />
          </a>
        </div>
      </div>
    </div>
  );
};
