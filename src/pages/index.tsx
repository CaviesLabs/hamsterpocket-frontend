import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import { Button } from "@hamsterbox/ui-kit";
import { useRouter } from "next/router";

const Layout: FC = () => {
  // const proposals = useSelector((state: any) => state.proposals);
  const {} = useMain();

  /**
   * @dev Router injected.
   */
  const router = useRouter();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="pt-[60px] pb-[100px]">
          <section className="md:flex md:items-center">
            <div className="w-full md:w-[60%] md:pr-[200px] mt-[60px] md:mt-0">
              <h1 className="banner-title text-center">Amazing DCA Tool</h1>
              <h2 className="text-[48px] text-white text-center normal-text relative top-[-20px]">
                HamsterPocket
              </h2>
              <p className="max-w-[498px] mx-auto text-white text-center text-[20px] mt-[15px] regular-text">
                The purpose of lorem ipsum is to create a natural looking block
                of text (sentence, paragraph, page, etc.) that doesn't distract
                from the layout.
              </p>
              <div className="text-center mt-[34px]">
                <Button
                  className="mx-auto !px-[50px] !border-solid !border-white !border-[2px]"
                  theme={{
                    backgroundColor: "transparent",
                    color: "white",
                  }}
                  text="Create a Pocket"
                  onClick={() => router.push("/my-pools")}
                />
              </div>
            </div>
            <div className="w-full md:w-[40%] md:pt-[90px]">
              <img
                src="/assets/images/banner-icon.png"
                alt="Image"
                className="w-full h-[auto]"
              />
            </div>
          </section>
          <section className="pt-[50px]">
            <p className="text-center text-purple normal-text text-[24px]">
              Achievements
            </p>
            <p className="text-center text-white text-[32px] normal-text">
              Some text here about numbers
            </p>
            <div className="grid md:grid-cols-3 gap-3 pt-[50px]">
              <div>
                <p className="text-center text-green text-[32px] normal-text">
                  6,458
                </p>
                <p className="text-center text-dark30 text-[18px] normal-text">
                  Users
                </p>
              </div>
              <div className="md:mt-0 mt-[20px]">
                <p className="text-center text-green text-[32px] normal-text">
                  17,934
                </p>
                <p className="text-center text-dark30 text-[18px] normal-text">
                  Pockets
                </p>
              </div>
              <div className="md:mt-0 mt-[20px]">
                <p className="text-center text-green text-[32px] normal-text">
                  $ 35,293.04
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

const Home: NextPage = () => {
  return (
    <DashboardPageProvider>
      <Layout />
    </DashboardPageProvider>
  );
};

export default Home;
