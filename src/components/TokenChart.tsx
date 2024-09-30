import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { TokenGraphType } from "@/types/pagetypes";
import { graphDataToken } from "@/backend/graphData";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TokenChartProps = {
  mintPubkey: string;
  name: string;
  decimals: number;
};

const TokenChart = ({ mintPubkey, name, decimals }: TokenChartProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [tokenChartData, setTokenChartData] = useState<TokenGraphType | null>(
    null
  );

  async function graphData() {
    if (!mintPubkey || mintPubkey === "") return;
    const data = await graphDataToken(mintPubkey);
    setTokenChartData(data);
  }

  const setTokenData = async () => {
    setChartData({
      labels: tokenChartData?.prices.map((p: { timestamp: Date }) =>
        p.timestamp.toLocaleDateString()
      ),
      datasets: [
        {
          label: "Price (USD)",
          data: tokenChartData?.prices.map((p: { price: number }) => p.price),
          borderColor: "blue",
          fill: false,
        },
      ],
    });
  };

  useEffect(() => {
    if (tokenChartData !== null) {
      setTokenData();
    }
  }, [tokenChartData]);

  useEffect(() => {
    if (mintPubkey) {
      graphData();
    }
  }, [mintPubkey]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${name} Price `,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const price = context.raw;
            return `Price: $${price.toFixed(decimals)}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        ticks: {
          callback: function (value: string | number) {
            return typeof value === "number" ? value.toFixed(decimals) : value;
          },
        },
      },
    },
  };

  return (
    <div className="flex w-full h-[600px] p-5 items-center justify-center xl:max-w-[1000px] 2xl:max-w-[1400px] mx-auto bg-dark ">
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TokenChart;
