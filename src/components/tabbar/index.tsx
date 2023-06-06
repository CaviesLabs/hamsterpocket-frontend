import { FC, useMemo, ReactNode } from "react";
import { useRouter } from "next/router";
import {
  TabMenuIcon,
  TabHistoryIcon,
  TabProfileIcon,
  TabStrategyIcon,
} from "@/src/components/icons";
import classNames from "classnames";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";

export interface TabbarMenuItem {
  name: string;
  uri: string;
  icon(color: string): ReactNode;
  newWindow?: boolean | true;
}

export const TabBar: FC = () => {
  const router = useRouter();
  const { chainId } = usePlatformConfig();

  /**
   * @dev Define @arrays of each tab items.
   */
  const tabItems = useMemo<TabbarMenuItem[]>(
    () => [
      {
        name: "My Pockets",
        uri: chainId ? `/${chainId}/my-pockets` : "/my-pockets",
        icon: (color: string) => <TabMenuIcon color={color} />,
      },
      {
        name: "Strategy",
        uri: chainId ? `/${chainId}/strategy` : "/strategy",
        icon: (color: string) => <TabStrategyIcon color={color} />,
      },
      {
        name: "History",
        uri: chainId ? `/${chainId}/history` : "/history",
        icon: (color: string) => <TabHistoryIcon color={color} />,
      },
      {
        name: "Profile",
        uri: chainId ? `/${chainId}/profile` : "/profile",
        icon: (color: string) => <TabProfileIcon color={color} />,
      },
    ],
    []
  );

  return router.asPath !== "/" ? (
    <div className="tabbar fixed z-50 w-full h-[100px] bottom-0 hidden mobile:block pt-[10px] border-t-[1px] border-t-solid border-t-[#242636] bg-[#060710]">
      <div className="w-full px-[10px] py-[7px] grid grid-cols-4">
        {tabItems.map((item, index) => (
          <div
            onClick={() => router.push(item.uri)}
            className="col-span-1 text-center cursor-pointer"
            key={`tab-menu-item-${index}`}
          >
            <div className="mx-auto flex justify-center">
              {item.icon(
                item.uri === router.asPath.toString() ? "#735CF7" : "#7886A0"
              )}
            </div>
            <p
              className={classNames(
                "mt-[10px] text-[12px] normal-text text-dark50",
                {
                  "text-purple300": item.uri === router.asPath.toString(),
                }
              )}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
