import { FC, useEffect } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import { BalanceGroup, ActivePoolGroup } from "@/src/components/my-pools";
import { useDispatch } from "react-redux";
import { getActivePockets } from "../redux/actions/pocket/pocket.action";
import { ActivePockets } from "@/src/components/my-pools/active-pockets";
import { useConnectedWallet } from "@saberhq/use-solana";

const Layout: FC = () => {
  const dispatch = useDispatch();
  const wallet = useConnectedWallet()?.publicKey.toString();

  useEffect(() => {
    if (!wallet) return;
    dispatch(
      getActivePockets({
        ownerAddress: wallet,
      })
    );
  }, [wallet]);
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
