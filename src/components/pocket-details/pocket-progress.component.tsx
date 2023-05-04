import { FC } from "react";

export const PocketProgress: FC = () => {
  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Batch bought</p>
        <p className="text-white normal-text float-right">10 BATCHES</p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Average price</p>
        <p className="text-white normal-text float-right">
          0.001 SOL = 0.000062 BTC
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">Average price</p>
        <p className="text-white normal-text float-right">
          0.001 SOL = 1000 BLOCK
        </p>
      </div>
      <div className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]">
        <p className="float-left text-dark50 normal-text">APL (ROI)</p>
        <p className="text-green300 normal-text float-right">
          + 0.00 SOL (0.00%)
        </p>
      </div>
    </div>
  );
};
