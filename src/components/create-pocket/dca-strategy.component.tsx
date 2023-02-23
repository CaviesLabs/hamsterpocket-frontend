import { FC } from "react";
import { Button } from "@hamsterbox/ui-kit";
import { CurrencyInput } from "@/src/components/currency-input";
import { PlusIcon } from "@/src/components/icons";
import { DatetimePicker } from "@/src/components/datetime-picker";
import { DropdownSelect } from "@/src/components/select";
import { TIME_CONDITIONS } from "@/src/utils";

export const DCAStrategy: FC = () => {
  return (
    <>
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
    </>
  );
};
