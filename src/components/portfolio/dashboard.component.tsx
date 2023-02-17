import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { RiQuestionnaireFill } from "react-icons/all";
Chart.register(ArcElement, Legend, Tooltip);
import { Tooltip as AntdTooltip } from "antd";

const data = {
  labels: ["Red", "Blue", "Yellow"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      borderWidth: 0,
    },
  ],
};

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
  return (
    <div className="mt-12 flex justify-between items-center">
      <div className="py-3 px-6 bg-dark80 w-1/4 rounded border border-gray-500">
        <div className="text-white normal-text">Total Pockets Balance:</div>
        <div className="flex mt-4">
          <img src="/assets/images/solana-icon.svg" />
          <div className="text-green ml-3">45.19 SOL</div>
        </div>
        <div className="text-green mt-1 italic">(~ $8,803.24)</div>
      </div>
      <div className="flex items-center mr-36">
        <div className="max-w-[190px] relative flex justify-center items-center">
          <Doughnut data={data} options={options} />
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
            <div>$16.4K</div>
          </div>
        </div>
        <div className="ml-12 flex flex-col justify-between w-40 h-[160px]">
          {data.labels.map((label, i) => (
            <div
              key={label}
              className="flex justify-between items-center text-white regular-text"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: data.datasets[0].backgroundColor[i],
                  }}
                ></div>
                <div className="ml-2">{label}</div>
              </div>
              <div className="ml-2 font-bold text-[16px] text-green">
                {data.datasets[0].data[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
