import { FC } from "react";
import type { NextPage } from "next";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import {
  PortfolioMobileLayout,
  PortfolioDesktopLayout,
} from "@/src/components/portfolio";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";

const Layout: FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutWrapper
          layout={<PortfolioDesktopLayout />}
          mobileLayout={<PortfolioMobileLayout />}
        />
      </div>
    </MainLayout>
  );
};

const Home: NextPage = () => {
  return (
    <DashboardPageProvider>
      <Layout />
    </DashboardPageProvider>
  );
};

export default Home;
