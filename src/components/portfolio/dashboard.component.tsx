import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Tooltip as AntdTooltip } from "antd";
import { RiQuestionnaireFill } from "react-icons/ri";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { PocketBalance } from "./pocket-balance.component";
import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import { usePocketBalance } from "@/src/hooks/usePocketBalance";

Chart.register(ArcElement, Legend, Tooltip);

/** @dev Define options for chart. */
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

/** @dev Define colors for chart. */
const COLORS = [
  "#C85469",
  "#3393D9",
  "#B2B539",
  "#EAF4F4",
  "#f62d92",
  "#94e9d2",
  "#60b84e",
];

export default function DashboardComponentMobile() {
  /** @dev Handle to get total estimate sol in total pockets. */
  const { totalSOL, totalUSD, getTokenBlances } = usePocketBalance();
  const { analyzeDecimals } = useWhiteList();

  const chartData = useMemo(() => {
    const mapData = getTokenBlances();
    const labels = mapData.map((item) => item.token);
    return {
      labels,
      datasets: [
        {
          data: mapData.map((item) => (item.percent * 100)?.toFixed(2)),
          backgroundColor: COLORS,
          hoverBackgroundColor: COLORS,
          borderWidth: 0,
        },
      ],
    };
  }, [totalUSD, totalSOL]);

  return (
    <div className="mt-12 md:flex md:justify-between md:items-center">
      {totalUSD > 0 && chartData.labels.length > 0 && (
        <div className="mr-36 mobile:mt-[20px] bg-dark100 px-[50px] py-[50px] pl-[20px] pt-[20px] rounded-[12px]">
          <p className="text-white text-[16px] normal-text">Statistics</p>
          <div className="flex items-center mt-[20px] ml-[30px]">
            <div className="max-w-[190px] relative flex justify-center items-center">
              <Doughnut data={chartData} options={options} />
              <div className="absolute text-white regular-text text-center">
                <div className="flex items-center mobile:text-[14px]">
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
                <div className="mobile:text-[14px]">
                  ${analyzeDecimals(totalUSD)}
                </div>
              </div>
            </div>
            <div className="ml-12 flex flex-col justify-between w-40 h-[160px]">
              {chartData.labels.map((label, i) => (
                <div
                  key={Math.random()}
                  className="flex justify-between items-center text-white regular-text"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          chartData.datasets[0].backgroundColor[i],
                      }}
                    ></div>
                    <div className="ml-2 mobile:text-[14px]">{label}</div>
                  </div>
                  <div className="ml-2 font-bold text-[16px] mobile:text-[14px] text-green">
                    {chartData.datasets[0].data[i]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <PocketBalance />
    </div>
  );
}
