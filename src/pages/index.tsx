import type { InferGetStaticPropsType } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import { useRouter } from "next/router";
import { statisticService } from "@/src/services/statistic.service";
import { StatisticEntity } from "@/src/entities/statistic.entity";
import { useEffect } from "react";
import { useWallet } from "../hooks/useWallet";

type LayoutProps = {
  data: StatisticEntity;
};
const Layout = (props: LayoutProps) => {
  const { data } = props;
  /**
   * @dev Router injected.
   */
  const router = useRouter();

  /**
   * @dev Wallet hook injected.
   */
  const wallet = useWallet();
  useEffect(() => {
    if (wallet?.solanaWallet.publicKey?.toString()) {
      router.push("/my-pockets");
    }
  }, [wallet]);

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pt-[60px] pb-[100px]">
          <section className="md:flex md:justify-center md:items-center">
            <div className="w-full md:w-[50%] mt-[60px] md:mt-0">
              <h1 className="banner-title">Self-Managed DCA Vault</h1>
              <h2 className="text-[48px] text-white normal-text relative top-[-20px]">
                HamsterPocket
              </h2>
              <p className="max-w-[498px] pr-10 text-white text-center text-[20px] mt-[15px] regular-text">
                HamsterPocket allows users to create and manage their own
                dollar-cost averaging pools (“pockets”) that will automatically
                execute the chosen strategies over time.
              </p>
              <div className="text-center mt-[34px]">
                <Button
                  className="mx-auto !px-[50px] !border-solid !border-white !border-[2px]"
                  theme={{
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                  text="Create a Pocket"
                  onClick={() => router.push("/create-pocket")}
                />
              </div>
            </div>
            <div className="w-full md:w-[30%] md:pt-[90px]">
              <img
                src="/assets/images/banner-icon.png"
                alt="Image"
                className="w-full h-[auto]"
              />
            </div>
          </section>
          <section className="pt-[50px] max-w-2xl mx-auto">
            <p className="text-center text-purple normal-text text-[24px]">
              Achievements
            </p>
            <p className="text-center text-white text-[32px] normal-text">
              HamsterPocket provides the most flexible DCA strategies to users
            </p>
            <div className="grid md:grid-cols-3 gap-3 pt-5">
              <div>
                <p className="text-center text-green text-[32px] normal-text">
                  {data.users}
                </p>
                <p className="text-center text-dark30 text-[18px] normal-text">
                  Users
                </p>
              </div>
              <div className="md:mt-0 mt-[20px]">
                <p className="text-center text-green text-[32px] normal-text">
                  {data.pockets}
                </p>
                <p className="text-center text-dark30 text-[18px] normal-text">
                  Pockets
                </p>
              </div>
              <div className="md:mt-0 mt-[20px]">
                <p className="text-center text-green text-[32px] normal-text">
                  $ {data.totalVolume}
                </p>
                <p className="text-center text-dark30 text-[18px] normal-text">
                  Total Volume
                </p>
              </div>
            </div>
          </section>
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <DashboardPageProvider>
      <Layout data={props.statistic} />
    </DashboardPageProvider>
  );
}

/**
 * @dev This function gets called at build time on server-side.
 * It won't be called on client-side, so you can even do
 * direct database queries.
 */
export async function getStaticProps() {
  // Call an external API endpoint to get statistic.
  const res = await statisticService.getStatistic();

  // By returning { props: { statistic } }, the Home component
  // will receive `statistic` as a prop at build time
  return {
    props: {
      statistic: res,
    },
  };
}

export default Home;
