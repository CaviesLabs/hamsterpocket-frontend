import { FC } from "react";
import { RightArrowIcon } from "@/src/components/icons";

export enum TransactionStatus {
  pending = "STATUS::PENDING",
  completed = "STATUS::COMPLETED",
  error = "STATUS::ERROR",
}

export type TransactionItem = {
  time: string;
  baseToken: string;
  targetToken: string;
  status: TransactionStatus;
  baseAmount: number;
  targetAmount: number;
};

export const BoughtTransaction: FC = () => {
  const transactions: TransactionItem[] = [
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.pending,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.error,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.completed,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.pending,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.error,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.completed,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.pending,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.error,
      baseAmount: 4,
      targetAmount: 0.7,
    },
    {
      time: "16/02/2023  -  16:00",
      baseToken: "SOL",
      targetToken: "BNB",
      status: TransactionStatus.completed,
      baseAmount: 4,
      targetAmount: 0.7,
    },
  ];

  const statusTheme = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.pending:
        return ["Pending", "#FACC151F", "#E8AB35"];
      case TransactionStatus.completed:
        return ["Completed", "#4ADE801F", "#26C673"];
      case TransactionStatus.error:
        return ["Error", "#F755551F", "#F44949"];
    }
  };

  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      {transactions.map((item, index) => (
        <div
          className="flow-root border-b-[1px] border-solid border-[#1C1D2C] py-[20px]"
          key={`transaction-item-${index}`}
        >
          <div className="grid grid-cols-12 text-white text-[14px]">
            <div className="col-span-1 text-center">{index + 1}</div>
            <div className="col-span-3 text-center">{item.time}</div>
            <div className="col-span-4 text-center flex items-center justify-center">
              <p>{`${item.baseAmount} ${item.baseToken}`}</p>
              <RightArrowIcon className="mx-[20px]" />
              <p>{`${item.targetAmount} ${item.targetToken}`}</p>
            </div>
            <div className="col-span-3 text-center">
              <div className="float-right mobile:flex mobile:items-center md:text-center">
                <div
                  style={{ backgroundColor: statusTheme(item.status)?.[1] }}
                  className={`py-[5px] rounded-[8px] inline-block mx-auto w-[100px]`}
                >
                  <p
                    style={{ color: statusTheme(item.status)?.[2] }}
                    className={`text-center normal-text`}
                  >
                    {statusTheme(item.status)?.[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
