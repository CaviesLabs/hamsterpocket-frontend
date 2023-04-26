import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { CreatePocketProvider } from "@/src/hooks/pages/create-pocket";
import { LayoutWrapper } from "@/src/layouts/main/layout-wrapper";
import {
  CreatePocketDesktopLayout,
  CreatePocketMobileLayout,
} from "@/src/components/create-pocket";

const Layout: FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        <LayoutWrapper
          layout={<CreatePocketDesktopLayout />}
          mobileLayout={<CreatePocketMobileLayout />}
        />
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
