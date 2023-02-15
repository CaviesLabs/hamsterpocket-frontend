import { FC } from "react";
import type { NextPage } from "next";
import MainLayout from "@/src/layouts/main";
import styles from "@/styles/Home.module.css";
import { DashboardPageProvider } from "@/src/hooks/pages/dashboard";
import { useMain } from "@/src/hooks/pages/main";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import { Input, Button } from "@hamsterbox/ui-kit";
import { CurrencyInput } from "@/src/components/currency-input";
import { TwoWayArrowIcon, PlusIcon } from "@/src/components/icons";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { DropdownSelect } from "@/src/components/select";
import { TIME_CONDITIONS } from "@/src/utils";

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
          <section>
            <p className="mt-[48px] text-[24px] text-white normal-text">
              Pool information
            </p>
            <div className="mt-[16px]">
              <p className="text-dark10 text-[14px] normal-text">
                Pocket name
                <span className="text-red300 relative top-[-2px] right-[-2px]">
                  *
                </span>
              </p>
              <Input
                containerClassName="app-input w-full mt-[10px]"
                inputClassName="bg-dark90 !text-white !rounded-[16px] w-full"
                placeholder="Search by Pool name, ID, Token"
              />
            </div>
          </section>
          <section>
            <p className="mt-[48px] text-[24px] text-white normal-text">
              DCA ppair
            </p>
            <div className="mt-[16px]">
              <p className="text-dark20 text-[14px] normal-text italic">
                Enter the pair on Raydium
              </p>
              <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
                <div className="md:col-span-2">
                  <p className="text-dark10 text-[14px] normal-text">
                    From
                    <span className="text-red300 relative top-[-2px] right-[-2px]">
                      *
                    </span>
                  </p>
                  <CurrencyInput />
                </div>
                <div className="md:col-span-1 flex items-center justify-center">
                  <div className="rounded-[50%] p-[20px] bg-dark90">
                    <TwoWayArrowIcon />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-dark10 text-[14px] normal-text">
                    To
                    <span className="text-red300 relative top-[-2px] right-[-2px]">
                      *
                    </span>
                  </p>
                  <CurrencyInput />
                </div>
              </div>
            </div>
          </section>
          <section>
            <p className="mt-[48px] text-[24px] text-white normal-text">
              Pool start time
            </p>
            <div className="mt-[16px]">
              <p className="text-dark20 text-[14px] normal-text italic">
                Select a time to execute the first batch of this Pocket
              </p>
            </div>
            <div className="mt-[24px] md:grid md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <DatetimePicker onChange={(e) => console.log(e)} />
              </div>
            </div>
          </section>
          <section>
            <p className="mt-[48px] text-[24px] text-white normal-text">
              DCA strategy
            </p>
            <div className="mt-[16px]">
              <p className="text-dark20 text-[14px] normal-text italic">
                Set the conditions that must be met before each batch of tokens
                purchase is executed
              </p>
              <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
                <div className="md:col-span-2">
                  <p className="text-dark10 text-[14px] normal-text">
                    Amount each batch
                    <span className="text-red300 relative top-[-2px] right-[-2px]">
                      *
                    </span>
                  </p>
                  <CurrencyInput />
                </div>
              </div>
              <div className="mt-[24px] ">
                <p className="text-dark10 text-[14px] normal-text">
                  Frequency
                  <span className="text-red300 relative top-[-2px] right-[-2px]">
                    *
                  </span>
                </p>
                <DropdownSelect
                  className="mt-[10px] !min-w-[250px]"
                  handleSelectValue={(val) => console.log(val)}
                  value={"Daily"}
                  options={TIME_CONDITIONS}
                />
              </div>
              <div className="mt-[24px] ">
                <p className="text-dark10 text-[14px] normal-text">
                  Buy at market price if
                </p>
                <Button
                  size="small"
                  text="Add condition"
                  className="!rounded-[100px] after:!rounded-[100px] !px-4 mt-[10px]"
                  theme={{
                    backgroundColor: "#7A6DFF",
                    color: "#FFFFFF",
                  }}
                  icon={<PlusIcon />}
                  // onClick={() => setIsAddSol(true)}
                />
              </div>
            </div>
          </section>
          <section>
            <p className="mt-[48px] text-[24px] text-white normal-text">
              Deposit amount
            </p>
            <div className="mt-[16px]">
              <p className="text-dark20 text-[14px] normal-text italic">
                Deposit {">="} amount each batch
              </p>
              <div className="grid md:grid-cols-5 gap-3 mt-[24px]">
                <div className="md:col-span-2">
                  <p className="text-dark10 text-[14px] normal-text">
                    Deposit amount
                    <span className="text-red300 relative top-[-2px] right-[-2px]">
                      *
                    </span>
                  </p>
                  <CurrencyInput />
                </div>
              </div>
            </div>
          </section>
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
    <DashboardPageProvider>
      <Layout />
    </DashboardPageProvider>
  );
};

export default CreatePoolPage;
