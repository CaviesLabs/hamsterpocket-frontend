import { FC } from "react";
import { ShareIcon } from "@/src/components/icons";
import ProgressBar from "@ramonak/react-progress-bar";

export const PoolItem: FC = () => {
  return (
    <div className="w-full min-h-[100px] rounded-[32px] bg-dark90 py-[32px] md:px-[100px] px-[20px] mt-[40px]">
      <div className="flow-root">
        <p className="text-[24px] text-white normal-text float-left">
          Save money for the future
        </p>
        <p className="float-right text-dark50 text-[16px] regular-text relative top-[6px]">
          #14623
        </p>
      </div>
      <div className="flow-root mt-[24px]">
        <div className="md:float-left md:w-[430px] w-full bg-dark80 rounded-[8px] px-[22px] py-[20px] flow-root">
          <div className="flex items-center float-left">
            <div className="w-[44px] h-[44px] rounded-[100%] bg-dark70 flex justify-center items-center">
              <img src="/samm.svg" />
            </div>
            <div className="pl-[20px]">
              <p className="text-white text-[18px] normal-text uppercase">
                block
              </p>
              <p className="text-white text-[14px] normal-text">Blockasset</p>
            </div>
          </div>
          <div className="flex items-center float-right relative top-[5px]">
            <div className="py-[5px] px-[30px] border-solid border-[2px] border-dark70 rounded-[8px]">
              <p className="text-dark50 text-[14px] normal-text">
                a11bd...cdasp
              </p>
            </div>
            <a href="" className="ml-[10px]">
              <ShareIcon />
            </a>
          </div>
        </div>
        <div className="float-right md:w-[380px]">
          <div className="flex items-center">
            <p className="text-dark40 text-[16px] normal-text w-[30%] float-left">
              Buy amount:
            </p>
            <p className="text-white text-[18px] normal-text w-[70%] float-left text-end">
              10 SOL every 15 days
            </p>
          </div>
          <div className="flex items-center mt-[18px]">
            <p className="text-dark40 text-[16px] normal-text w-[30%] float-left">
              Condition:
            </p>
            <p className="text-white text-[18px] normal-text w-[70%] float-left text-end">
              {"BLOCK <= $0.051706"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-[24px]">
        <p className="text-white text-[16px] regular-text">Progress</p>
        <ProgressBar
          completed={(4000 / 8200) * 100}
          bgColor="#735CF7"
          baseBgColor="#94A3B8"
          customLabel={`${400}/8200`}
          labelAlignment="center"
          labelClassName="progress-label app-font"
          className="mt-[10px]"
          height="10px"
        />
        <div className="flow-root mt-[10px]">
          <p className="float-left text-green text-[14px] regular-text">40%</p>
          <div className="float-right">
            <p className="text-end text-[14px] text-white regular-text">
              Bought:
              <span className="text-green ml-[5px]">120</span>
              /300SOL
            </p>
            <p className="text-end text-[14px] text-white regular-text mt-[6px]">
              ~ 593,492,491.38 BLOCK
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
