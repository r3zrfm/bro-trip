"use client";

import { useMemo, useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
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
  const [currentOption, setCurrentOption] = useState<TripOption>("B");
  const [currentMode, setCurrentMode] = useState<BudgetMode>("press");
  const [currentDay, setCurrentDay] = useState(0);

  const optionData = itineraryData[currentOption];
  const modeData = optionData[currentMode];
  const dayData = modeData.days[currentDay];

  const barData = useMemo(() => {
    const color = currentMode === "press" ? "#10b981" : "#a855f7";
    return {
      labels: [...costLabels],
      datasets: [
        {
          label: "Estimasi Biaya (IDR)",
          data: [...costByOptionMode[currentOption][currentMode]],
          backgroundColor: [color, color, color],
        },
      ],
    };
  }, [currentMode, currentOption]);

  const tagClasses =
    currentMode === "press"
      ? "inline-block px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 mb-2"
      : "inline-block px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800 mb-2";

  return (
    <>
      <header className="bg-slate-900 text-stone-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-500">
              BRO-TRIP PLANNER
              <span className="text-xs text-stone-400 font-normal border border-stone-600 rounded px-2 py-0.5 ml-2">
                2026 EDITION
              </span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              3 Orang | 5 Hari | Mode: Hemat vs Sultan
            </p>
          </div>
          <nav className="mt-4 md:mt-0 space-x-4 text-sm font-medium">
            <a href="#showdown" className="hover:text-amber-400 transition-colors">
              Perbandingan
            </a>
            <a href="#itinerary" className="hover:text-amber-400 transition-colors">
              Itinerary Harian
            </a>
            <a href="#tips" className="hover:text-amber-400 transition-colors">
              Tips Hemat
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="text-center max-w-3xl mx-auto mb-12 fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Pilih Medan Perang Kalian
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Analisis mendalam untuk perjalanan Mei 2026. Pilih destinasi dan sesuaikan
            dengan ketebalan dompet: <strong>Mode Hemat (Rp 2.5jt)</strong> buat
            survivor, atau <strong>Mode Ideal (Rp 3.5jt++)</strong> buat yang mau agak
            nyaman.
          </p>
        </section>

        <section
          id="showdown"
          className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8 scroll-mt-24"
        >
          <div className="mb-6 border-b border-stone-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-amber-600 text-xl">VS</span>
              Head-to-Head Stats
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Visualisasi perbandingan kenyamanan vs biaya berdasarkan mode yang dipilih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col">
              <h4 className="text-center font-semibold text-slate-700 mb-4 uppercase tracking-wider text-sm">
                Vibe & Comfort Level
              </h4>
              <div className="chart-container bg-stone-50 rounded-lg p-2 border border-stone-100">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-center font-semibold text-slate-700 mb-4 uppercase tracking-wider text-sm">
                Estimasi Pengeluaran Saku (Per Orang)
              </h4>
              <div className="chart-container bg-stone-50 rounded-lg p-2 border border-stone-100">
                <Bar data={barData} options={barOptions} />
              </div>
              <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-slate-700">
                <strong>Note:</strong> Grafik biaya akan berubah otomatis saat kalian
                mengganti Mode Budget di bawah (Hemat vs Ideal).
              </div>
            </div>
          </div>
        </section>

        <section id="itinerary" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Jelajahi Rencana Perjalanan
              </h3>
              <p className="text-slate-600 text-sm">
                <span className="text-sky-500 font-bold">● Pagi (06-12)</span> |{" "}
                <span className="text-orange-500 font-bold">● Siang/Sore (12-18)</span>{" "}
                | <span className="text-slate-500 font-bold">● Malam (18-00)</span>
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
              <div className="flex bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode("press");
                    setCurrentDay(0);
                  }}
                  className={
                    currentMode === "press"
                      ? "px-4 py-2 rounded-md text-sm font-bold transition-all bg-amber-500 text-white shadow-sm"
                      : "px-4 py-2 rounded-md text-sm font-bold transition-all text-slate-400 hover:text-white"
                  }
                >
                  Mode Hemat (2.5jt)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode("ideal");
                    setCurrentDay(0);
                  }}
                  className={
                    currentMode === "ideal"
                      ? "px-4 py-2 rounded-md text-sm font-bold transition-all bg-amber-500 text-white shadow-sm"
                      : "px-4 py-2 rounded-md text-sm font-bold transition-all text-slate-400 hover:text-white"
                  }
                >
                  Mode Sultan (4jt++)
                </button>
              </div>

              <div className="flex bg-stone-200 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentOption("A");
                    setCurrentDay(0);
                  }}
                  className={
                    currentOption === "A"
                      ? "px-6 py-2 rounded-md text-sm font-bold transition-all bg-white text-slate-900 shadow-sm"
                      : "px-6 py-2 rounded-md text-sm font-bold transition-all text-slate-600 hover:text-slate-900"
                  }
                >
                  SG + JB
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentOption("B");
                    setCurrentDay(0);
                  }}
                  className={
                    currentOption === "B"
                      ? "px-6 py-2 rounded-md text-sm font-bold transition-all bg-white text-slate-900 shadow-sm"
                      : "px-6 py-2 rounded-md text-sm font-bold transition-all text-slate-600 hover:text-slate-900"
                  }
                >
                  KL + Melaka
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden min-h-[500px] flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-slate-50 border-b md:border-b-0 md:border-r border-stone-200 flex md:flex-col overflow-x-auto md:overflow-x-visible">
              <div className="p-4 bg-slate-100 border-b border-stone-200 hidden md:block">
                <span className="text-xs font-bold text-slate-400 uppercase">Pilih Hari</span>
              </div>
              <div id="day-nav-container" className="flex md:flex-col w-full">
                {modeData.days.map((day, index) => {
                  const isActive = index === currentDay;
                  const baseClasses =
                    "flex-shrink-0 w-auto p-3 text-xs border-r border-stone-200 transition-colors flex justify-between items-center md:w-full md:text-left md:text-sm md:p-4 md:border-b md:border-r-0";
                  const activeClasses = isActive
                    ? "bg-white text-amber-600 border-b-4 border-b-amber-500 md:border-b-0 md:border-l-4 md:border-l-amber-500"
                    : "text-slate-500 bg-stone-50 hover:bg-slate-50";

                  return (
                    <button
                      type="button"
                      key={day.title}
                      className={`${baseClasses} ${activeClasses}`}
                      onClick={() => setCurrentDay(index)}
                    >
                      <span>Hari {index + 1}</span>
                      {isActive ? <span>🎯</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full md:w-3/4 p-6 md:p-8 flex flex-col relative">
              <div className="flex justify-between items-start mb-6 border-b border-stone-100 pb-4">
                <div>
                  <span id="itinerary-tag" className={tagClasses}>
                    {modeData.tag}
                  </span>
                  <h2 id="itinerary-title" className="text-2xl font-bold text-slate-900">
                    {dayData.title}
                  </h2>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="block text-xs text-slate-400 uppercase">Total Harian</span>
                  <span
                    id="itinerary-focus"
                    className="font-medium text-slate-700 font-mono text-amber-600"
                  >
                    {dayData.total}
                  </span>
                </div>
              </div>

              <div
                key={`${currentOption}-${currentMode}-${currentDay}`}
                id="itinerary-content"
                className="flex-grow space-y-6 text-slate-700 custom-scroll overflow-y-auto max-h-[600px] pr-2 fade-in"
                dangerouslySetInnerHTML={{ __html: dayData.content }}
              />

              <div
                id="daily-tip"
                className="mt-8 p-4 bg-slate-800 text-stone-200 rounded-lg text-sm border-l-4 border-amber-500"
              >
                <span className="font-bold text-amber-400 mr-2">BRO TIP:</span>
                <span id="tip-text">{dayData.tip}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="tips" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-24">
          <div className="md:col-span-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-800">Tips "Bro-Trip" Survival</h3>
            <p className="text-slate-600">Panduan biar gak boncos di tengah jalan.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">💧</div>
            <h4 className="font-bold text-slate-900 mb-2">Air Minum = Emas</h4>
            <p className="text-sm text-slate-600">
              Di SG, bawa botol kosong dari Indo. Isi di water fountain Changi/Mall.
              Di KL, beli galon di 7-11 buat di hotel.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🚗</div>
            <h4 className="font-bold text-slate-900 mb-2">The Power of Grab</h4>
            <p className="text-sm text-slate-600">
              Kalian bertiga. Di Malaysia, jangan naik kereta bandara (mahal). Naik
              Grab bagi 3 jatuhnya seharga bus tapi VIP.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📶</div>
            <h4 className="font-bold text-slate-900 mb-2">Koneksi Internet</h4>
            <p className="text-sm text-slate-600">
              Beli 1 Sim Card lokal (Tunetalk/Singtel) yang kuota besar, terus tethering
              bergilir. Gak usah beli Roaming Pass masing-masing.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-stone-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Generated for 2026 Bro-Trip | Source: Itinerary Discussion</p>
          <p className="text-xs mt-2 text-stone-600">
            Harga estimasi berdasarkan kurs & data tahun sebelumnya.
          </p>
        </div>
      </footer>
    </>
  );
}
