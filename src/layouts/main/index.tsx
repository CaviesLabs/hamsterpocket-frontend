import { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { useMain } from "@/src/hooks/pages/main";
import { TabBar } from "@/src/components/tabbar";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import { SideBar } from "@/src/components/sidebar";
import Footer from "@/src/components/footer";
import AuthMiddleware from "@/src/components/middlewares/auth";
import animationData from "@/src/components/icons/animation-loading.json";
import Lottie from "react-lottie";

import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/src/components/header"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  /**
   * @dev Import context for supporting ui handle.
   */
  const { transitionLoading, fistLoading } = useMain();
  const { chainId } = usePlatformConfig();

  /**
   * @dev Import next router hook.
   */
  const router = useRouter();

  return (
    <AuthMiddleware>
      <div className="main-layout">
        <Header />
        <div className="layout-content md:min-h-[90.5vh] mobile:h-[87vh] mobile:overflow-y-scroll">
          <LayoutWrapper
            mobileLayout={children}
            layout={
              router.asPath === `/` ||
              router.asPath === `/${chainId}` ||
              router.asPath === `/${chainId}/` ? (
                children
              ) : (
                <div className="flex">
                  <div className="float-left w-[16%] sidebarBreakpoint:w-[7%] !pt-[120px] !pb-[100px]">
                    <SideBar />
                  </div>
                  <div className="float-left w-[74%] sidebarBreakpoint:w-[93%]">
                    {children}
                  </div>
                </div>
              )
            }
          />
        </div>
        <Footer />
        <TabBar />
      </div>
      {fistLoading && (
        <div
          className="w-full h-full fixed top-0 bottom-0 right-0 left-0 bg-white"
          style={{ zIndex: 100 }}
        >
          <Lottie
            style={{ width: "300px" }}
            options={{
              animationData,
            }}
          />
        </div>
      )}
      {transitionLoading && (
        <div
          className="w-[185px] fixed bottom-[20px] right-[81px]"
          style={{ zIndex: 100 }}
        >
          <Lottie
            options={{
              animationData,
            }}
          />
        </div>
      )}
    </AuthMiddleware>
  );
};

export default MainLayout;
