import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponent from "@/src/components/portfolio/dashboard.component";

const Layout: FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pb-[100px]">
          <BreadCrumb data={["Home", "Portfolio"]} />
          <p className="md:text-[32px] text-[20px] text-white mt-[22px]">
            Portfolio
          </p>
          <DashboardComponent />
          <PortfolioController />
          <TableComponent />
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
