import { FC } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { Button } from "@hamsterbox/ui-kit";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
Chart.register(ArcElement, Legend, Tooltip);

export const PocketInfo: FC = () => {
  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Total deposited</p>
        <p className="text-white normal-text float-right">78 SOL</p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Strategy</p>
        <p className="text-white normal-text float-right">10 SOL monthly</p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Next batch time</p>
        <p className="text-white normal-text float-right">
          16/02/2023 16:00 (+07)
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">View by</p>
        <ProgressBar
          completed={0.24 * 100}
          bgColor="#735CF7"
          baseBgColor="#060710"
          customLabel={`${0.24 * 100}%`}
          labelAlignment="center"
          labelClassName="progress-label app-font"
          className="mt-[30px]"
          height="10px"
        />
        <div className="flow-root mt-[16px]">
          <div className="float-right">
            <p className="text-dark50 normal-text">Start date</p>
            <p className="text-white normal-text">16/02/2023</p>
          </div>
          <div className="float-left">
            <p className="text-dark50 normal-text">Time left</p>
            <p className="text-white normal-text">234 day(s)</p>
          </div>
        </div>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <div className="float-left">
          <p className="text-dark50 normal-text">Outstanding deposit</p>
          <p className="text-white normal-text">3.4 SOL</p>
        </div>
        <div className="float-right">
          <Button
            className="!px-[50px] md:w-auto !w-full pool-control-btn"
            theme={{
              backgroundColor: "#735CF7",
              color: "#FFFFFF",
            }}
            text="Deposit Now"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};
