import { redirect } from "next/navigation";
"use client";

import { useMemo, useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { itineraryData, type BudgetMode, type TripOption } from "./data/itinerary";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const costLabels = ["Makan", "Transport", "Oleh-oleh/Lainnya"];

const costByOptionMode = {
  A: {
    press: [1200000, 400000, 600000],
    ideal: [2000000, 800000, 1500000],
  },
  B: {
    press: [900000, 300000, 600000],
    ideal: [2500000, 1000000, 1500000],
  },
} as const;

const radarData = {
  labels: ["Kenyamanan", "Kuliner", "Nightlife", "Modernitas", "Ramah Budget"],
  datasets: [
    {
      label: "SG + JB",
      data: [6, 7, 7, 9, 4],
      fill: true,
      backgroundColor: "rgba(148, 163, 184, 0.2)",
      borderColor: "rgb(148, 163, 184)",
    },
    {
      label: "KL + Melaka",
      data: [8, 9, 8, 7, 9],
      fill: true,
      backgroundColor: "rgba(245, 158, 11, 0.2)",
      borderColor: "rgb(245, 158, 11)",
    },
  ],
};

const radarOptions = {
  maintainAspectRatio: false,
  scales: { r: { suggestedMin: 0, suggestedMax: 10, ticks: { display: false } } },
};

const barOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

export default function Home() {
  redirect("/id");
}
