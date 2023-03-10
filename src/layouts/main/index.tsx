import { FC, ReactNode } from "react";
import { useMain } from "@/src/hooks/pages/main";
import Footer from "@/src/components/footer";
import Header from "@/src/components/header";
import AuthMiddleware from "@/src/components/middlewares/auth";
import animationData from "@/src/components/icons/animation-loading.json";
import Lottie from "react-lottie";
import MobileDenyMiddleware from "@/src/components/middlewares/mobile-deny";

export interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { transitionLoading, fistLoading } = useMain();

  return (
    <MobileDenyMiddleware>
      <AuthMiddleware>
        <div className="main-layout">
          <Header />
          <div className="layout-content min-h-[90.5vh]">{children}</div>
          <Footer />
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
    </MobileDenyMiddleware>
  );
};

export default MainLayout;
