"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
  maxBarThickness: number;
}

interface ChartData {
  labels: string[];
  datasets: DataSet[];
}

interface Option {
  value: string;
  votes: number;
}

interface QuestionData {
  text: string;
  type: string;
  options: Option[];
}

const Colors = [
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 99, 132, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(255, 205, 86, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
];

export function ChartItem({
  data,
  sortOrder,
}: {
  data: QuestionData;
  sortOrder: number;
}) {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const labels = data.options.map(
      (item) => item.value.substring(0, 30) + "..."
    );
    const values = data.options.map((item) => item.votes);
    const colors = data.options.map((item, index) =>
      Colors[index] ? Colors[index] : Colors[index - Colors.length]
    );

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Количество голосов",
          data: values,
          backgroundColor: colors,
          maxBarThickness: 35,
        },
      ],
    });
  }, []);

  return (
    <div className="w-full h-[50vh] p-3 rounded-2xl border 
    border-[#090C9B] bg-primary shadow-blue-400 shadow-2xl/20">
      <h2>
        {sortOrder}. {data.text}
      </h2>
      <Bar
        data={chartData}
        options={{
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: data.type },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                  return null;
                },
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          animation: {
            duration: 5000,
            easing: "easeInOutQuart",
          },
        }}
      />
    </div>
  );
}
