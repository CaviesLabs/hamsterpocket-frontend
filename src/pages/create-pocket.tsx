import { FC, useEffect } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { CreatePocketProvider } from "@/src/hooks/pages/create-pocket";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import { Button } from "@hamsterbox/ui-kit";
import {
  PoolInformation,
  DCAPPair,
  DCAStrategy,
  StopCondition,
} from "@/src/components/create-pocket";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useValidate } from "@/src/hooks/pages/create-pocket/useValidate";

const Layout: FC = () => {
  /** @dev Injected context to use. */
  const { handleCreatePocket, setErrorMsgs, processing } =
    useCreatePocketPage();

  /** @dev Validate all properties if each is not valid. */
  const { errors } = useValidate();

  /** @dev Update error messages in context when having changes. */
  useEffect(() => setErrorMsgs(errors), [errors, setErrorMsgs]);

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
                className="float-right !w-[220px] !h-[56px] !text-[18px]"
                text="Create pocket"
                loading={processing ? true : false}
                onClick={() => handleCreatePocket()}
              />
            </div>
            <div className="float-right">
              <Button
                className="float-right !border-solid !border-purple !border-[2px] !w-[220px] !h-[56px] !text-[18px]"
                theme={{
                  backgroundColor: "transparent",
                  color: "#B998FB",
                  hoverColor: "#B998FB",
                }}
                text="Back"
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
