import { FC } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
Chart.register(ArcElement, Legend, Tooltip);

export const TotalInvest: FC = () => {
  return (
    <div className="bg-dark100 rounded-[12px] min-h-[200px] p-[16px]">
      <p className="text-[14px] text-dark45">Total invested</p>
      <p className="text-white text-[14px]">78 SOL</p>
      <div className="max-w-[300px] flex">
        <Doughnut
          data={{
            labels: ["USDC", "SOL"],
            datasets: [
              {
                data: [70, 30],
                backgroundColor: ["#735CF7", "#482EDE"],
                hoverBackgroundColor: ["#735CF7", "#482EDE"],
                borderWidth: 0,
              },
            ],
          }}
          options={
            {
              cutout: 120,
              border: {
                color: "black",
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            } as any
          }
        />
        <div className="ml-12 flex items-center w-40 h-[300px] float-left">
          <div>
            {["SOL", "USDC"].map((label, i) => (
              <div
                key={`items-cejjj${i}`}
                className="flex items-center text-white regular-text mb-[10px]"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: "#735CF7",
                    }}
                  ></div>
                  <div className="ml-2 mobile:text-[14px]">{label}</div>
                </div>
                <div className="ml-2 font-bold text-[16px] mobile:text-[14px] text-green">
                  100%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
