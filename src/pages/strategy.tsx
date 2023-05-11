import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { LayoutSection } from "@/src/components/layout-section";

const StrageryPage: NextPage = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="md:!pt-[130px] pb-[100px]">
          <p className="md:text-[32px] text-[20px] text-white mt-[22px] mt-20">
            Strategy
          </p>
          <div className="md:grid md:grid-cols-2 md:gap-2 mt-[20px]">
            <div
              className="md:cols-span-1 mobile:w-full rounded-[12px] bg-dark100 px-[20px] py-[40px] cursor-pointer hover:bg-[#181927]"
              onClick={() => router.push("/create-pocket")}
            >
              <div className="p-[10px] rounded-[12px] bg-dark3 inline-block">
                <img
                  src="/assets/images/dca-icon.png"
                  className="w-[40px] h-[40px]"
                />
              </div>
              <p className="text-white text-[28px] mt-[30px]">
                Auto-invest DCA
              </p>
              <p className="text-dark50 text-[16px] mt-[10px]">
                Buy tokens ...
              </p>
            </div>
          </div>
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

export default StrageryPage;
