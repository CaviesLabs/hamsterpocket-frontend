import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { LayoutSection } from "@/src/components/layout-section";

const StrageryPage: NextPage = () => {
  const { pushRouterWithChainId } = usePlatformConfig();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="md:!pt-[130px] pb-[100px]">
          <p className="md:text-[32px] text-[20px] text-white mt-[22px] mt-20">
            Strategy
          </p>
          <div className="md:grid md:grid-cols-2 md:gap-2 mt-[20px]">
            <div
              className="md:cols-span-1 mobile:w-full rounded-[12px] bg-dark100 px-[20px] py-[40px] mobile:py-[20px] cursor-pointer hover:bg-[#181927] mobile:flex"
              onClick={() => pushRouterWithChainId("/create-pocket")}
            >
              <div className="mobile:float-left mobile:w-[100px]">
                <div className="p-[10px] rounded-[12px] bg-dark3 md:inline-block">
                  <img
                    src="/assets/images/dca-icon.png"
                    className="w-[40px] h-[40px] mobile:w-[24px] mobile:h-[24px]"
                  />
                </div>
              </div>
              <div className="mobile:float-left mobile:pl-[10px]">
                <p className="text-white text-[28px] mobile:text-[16px] md:mt-[30px]">
                  Auto-invest DCA
                </p>
                <p className="text-dark50 text-[16px] mobile:text-[12px] mt-[10px]">
                  Automatically buys a certain token based on pre-set parameters
                  (time-based or price-based)
                </p>
              </div>
            </div>
          </div>
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

export default StrageryPage;
