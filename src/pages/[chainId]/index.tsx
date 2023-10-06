import styles from "@/styles/Home.module.css";
import { useCallback } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useWalletKit } from "@gokiprotocol/walletkit";
import { Button } from "@hamsterbox/ui-kit";

import MainLayout from "@/src/layouts/main";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { LayoutSection } from "@/src/components/layout-section";
import { statisticService } from "@/src/services/statistic.service";
import { StatisticEntity } from "@/src/entities/statistic.entity";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { useAptosWallet } from "@/src/hooks/useAptos";

type LayoutProps = {
  data: StatisticEntity;
};
const Layout = (props: LayoutProps) => {
  const { data } = props;

  /**
   * @dev Wallet hook injected.
   */
  // const wallet = useWallet();
  const { walletAddress } = useAppWallet();
  const { chainId, pushRouterWithChainId } = usePlatformConfig();
  const { connect: connectWallet } = useWalletKit();
  const { connect: connectAptos } = useAptosWallet();
  const { analyzeDecimals } = useWhiteList();

  const handleCreatePocket = useCallback(
    (openModalEvm: () => void) => {
      if (!walletAddress) {
        if (chainId === ChainId.aptos) {
          connectAptos();
          return;
        }

        if (chainId === ChainId.sol) {
          connectWallet();
          return;
        }

        openModalEvm();
      } else {
        pushRouterWithChainId("/strategy");
      }
    },
    [walletAddress, chainId]
  );

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pt-[60px] pb-[100px] !mx-auto">
          <section className="md:flex md:items-center">
            <div className="w-full md:!hidden">
              <img
                src="/assets/images/banner-icon-multichain.png"
                alt="Image"
                className="w-full h-[auto]"
              />
            </div>
            <div className="w-full md:w-[57%]">
              <h1 className="banner-title mobile:!text-[26px] mobile:!text-center">
                Self-Managed <br className="md:block hidden" /> DCA Vault
              </h1>
              <h2 className="text-[40px] text-white normal-text relative mobile:!text-[26px] mobile:!text-center md:mt-[20px] md:top-0 top-[-20px]">
                Hamsterpocket
              </h2>
              <div className="max-w-[498px] md:text-left text-center md:top-[-20px] relative">
                <p className="text-white text-[18px] mt-[15px]  normal-text mobile:!text-[14px] mobile:!text-center">
                  Hamsterpocket allows users to create and manage their own
                  dollar-cost averaging pools (“pockets”) that will
                  automatically execute the chosen strategies over time.
                </p>
                <div className="mt-[34px]">
                  <ConnectButton.Custom>
                    {({ openConnectModal, mounted }) => {
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
                src="/assets/images/banner-icon-multichain.png"
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
                  $ {analyzeDecimals(data.totalVolume)}
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
