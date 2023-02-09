import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { useMain } from "@/src/hooks/pages/main";

const Layout: FC = () => {
  // const proposals = useSelector((state: any) => state.proposals);
  const {} = useMain();

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className="bg-white mb-10">
          <div>
            <main className="mx-auto max-w-[86rem]">
              <section aria-labelledby="products-heading" className="pt-6">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  <div className="lg:col-span-8">
                    <div className="rounded-lg  lg:h-full px-[10px] py-[20px]"></div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
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
