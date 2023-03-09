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
import { useWalletKit } from "@gokiprotocol/walletkit";

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
  const { connect: connectWallet } = useWalletKit();
  useEffect(() => {
    if (wallet?.solanaWallet.publicKey?.toString()) {
      router.push("/my-pockets");
    }
  }, [wallet]);

  const handleCreatePocket = () => {
    if (wallet?.solanaWallet.publicKey) {
      router.push("/create-pocket");
    } else {
      connectWallet();
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pt-[60px] pb-[100px]">
          <section className="md:flex md:items-center">
            <div className="w-full md:w-[57%]">
              <h1 className="banner-title">Self-Managed DCA Vault</h1>
              <h2 className="text-[48px] text-white normal-text relative top-[-20px]">
                HamsterPocket
              </h2>
              <div className="max-w-[498px] text-center">
                <p className="text-white text-[20px] mt-[15px] regular-text leading-[33px] tracking-[0.72px]">
                  HamsterPocket allows users to create and manage their own
                  dollar-cost averaging pools (“pockets”) that will
                  automatically execute the chosen strategies over time.
                </p>
                <div className="mt-[34px]">
                  <Button
                    className="mx-auto !text-[18px] !px-[50px] !border-solid !border-white !border-[2px]"
                    theme={{
                      backgroundColor: "transparent",
                      color: "white",
                    }}
                    text="Create a Pocket"
                    onClick={() => handleCreatePocket()}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-[35%] mt-28">
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
          </section>
          <section className="pt-5 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-3">
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
  return {
    props: {
      statistic: res,
    },
  };
}

export default Home;
