import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import {
  HistoryDesktopLayout,
  HistoryMobileLayout,
} from "@/src/components/history";

const Layout: FC = () => {
  return (
    <MainLayout>
      <LayoutWrapper
        layout={<HistoryDesktopLayout />}
        mobileLayout={<HistoryMobileLayout />}
      />
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
