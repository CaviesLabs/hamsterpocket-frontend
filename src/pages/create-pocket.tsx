import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { CreatePocketProvider } from "@/src/hooks/pages/create-pocket";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import { Button } from "@hamsterbox/ui-kit";
import {
  PoolInformation,
  DCAPPair,
  DCAStrategy,
  StopCondition,
} from "@/src/components/create-pocket";

const Layout: FC = () => {
  // const proposals = useSelector((state: any) => state.proposals);
  const {} = useMain();

  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutSection className="!pt-[100px] pb-[100px]">
          <BreadCrumb data={["Home", "Create a Pocket"]} />
          <p className="md:text-[32px] text-[24px] text-white mt-[24px]">
            Create Pocket
          </p>
          <PoolInformation />
          <DCAPPair />
          <DCAStrategy />
          <StopCondition />
          <section className="mt-[30px] flow-root">
            <div className="float-right ml-[20px]">
              <Button
                className="float-right !px-[50px] md:w-auto !w-full"
                text="Create pocket"
              />
            </div>
            <div className="float-right">
              <Button
                className="float-right !px-[50px] !border-solid !border-purple !border-[2px] md:w-auto !w-full"
                theme={{
                  backgroundColor: "transparent",
                  color: "#B998FB",
                  hoverColor: "#B998FB",
                }}
                text="Previous"
              />
            </div>
          </section>
        </LayoutSection>
      </div>
    </MainLayout>
  );
};

const CreatePoolPage: NextPage = () => {
  return (
    <CreatePocketProvider>
      <Layout />
    </CreatePocketProvider>
  );
};

export default CreatePoolPage;
