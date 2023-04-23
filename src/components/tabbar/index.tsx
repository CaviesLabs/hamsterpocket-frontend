import { FC, useMemo, ReactNode } from "react";
import { useRouter } from "next/router";
import {
  TabMenuIcon,
  TabHistoryIcon,
  TabProfileIcon,
} from "@/src/components/icons";
import classNames from "classnames";

export interface TabbarMenuItem {
  name: string;
  uri: string;
  icon(color: string): ReactNode;
  newWindow?: boolean | true;
}

export const TabBar: FC = () => {
  const router = useRouter();

  /**
   * @dev Define @arrays of each tab items.
   */
  const tabItems = useMemo<TabbarMenuItem[]>(
    () => [
      {
        name: "My Pockets",
        uri: "/my-pockets",
        icon: (color: string) => <TabMenuIcon color={color} />,
      },
      {
        name: "History",
        uri: "/history",
        icon: (color: string) => <TabHistoryIcon color={color} />,
      },
      {
        name: "Profile",
        uri: "/portfolio",
        icon: (color: string) => <TabProfileIcon color={color} />,
      },
    ],
    []
  );

  return (
    <div className="tabbar fixed z-50 w-full h-[100px] bottom-0 hidden mobile:block pt-[10px] border-t-[1px] border-t-solid border-t-[#242636] bg-[#060710]">
      <div className="w-full px-[10px] py-[7px] grid grid-cols-3">
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
              className={classNames("mt-[10px] text-[12px] normal-text", {
                "text-purple300": item.uri === router.asPath.toString(),
              })}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
