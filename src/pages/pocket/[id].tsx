import type { NextPage } from "next";
import { useRouter } from "next/router";
import { LayoutSection } from "@/src/components/layout-section";
import { LeftIcon, ShareIcon } from "@/src/components/icons";
import { Button } from "@hamsterbox/ui-kit";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import {
  TotalInvest,
  PocketInfo,
  PocketProgress,
  BoughtTransaction,
} from "@/src/components/pocket-details";

const PocketDetailPage: NextPage = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="md:pt-[130px] pb-[100px]">
          <section className="md:flex">
            <div className="md:float-left md:w-[80%]">
              <div className="md:flex justify-between items-center">
                <div className="flex items-center">
                  <button onClick={() => router.push("/my-pockets")}>
                    <LeftIcon />
                  </button>
                  <p className="float-left md:text-[32px] text-[20px] text-white ml-[10px]">
                    Pockets Detail
                  </p>
                </div>
              </div>
              <div className="mt-[32px] w-full block pocket-top-item px-[20px] py-[10px]">
                <div className="flow-root items-center">
                  <div className="flex items-center float-left">
                    <div className="w-[30px] md:w-[44px] md:h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center border-solid border-[2px] border-white float-left">
                      <img
                        src="/assets/images/raydium.png"
                        className="rounded-[50%]"
                      />
                    </div>
                    <p className="text-white text-[16px] regular-text flex items-center ml-[10px]">
                      RAYD/SOL
                    </p>
                  </div>
                  <a
                    href={`https://solscan.io/account/`}
                    target="_blank"
                    className="ml-[10px] relative top-[4px] float-right"
                  >
                    <ShareIcon color="#ffffff" />
                  </a>
                </div>
                <p className="md:text-[40px] text-white mt-[20px]">100%</p>
                <p className="md:text-[14px] text-white mt-[10px]">#146..423</p>
              </div>
              <div className="md:grid md:grid-cols-2 mt-[20px] md:gap-5">
                <div className="md:col-span-1">
                  <TotalInvest />
                  <div className="mt-[12px]">
                    <p className="text-dark45 text-[20px]">Progress</p>
                  </div>
                  <div className="mt-[12px]">
                    <PocketProgress />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <p className="text-dark45 text-[20px]">Pool Info</p>
                  <p className="text-purple300 text-[20px]">Auto-invest DCA</p>
                  <div className="flow-root mt-[12px]">
                    <p className="float-left text-dark50 text-[14px]">Status</p>
                    <div className="float-right mobile:flex mobile:items-center md:text-center">
                      <div className="px-[10px] bg-[#4ADE801F] rounded-[8px] inline-block mx-auto">
                        <p className="text-center text-green300 normal-text">
                          On going
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[12px]">
                    <PocketInfo />
                  </div>
                  <div className="mt-[12px]">
                    <Button
                      className="!px-[50px] md:w-auto !w-full pool-control-btn"
                      theme={{
                        backgroundColor: "#735CF7",
                        color: "#FFFFFF",
                      }}
                      text="Close Pocket"
                      width="100%"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-[12px]">
                <p className="text-dark45 text-[20px]">Bought transaction</p>
              </div>
              <div className="mt-[12px]">
                <BoughtTransaction />
              </div>
            </div>
          </section>
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

export default PocketDetailPage;
