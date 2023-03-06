import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import {
  BalanceGroup,
  EndedPoolGroupComponent,
} from "@/src/components/my-pools";
import { ClosedPockets } from "@/src/components/my-pools/ended-pockets";

const Layout: FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="!pt-[160px] pb-[100px]">
          <BalanceGroup />
          <EndedPoolGroupComponent />
          <ClosedPockets />
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
