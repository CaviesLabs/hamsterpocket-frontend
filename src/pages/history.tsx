import { FC, useEffect } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import HistoryController from "@/src/components/history/controller.component";
import TableComponent from "@/src/components/history/table.component";
import { useDispatch } from "react-redux";
import { getHistories } from "../redux/actions/history/history.action";

const Layout: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHistories({}));
  }, []);

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pb-[100px]">
          <BreadCrumb data={["Home", "History"]} />
          <p className="md:text-[32px] text-[24px] text-white mt-[22px]">
            History
          </p>
          <HistoryController />
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
