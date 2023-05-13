import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import { ActivePoolGroup } from "@/src/components/my-pools";

const Layout: FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="md:!pt-[130px] pb-[100px]">
          <ActivePoolGroup />
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
