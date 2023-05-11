import { FC, useMemo, ReactNode, useCallback } from "react";
import { useRouter } from "next/router";
import {
  TabMenuIcon,
  TabHistoryIcon,
  TabProfileIcon,
  TabStrategyIcon,
} from "@/src/components/icons";
import classNames from "classnames";

export interface SideBarMenuItem {
  name: string;
  uri: string;
  icon(color: string): ReactNode;
  sideUris?: string[];
  newWindow?: boolean | true;
}

export const SideBar: FC = () => {
  const router = useRouter();

  /**
   * @dev Define @arrays of each tab items.
   */
  const tabItems = useMemo<SideBarMenuItem[]>(
    () => [
      {
        name: "My Pockets",
        uri: "/my-pockets",
        sideUris: ["/pocket/"],
        icon: (color: string) => <TabMenuIcon color={color} />,
      },
      {
        name: "History",
        uri: "/history",
        icon: (color: string) => <TabHistoryIcon color={color} />,
      },
      {
        name: "Strategy",
        uri: "/strategy",
        sideUris: ["/create-pocket"],
        icon: (color: string) => <TabStrategyIcon color={color} />,
      },
      {
        name: "Profile",
        uri: "/portfolio",
        icon: (color: string) => <TabProfileIcon color={color} />,
      },
    ],
    []
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
    <div className="w-full h-full px-[10px] py-[7px] border-solid border-r-[1px] border-dark90">
      {tabItems.map((item, index) => (
        <div
          onClick={() => router.push(item.uri)}
          className={classNames(
            "cursor-pointer flow-root sidebarBreakpoint:flex sidebarBreakpoint:justify-center mb-[20px] py-[20px] px-[20px] hover:bg-[#121320]",
            {
              "bg-[#121320]": isActive(item.uri, item.sideUris),
            }
          )}
          key={`tab-menu-item-${index}`}
        >
          <div className="flex sidebarBreakpoint:pl-[40px] pl-[80px]">
            <div className="float-left">
              {item.icon(
                isActive(item.uri, item.sideUris) ? "#735CF7" : "#7886A0"
              )}
            </div>
            <p
              className={classNames(
                "text-[16px] normal-text float-left ml-[10px] sidebarBreakpoint:hidden text-[#7886A0]",
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
    </div>
  );
};
