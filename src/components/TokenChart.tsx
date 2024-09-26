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
        // {
        //   label: "Market Cap",
        //   data: tokenChartData?.marketCap.map(
        //     (m: { marketCap: number }) => m.marketCap
        //   ),
        //   borderColor: "green",
        //   fill: false,
        // },
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
        text: `${name} Price and Market Cap`,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const price = context.raw;
            return `Price: $${price.toFixed(9)}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        ticks: {
          callback: function (value: string | number) {
            return typeof value === "number" ? value.toFixed(9) : value;
          },
        },
      },
    },
  };

  return (
    <div>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TokenChart;
