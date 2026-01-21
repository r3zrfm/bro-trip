"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import { usePathname } from "next/navigation";
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
import { itineraryData, type BudgetMode, type TripOption } from "../data/itinerary";
import { itineraryDataEn } from "../data/itinerary.en";
import { activityLookups } from "../data/activityInfo";

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

const copyByLocale = {
  id: {
    headerTitle: "BRO-TRIP PLANNER",
    headerEdition: "2026 EDITION",
    headerSub: "3 Orang | 5 Hari | Mode: Hemat vs Sultan",
    navCompare: "Perbandingan",
    navItinerary: "Itinerary Harian",
    navTips: "Budget Tips",
    heroTitle: "Pilih Medan Perang Kalian",
    heroBodyLead:
      "Analisis mendalam untuk perjalanan Mei 2026. Pilih destinasi dan sesuaikan dengan ketebalan dompet:",
    heroBodyHemat: "Mode Hemat (Rp 2.5jt)",
    heroBodyMid: "buat survivor, atau",
    heroBodyIdeal: "Mode Ideal (Rp 3.5jt++)",
    heroBodyTail: "buat yang mau agak nyaman.",
    headToHeadTitle: "Head-to-Head Stats",
    headToHeadDesc:
      "Visualisasi perbandingan kenyamanan vs biaya berdasarkan mode yang dipilih.",
    radarLabels: ["Kenyamanan", "Kuliner", "Nightlife", "Modernitas", "Ramah Budget"],
    vibeLabel: "Vibe & Comfort Level",
    pocketLabel: "Estimasi Pengeluaran Saku (Per Orang)",
    noteLabel: "Note",
    noteBody:
      "Grafik biaya akan berubah otomatis saat kalian mengganti Mode Budget di bawah (Hemat vs Sultan).",
    itineraryTitle: "Jelajahi Rencana Perjalanan",
    itineraryLegendMorning: "Pagi (06-12)",
    itineraryLegendNoon: "Siang/Sore (12-18)",
    itineraryLegendNight: "Malam (18-00)",
    modeHemat: "Mode Hemat (2.5jt)",
    modeSultan: "Mode Sultan (4jt++)",
    optionA: "SG + JB",
    optionB: "KL + Melaka",
    chooseDay: "Pilih Hari",
    dayLabel: "Hari",
    totalDaily: "Total Harian",
    broTip: "BRO TIP",
    tipsTitle: 'Tips "Bro-Trip" Survival',
    tipsDesc: "Panduan biar gak boncos di tengah jalan.",
    tip1Title: "Air Minum = Emas",
    tip1Body:
      "Di SG, bawa botol kosong dari Indo. Isi di water fountain Changi/Mall. Di KL, beli galon di 7-11 buat di hotel.",
    tip2Title: "The Power of Grab",
    tip2Body:
      "Kalian bertiga. Di Malaysia, jangan naik kereta bandara (mahal). Naik Grab bagi 3 jatuhnya seharga bus tapi VIP.",
    tip3Title: "Koneksi Internet",
    tip3Body:
      "Beli 1 Sim Card lokal (Tunetalk/Singtel) yang kuota besar, terus tethering bergilir. Gak usah beli Roaming Pass masing-masing.",
    footerLine1: "Generated for 2026 Bro-Trip | Source: Itinerary Discussion",
    footerLine2: "Harga estimasi berdasarkan kurs & data tahun sebelumnya.",
    addressFallback: "Lokasi fleksibel",
    addressMissing: "Alamat belum diisi",
    costLabels: ["Makan", "Transport", "Oleh-oleh/Lainnya"],
  },
  en: {
    headerTitle: "BRO-TRIP PLANNER",
    headerEdition: "2026 EDITION",
    headerSub: "3 People | 5 Days | Budget: Saver vs Luxury",
    navCompare: "Comparison",
    navItinerary: "Daily Itinerary",
    navTips: "Budget Tips",
    heroTitle: "Choose Your Battlefield",
    heroBodyLead:
      "A deep dive for the May 2026 trip. Pick a destination and match it to your wallet:",
    heroBodyHemat: "Saver Budget (Rp 2.5m)",
    heroBodyMid: "for survivors, or",
    heroBodyIdeal: "Mode Ideal (Rp 3.5m++)",
    heroBodyTail: "if you want more comfort.",
    headToHeadTitle: "Head-to-Head Stats",
    headToHeadDesc:
      "Side-by-side comfort vs cost based on the selected mode.",
    radarLabels: ["Comfort", "Food", "Nightlife", "Modernity", "Budget Friendly"],
    vibeLabel: "Vibe & Comfort Level",
    pocketLabel: "Pocket Spending Estimate (Per Person)",
    noteLabel: "Note",
    noteBody:
      "The cost chart updates automatically when you switch the budget mode below (Saver vs Luxury).",
    itineraryTitle: "Explore the Trip Plan",
    itineraryLegendMorning: "Morning (06-12)",
    itineraryLegendNoon: "Noon/Afternoon (12-18)",
    itineraryLegendNight: "Night (18-00)",
    modeHemat: "Budget: Saver (2.5m)",
    modeSultan: "Budget: Luxury (4m++)",
    optionA: "SG + JB",
    optionB: "KL + Melaka",
    chooseDay: "Choose Day",
    dayLabel: "Day",
    totalDaily: "Daily Total",
    broTip: "BRO TIP",
    tipsTitle: 'Bro-Trip Survival Tips',
    tipsDesc: "Tips to avoid blowing the budget mid-trip.",
    tip1Title: "Water = Gold",
    tip1Body:
      "In SG, bring an empty bottle from home. Refill at Changi/Mall water fountains. In KL, buy a big bottle at 7-11 for the hotel.",
    tip2Title: "The Power of Grab",
    tip2Body:
      "You are three people. In Malaysia, skip the airport train (expensive). Split a Grab and it costs bus money with VIP comfort.",
    tip3Title: "Internet Connection",
    tip3Body:
      "Buy one local SIM (Tunetalk/Singtel) with a big quota and rotate tethering. No need for individual roaming passes.",
    footerLine1: "Generated for 2026 Bro-Trip | Source: Itinerary Discussion",
    footerLine2: "Estimates based on exchange rates and prior-year data.",
    addressFallback: "Flexible location",
    addressMissing: "Address not set",
    costLabels: ["Food", "Transport", "Souvenirs/Other"],
  },
} as const;

type Locale = keyof typeof copyByLocale;

const resolveLocale = (value?: string): Locale => (value === "en" ? "en" : "id");

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

const radarOptions = {
  maintainAspectRatio: false,
  scales: { r: { suggestedMin: 0, suggestedMax: 10, ticks: { display: false } } },
};

const barOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

const PLACEHOLDER_PLACE_IMAGE =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80";
const PLACEHOLDER_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";

type Activity = {
  time: string;
  timeClass: string;
  title: string;
  detail: string;
};

type PopoverState = {
  id: string;
  activity: Activity;
  imageUrl: string;
  top: number;
  left: number;
};

const isMealActivity = (activity: Activity) => {
  const text = `${activity.title} ${activity.detail}`.toLowerCase();
  const mealKeywords = ["sarapan", "breakfast", "lunch", "dinner", "makan", "roti"];
  return mealKeywords.some((keyword) => text.includes(keyword));
};

const activityLookupIndex = [...activityLookups].sort(
  (a, b) => b.keyword.length - a.keyword.length
);

const stripCosts = (text: string) =>
  text
    .replace(/\([^)]*(SGD|RM)[^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const getFallbackAddress = (activity: Activity, fallback: string) => {
  const cleaned = stripCosts(activity.detail);
  if (!cleaned) {
    return fallback;
  }
  return cleaned;
};

const getLookupInfo = (activity: Activity, option: TripOption) => {
  const text = `${activity.title} ${activity.detail}`.toLowerCase();
  return activityLookupIndex.find(
    (entry) =>
      entry.option === option && text.includes(entry.keyword.toLowerCase())
  );
};

export default function Home() {
  const pathname = usePathname();
  const locale = resolveLocale(pathname?.split("/")[1]);
  const copy = copyByLocale[locale];
  const [currentOption, setCurrentOption] = useState<TripOption>("B");
  const [currentMode, setCurrentMode] = useState<BudgetMode>("press");
  const [currentDay, setCurrentDay] = useState(0);
  const [activePopover, setActivePopover] = useState<PopoverState | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const sgColor = currentMode === "press" ? "#10b981" : "#a855f7";
  const klColor = currentMode === "press" ? "#f59e0b" : "#0ea5e9";

  const dataByLocale = locale === "en" ? itineraryDataEn : itineraryData;
  const optionData = dataByLocale[currentOption];
  const modeData = optionData[currentMode];
  const dayData = modeData.days[currentDay];
  const activities = useMemo(() => dayData.activities, [dayData.activities]);

  const radarData = useMemo<ChartData<"radar", number[], string>>(
    () => ({
      labels: [...copy.radarLabels],
      datasets: [
        {
          label: copy.optionA,
          data: [6, 7, 7, 9, 4],
          fill: true,
          backgroundColor: "rgba(148, 163, 184, 0.2)",
          borderColor: "rgb(148, 163, 184)",
        },
        {
          label: copy.optionB,
          data: [8, 9, 8, 7, 9],
          fill: true,
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          borderColor: "rgb(245, 158, 11)",
        },
      ],
    }),
    [copy]
  );

  const barData = useMemo<ChartData<"bar", number[], string>>(() => {
    return {
      labels: [...copy.costLabels],
      datasets: [
        {
          label: copy.optionA,
          data: [...costByOptionMode.A[currentMode]] as number[],
          backgroundColor: [sgColor, sgColor, sgColor],
        },
        {
          label: copy.optionB,
          data: [...costByOptionMode.B[currentMode]] as number[],
          backgroundColor: [klColor, klColor, klColor],
        },
      ],
    };
  }, [copy, currentMode, klColor, sgColor]);

  const tagClasses =
    currentMode === "press"
      ? "inline-block px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 mb-2"
      : "inline-block px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800 mb-2";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!activePopover) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePopover(null);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (popoverRef.current?.contains(target)) {
        return;
      }
      if (target.closest("[data-activity-id]")) {
        return;
      }
      setActivePopover(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activePopover]);

  const openPopover = (
    event: React.MouseEvent<HTMLElement>,
    activityId: string,
    activity: Activity,
    imageUrl: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = 10;
    const isNarrow = window.innerWidth < 640;
    const width = isNarrow ? Math.min(320, window.innerWidth - 32) : 260;
    const left = isNarrow
      ? 16
      : Math.min(rect.left + 64, window.innerWidth - width - 16);
    const top = rect.bottom + offset;

    setActivePopover({ id: activityId, activity, imageUrl, top, left });
  };

  return (
    <>
      {activePopover ? (
        <div
          ref={popoverRef}
          id={`activity-popover-${activePopover.id}`}
          role="tooltip"
          className="fixed z-[9999] w-[calc(100vw-2rem)] max-w-xs rounded-lg border border-stone-200 bg-white p-3 shadow-xl md:w-64"
          style={{ top: activePopover.top, left: activePopover.left }}
        >
          <div className="mb-2 overflow-hidden rounded-md border border-stone-100">
            <img
              src={activePopover.imageUrl}
              alt={activePopover.activity.title}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-sm font-bold text-slate-800">
            {activePopover.activity.title}
          </p>
          <p className="text-xs text-slate-500">
            {activePopover.activity.detail || copy.addressMissing}
          </p>
        </div>
      ) : null}
      <header className="bg-slate-900 text-stone-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row justify-between gap-3">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-amber-500">
              {copy.headerTitle}
              <span className="text-xs text-stone-400 font-normal border border-stone-600 rounded px-2 py-0.5 ml-2">
                {copy.headerEdition}
              </span>
            </h1>
            <p className="text-[11px] md:text-xs text-stone-400 mt-1">{copy.headerSub}</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <nav className="hidden md:block w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wide bg-slate-800/70 rounded-full px-2 py-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <a
                  href="#showdown"
                  className="px-2 py-1 rounded-full text-stone-200 hover:text-amber-300 transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
                >
                {copy.navCompare}
                </a>
                <a
                  href="#itinerary"
                  className="px-2 py-1 rounded-full text-stone-200 hover:text-amber-300 transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
                >
                {copy.navItinerary}
                </a>
                <a
                  href="#tips"
                  className="px-2 py-1 rounded-full text-stone-200 hover:text-amber-300 transition-colors whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
                >
                {copy.navTips}
                </a>
              </div>
            </nav>
            <div className="flex items-center justify-center md:justify-end gap-2 text-xs text-stone-400">
              <a
                href="/id"
                className={`flex items-center gap-1 rounded border px-2 py-1 ${
                  locale === "id" ? "border-amber-400 text-amber-400" : "border-stone-700"
                }`}
                aria-label="Bahasa Indonesia"
              >
                <img
                  src="https://flagcdn.com/w40/id.png"
                  alt="ID"
                  className="h-3 w-5 object-cover"
                  loading="lazy"
                />
                ID
              </a>
              <a
                href="/en"
                className={`flex items-center gap-1 rounded border px-2 py-1 ${
                  locale === "en" ? "border-amber-400 text-amber-400" : "border-stone-700"
                }`}
                aria-label="English"
              >
                <img
                  src="https://flagcdn.com/w40/gb.png"
                  alt="EN"
                  className="h-3 w-5 object-cover"
                  loading="lazy"
                />
                EN
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-10 md:space-y-12">
        <section className="text-center max-w-3xl mx-auto mb-12 fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            {copy.heroTitle}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {copy.heroBodyLead} <strong>{copy.heroBodyHemat}</strong> {copy.heroBodyMid}{" "}
            <strong>{copy.heroBodyIdeal}</strong> {copy.heroBodyTail}
          </p>
        </section>

        <section
          id="showdown"
          className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8 scroll-mt-24"
        >
          <div className="mb-6 border-b border-stone-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-amber-600 text-xl">VS</span>
              {copy.headToHeadTitle}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {copy.headToHeadDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col">
              <h4 className="text-center font-semibold text-slate-700 mb-4 uppercase tracking-wider text-sm">
                {copy.vibeLabel}
              </h4>
              <div className="flex justify-center gap-4 text-xs text-slate-600 mb-2">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "rgb(148, 163, 184)" }}
                  />
                  {copy.optionA}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: "rgb(245, 158, 11)" }}
                  />
                  {copy.optionB}
                </span>
              </div>
              <div className="chart-container bg-stone-50 rounded-lg p-2 border border-stone-100">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className="text-center font-semibold text-slate-700 mb-4 uppercase tracking-wider text-sm">
                {copy.pocketLabel}
              </h4>
              <div className="flex justify-center gap-4 text-xs text-slate-600 mb-2">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: sgColor }}
                  />
                  {copy.optionA}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: klColor }}
                  />
                  {copy.optionB}
                </span>
              </div>
              <div className="chart-container bg-stone-50 rounded-lg p-2 border border-stone-100">
                <Bar data={barData} options={barOptions} />
              </div>
              <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-slate-700">
                <strong>{copy.noteLabel}:</strong> {copy.noteBody}
              </div>
            </div>
          </div>
        </section>

        <section id="itinerary" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {copy.itineraryTitle}
              </h3>
              <p className="text-slate-600 text-sm">
                <span className="text-sky-500 font-bold">
                  ● {copy.itineraryLegendMorning}
                </span>{" "}
                |{" "}
                <span className="text-orange-500 font-bold">
                  ● {copy.itineraryLegendNoon}
                </span>{" "}
                | <span className="text-slate-500 font-bold">● {copy.itineraryLegendNight}</span>
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
              <div className="flex bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  aria-pressed={currentMode === "press"}
                  onClick={() => {
                    setCurrentMode("press");
                    setCurrentDay(0);
                  }}
                  className={
                    currentMode === "press"
                      ? "px-4 py-2 rounded-md text-sm font-bold transition-all bg-amber-500 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 focus-visible:outline-offset-2"
                      : "px-4 py-2 rounded-md text-sm font-bold transition-all text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 focus-visible:outline-offset-2"
                  }
                >
                  {copy.modeHemat}
                </button>
                <button
                  type="button"
                  aria-pressed={currentMode === "ideal"}
                  onClick={() => {
                    setCurrentMode("ideal");
                    setCurrentDay(0);
                  }}
                  className={
                    currentMode === "ideal"
                      ? "px-4 py-2 rounded-md text-sm font-bold transition-all bg-amber-500 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 focus-visible:outline-offset-2"
                      : "px-4 py-2 rounded-md text-sm font-bold transition-all text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200 focus-visible:outline-offset-2"
                  }
                >
                  {copy.modeSultan}
                </button>
              </div>

              <div className="flex bg-stone-200 p-1 rounded-lg">
                <button
                  type="button"
                  aria-pressed={currentOption === "A"}
                  onClick={() => {
                    setCurrentOption("A");
                    setCurrentDay(0);
                  }}
                  className={
                    currentOption === "A"
                      ? "px-6 py-2 rounded-md text-sm font-bold transition-all bg-white text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2"
                      : "px-6 py-2 rounded-md text-sm font-bold transition-all text-slate-600 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2"
                  }
                >
                  {copy.optionA}
                </button>
                <button
                  type="button"
                  aria-pressed={currentOption === "B"}
                  onClick={() => {
                    setCurrentOption("B");
                    setCurrentDay(0);
                  }}
                  className={
                    currentOption === "B"
                      ? "px-6 py-2 rounded-md text-sm font-bold transition-all bg-white text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2"
                      : "px-6 py-2 rounded-md text-sm font-bold transition-all text-slate-600 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2"
                  }
                >
                  {copy.optionB}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden min-h-[500px] flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-slate-50 border-b md:border-b-0 md:border-r border-stone-200 flex md:flex-col overflow-x-auto md:overflow-x-visible">
              <div className="p-4 bg-slate-100 border-b border-stone-200 hidden md:block">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {copy.chooseDay}
                </span>
              </div>
              <div id="day-nav-container" className="flex md:flex-col w-full">
                {modeData.days.map((day, index) => {
                  const isActive = index === currentDay;
                  const baseClasses =
                    "flex-shrink-0 w-auto p-2 text-[11px] border-r border-stone-200 transition-colors flex justify-between items-center md:w-full md:text-left md:text-sm md:p-4 md:border-b md:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2";
                  const activeClasses = isActive
                    ? "bg-white text-amber-600 border-b-4 border-b-amber-500 md:border-b-0 md:border-l-4 md:border-l-amber-500"
                    : "text-slate-500 bg-stone-50 hover:bg-slate-50";

                  return (
                    <button
                      type="button"
                      key={day.title}
                      className={`${baseClasses} ${activeClasses}`}
                      onClick={() => setCurrentDay(index)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span>
                        {copy.dayLabel} {index + 1}
                      </span>
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
                  <span className="block text-xs text-slate-400 uppercase">
                    {copy.totalDaily}
                  </span>
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
                className="flex-grow space-y-6 text-slate-700 custom-scroll overflow-y-auto max-h-[420px] md:max-h-[600px] pr-2 fade-in"
                onScroll={() => setActivePopover(null)}
              >
                <ul className="list-none space-y-4">
                  {activities.map((activity, index) => {
                    const activityId = `${currentOption}-${currentMode}-${currentDay}-${index}`;
                    const lookup = getLookupInfo(activity, currentOption);
                    const useFoodImage = isMealActivity(activity);
                    const imageUrl =
                      lookup?.imageUrl ?
                      (useFoodImage ? PLACEHOLDER_FOOD_IMAGE : PLACEHOLDER_PLACE_IMAGE);
                    const infoTitle = lookup?.title ? activity.title;
                    const infoAddress =
                      lookup?.address || getFallbackAddress(activity, copy.addressFallback);
                    const isActive = activePopover?.id === activityId;

                    return (
                      <li
                        key={activityId}
                        data-activity-id={activityId}
                        className="relative flex gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
                        onMouseEnter={(event) =>
                          openPopover(
                            event,
                            activityId,
                            { ...activity, title: infoTitle, detail: infoAddress },
                            imageUrl
                          )
                        }
                        onMouseLeave={() => setActivePopover(null)}
                        onClick={(event) => {
                          if (activePopover?.id === activityId) {
                            setActivePopover(null);
                            return;
                          }
                          openPopover(
                            event,
                            activityId,
                            { ...activity, title: infoTitle, detail: infoAddress },
                            imageUrl
                          );
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            if (activePopover?.id === activityId) {
                              setActivePopover(null);
                              return;
                            }
                            openPopover(
                              event as unknown as React.MouseEvent<HTMLElement>,
                              activityId,
                              { ...activity, title: infoTitle, detail: infoAddress },
                              imageUrl
                            );
                          }
                        }}
                        aria-describedby={isActive ? `activity-popover-${activityId}` : undefined}
                        aria-expanded={isActive}
                        role="button"
                        tabIndex={0}
                      >
                        <span className={activity.timeClass}>{activity.time}</span>
                        <div>
                          <p className="font-bold">{activity.title}</p>
                          <p className="text-sm">{activity.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

<div
                id="daily-tip"
                className="mt-8 p-4 bg-slate-800 text-stone-200 rounded-lg text-sm border-l-4 border-amber-500"
              >
                <span className="font-bold text-amber-400 mr-2">{copy.broTip}:</span>
                <span id="tip-text">{dayData.tip}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="tips" className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-mt-24">
          <div className="md:col-span-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-800">{copy.tipsTitle}</h3>
            <p className="text-slate-600">{copy.tipsDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">💧</div>
            <h4 className="font-bold text-slate-900 mb-2">{copy.tip1Title}</h4>
            <p className="text-sm text-slate-600">{copy.tip1Body}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🚗</div>
            <h4 className="font-bold text-slate-900 mb-2">{copy.tip2Title}</h4>
            <p className="text-sm text-slate-600">{copy.tip2Body}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📶</div>
            <h4 className="font-bold text-slate-900 mb-2">{copy.tip3Title}</h4>
            <p className="text-sm text-slate-600">{copy.tip3Body}</p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-stone-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">{copy.footerLine1}</p>
          <p className="text-xs mt-2 text-stone-600">
            {copy.footerLine2}
          </p>
        </div>
      </footer>
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-50">
        <div className="flex items-center justify-around gap-2 rounded-full bg-slate-900/95 border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stone-200 shadow-lg">
          <a
            href="#showdown"
            className="px-3 py-1 rounded-full hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
          >
            {copy.navCompare}
          </a>
          <a
            href="#itinerary"
            className="px-3 py-1 rounded-full hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
          >
            {copy.navItinerary}
          </a>
          <a
            href="#tips"
            className="px-3 py-1 rounded-full hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 focus-visible:outline-offset-2"
          >
            {copy.navTips}
          </a>
        </div>
      </nav>
    </>
  );
}
