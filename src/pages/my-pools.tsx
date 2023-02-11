import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import {
  BalanceGroup,
  ActivePoolGroup,
  PoolItem,
} from "@/src/components/my-pools";

const Layout: FC = () => {
  // const proposals = useSelector((state: any) => state.proposals);
  const {} = useMain();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="!pt-[160px] pb-[100px]">
          <BalanceGroup />
          <ActivePoolGroup />
          <section>
            <PoolItem />
            <PoolItem />
            <PoolItem />
          </section>
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
