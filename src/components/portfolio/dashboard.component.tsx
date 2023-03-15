import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { RiQuestionnaireFill } from "react-icons/all";
Chart.register(ArcElement, Legend, Tooltip);
import { Tooltip as AntdTooltip } from "antd";
import { useMemo } from "react";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";

const options = {
  cutout: 70,
  border: {
    color: "black",
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export default function DashboardComponent() {
  /** @dev Handle to get total estimate sol in total pockets. */
  const { totalSOL, totalUSD, getTokenBlances } = usePocketBalance();

  const chartData = useMemo(() => {
    const mapData = getTokenBlances();
    const labels = mapData.map((item) => item.token);
    return {
      labels,
      datasets: [
        {
          data: mapData.map((item) => (item.percent * 100).toFixed(2)),
          backgroundColor: ["#C85469", "#3393D9", "#B2B539", "#EAF4F4"],
          hoverBackgroundColor: ["#C85469", "#3393D9", "#B2B539", "#EAF4F4"],
          borderWidth: 0,
        },
      ],
    };
  }, [totalUSD, totalSOL]);

  return (
    <div className="mt-12 flex justify-between items-center">
      <div className="py-3 px-6 bg-dark90 w-1/4 rounded border border-gray-500">
        <div className="text-white normal-text">Total Pockets Balance:</div>
        <div className="flex mt-4">
          <img src="/assets/images/solana-icon.svg" />
          <div className="text-green ml-3">~ {totalSOL.toFixed(2)} SOL</div>
        </div>
        <div className="text-green mt-1 italic regular-text">
          (~ ${totalUSD.toFixed(2)})
        </div>
      </div>
      {totalUSD > 0 && chartData.labels.length > 0 && (
        <div className="flex items-center mr-36">
          <div className="max-w-[190px] relative flex justify-center items-center">
            <Doughnut data={chartData} options={options} />
            <div className="absolute text-white regular-text text-center">
              <div className="flex items-center">
                Est Balance
                <AntdTooltip
                  color="rgba(18, 19, 27, 0.9506)"
                  placement="bottom"
                  title="Total token value is estimated to dollars"
                  className="ml-2"
                  overlayStyle={{
                    maxWidth: 160,
                    padding: 0,
                  }}
                  overlayInnerStyle={{
                    textAlign: "center",
                    padding: "20px 12px",
                    border: "solid 1px rgba(255, 255, 255, 0.1985)",
                  }}
                >
                  <RiQuestionnaireFill />
                </AntdTooltip>
              </div>
              <div>${totalUSD.toFixed(2)}</div>
            </div>
          </div>
          <div className="ml-12 flex flex-col justify-between w-40 h-[160px]">
            {chartData.labels.map((label, i) => (
              <div
                key={label}
                className="flex justify-between items-center text-white regular-text"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: chartData.datasets[0].backgroundColor[i],
                    }}
                  ></div>
                  <div className="ml-2">{label}</div>
                </div>
                <div className="ml-2 font-bold text-[16px] text-green">
                  {chartData.datasets[0].data[i]}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
