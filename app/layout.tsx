import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bro-Trip Budget Planner: SG+JB vs KL+Melaka",
  description:
    "Planner perjalanan 5 hari untuk 3 orang, lengkap dengan perbandingan budget dan itinerary harian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-stone-100 text-slate-800 font-sans selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
