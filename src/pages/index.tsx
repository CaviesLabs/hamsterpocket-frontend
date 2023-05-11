import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import { useRouter } from "next/router";
import { statisticService } from "@/src/services/statistic.service";
import { StatisticEntity } from "@/src/entities/statistic.entity";
import { useCallback, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";
import { useWalletKit } from "@gokiprotocol/walletkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppWallet } from "@/src/hooks/useAppWallet";

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
  const { chain, walletAddress } = useAppWallet();
  const { connect: connectWallet } = useWalletKit();
  useEffect(() => {
    if (wallet?.solanaWallet.publicKey?.toString()) {
      router.push("/my-pockets");
    }
  }, [wallet]);

  const handleCreatePocket = useCallback(
    (openModalEvm: () => void) => {
      if (!walletAddress) {
        if (chain === "SOL") {
          connectWallet();
        } else {
          openModalEvm();
        }
      }
      router.push("/create-pocket");
    },
    [walletAddress, chain]
  );

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pt-[60px] pb-[100px] !mx-auto">
          <section className="md:flex md:items-center">
            <div className="w-full md:!hidden">
              <img
                src="/assets/images/banner-icon.png"
                alt="Image"
                className="w-full h-[auto]"
              />
            </div>
            <div className="w-full md:w-[57%]">
              <h1 className="banner-title mobile:!text-[26px] mobile:!text-center">
                Self-Managed DCA Vault
              </h1>
              <h2 className="text-[48px] text-white normal-text relative top-[-20px] mobile:!text-[26px] mobile:!text-center">
                Hamsterpocket
              </h2>
              <div className="max-w-[498px] text-center">
                <p className="text-white text-[20px] mt-[15px] mobile:mt-0 normal-text leading-[33px] tracking-[0.72px] mobile:!text-[14px] mobile:!text-center">
                  Hamsterpocket allows users to create and manage their own
                  dollar-cost averaging pools (“pockets”) that will
                  automatically execute the chosen strategies over time.
                </p>
                <div className="mt-[34px]">
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, mounted }) => {
                      return (
                        <div
                          {...(!mounted && {
                            "aria-hidden": true,
                            style: {
                              opacity: 0,
                              pointerEvents: "none",
                              userSelect: "none",
                            },
                          })}
                        >
                          {(() => {
                            if (!mounted || !account || !chain) {
                              return (
                                <Button
                                  className="mx-auto !text-[18px] mobile:!text-[14px] !px-[50px]"
                                  theme={{
                                    backgroundColor: "#735CF7",
                                    color: "#FFFFFF",
                                  }}
                                  text="Create a Pocket"
                                  onClick={() =>
                                    handleCreatePocket(openConnectModal)
                                  }
                                />
                              );
                            }
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[35%] mt-28 mobile:!hidden">
              <img
                src="/assets/images/banner-icon.png"
                alt="Image"
                className="w-full h-[auto]"
              />
            </div>
          </section>
          <section className="pt-[50px] max-w-2xl mx-auto">
            <p className="text-center text-purple300 normal-text text-[24px] mobile:text-[18px]">
              Achievements
            </p>
            <p className="text-center text-white text-[32px]  mobile:text-[20px] normal-text">
              Hamsterpocket provides the most flexible DCA strategies to users
            </p>
          </section>
          <section className="pt-5 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <p className="text-center text-green text-[32px] mobile:text-[20px] normal-text">
                  {data.users}
                </p>
                <p className="text-center text-dark30 text-[18px] mobile:text-[16px] normal-text">
                  Users
                </p>
              </div>
              <div className="md:mt-0 mt-[20px]">
                <p className="text-center text-green text-[32px] mobile:text-[20px] normal-text">
                  {data.pockets}
                </p>
                <p className="text-center text-dark30 text-[18px] mobile:text-[16px] normal-text">
                  Pockets
                </p>
              </div>
              <div className="md:mt-0 mt-[20px]">
                <p className="text-center text-green text-[32px] mobile:text-[20px] normal-text">
                  $ {data.totalVolume.toFixed(2)}
                </p>
                <p className="text-center text-dark30 text-[18px] mobile:text-[16px] normal-text">
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

function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <DashboardPageProvider>
      <Layout data={props.statistic} />
    </DashboardPageProvider>
  );
}

/**
 * @dev This function gets called on server-side.
 * It never runs on the browser, so you can even do
 * direct database queries.
 */
export const getServerSideProps: GetServerSideProps<{
  statistic: any;
}> = async () => {
  const res = await statisticService.getStatistic();
  return {
    props: {
      statistic: res,
    }, // will be passed to the page component as props
  };
};

export default Home;
