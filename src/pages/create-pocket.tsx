import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { CreatePocketProvider } from "@/src/hooks/pages/create-pocket";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import { Button } from "@hamsterbox/ui-kit";
import { PlusIcon } from "@/src/components/icons";
import {
  PoolInformation,
  DCAPPair,
  DCAStrategy,
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
          <section>
            <p className="mt-[48px] text-[24px] text-white normal-text">
              Pocket end condition
            </p>
            <div className="mt-[16px]">
              <p className="text-dark20 text-[14px] normal-text italic">
                When one of the conditions below is met, the Pocket will stop
                running the DCA strategy automatically
              </p>
              <div className="mt-[24px]">
                <div>
                  <p className="text-dark10 text-[14px] normal-text">
                    Deposit amount
                    <span className="text-red300 relative top-[-2px] right-[-2px]">
                      *
                    </span>
                  </p>
                  <div className="mt-[10px] inline-flex">
                    <div className="float-left">
                      <Button
                        size="small"
                        text="Add End time"
                        className="!rounded-[100px] after:!rounded-[100px] !px-4"
                        theme={{
                          backgroundColor: "#7A6DFF",
                          color: "#FFFFFF",
                        }}
                        icon={<PlusIcon />}
                        // onClick={() => setIsAddGameItem(true)}
                      />
                    </div>
                    <div className="ml-[12px]">
                      <Button
                        size="small"
                        text="Add target token amount"
                        className="!rounded-[100px] after:!rounded-[100px] !px-4"
                        theme={{
                          backgroundColor: "#41ADD1",
                          color: "#FFFFFF",
                        }}
                        icon={<PlusIcon />}
                        // onClick={() => setIsAddGameItem(true)}
                      />
                    </div>
                    <div className="ml-[12px]">
                      <Button
                        size="small"
                        text="Add target SOL amount"
                        className="!rounded-[100px] after:!rounded-[100px] !px-4"
                        theme={{
                          backgroundColor: "#F47048",
                          color: "#FFFFFF",
                        }}
                        icon={<PlusIcon />}
                        // onClick={() => setIsAddGameItem(true)}
                      />
                    </div>
                    <div className="ml-[12px]">
                      <Button
                        size="small"
                        text="Add target batches purchased"
                        className="!rounded-[100px] after:!rounded-[100px] !px-4"
                        theme={{
                          backgroundColor: "#97B544",
                          color: "#FFFFFF",
                        }}
                        icon={<PlusIcon />}
                        // onClick={() => setIsAddGameItem(true)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
