import { FC, useEffect } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import { BalanceGroup, ActivePoolGroup } from "@/src/components/my-pools";
import { ActivePockets } from "@/src/components/my-pools/active-pockets";

const Layout: FC = () => {
  const {} = useMain();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="!pt-[160px] pb-[100px]">
          <BalanceGroup />
          <ActivePoolGroup />
          <ActivePockets />
        </LayoutSection>
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
