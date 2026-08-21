import React from "react";
import Link from "next/link";
import { Calculator, Table2, LineChart, ChevronRight } from "lucide-react";

export const metadata = {
  title: "MEPKit | Mechanical, Electrical, and Plumbing Engineering Toolbox",
  description: "The ultimate reference and toolkit for MEP professionals. Calculators, data tables, and charts for fluid dynamics, pipe flow, and more.",
};

export default function Home() {
  const categories = [
    {
      title: "Calculators",
      href: "/calculators",
      icon: <Calculator className="w-8 h-8 mb-4 text-blue-500" />,
      desc: "Interactive engineering calculators for complex problems like pipe pressure drop and fluid dynamics.",
      color: "border-blue-500/20 hover:border-blue-500",
    },
    {
      title: "Data Tables",
      href: "/tables",
      icon: <Table2 className="w-8 h-8 mb-4 text-green-500" />,
      desc: "Comprehensive reference tables for pipe dimensions, fluid properties, and fitting K-Factors.",
      color: "border-green-500/20 hover:border-green-500",
    },
    {
      title: "Interactive Tools",
      href: "/tools",
      icon: <Calculator className="w-8 h-8 mb-4 text-orange-500" />,
      desc: "Advanced engineering tools to build Bill of Materials and simulate pipe networks.",
      color: "border-orange-500/20 hover:border-orange-500",
    },
    {
      title: "Charts & Graphs",
      href: "/charts",
      icon: <LineChart className="w-8 h-8 mb-4 text-purple-500" />,
      desc: "Visualize engineering data with interactive charts for fluid viscosity, density vs temperature, and more.",
      color: "border-purple-500/20 hover:border-purple-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="flex-1 w-full max-w-6xl mx-auto py-20 px-6 sm:px-12 flex flex-col items-center text-center">
        
        {/* Hero Section */}
        <div className="mb-16 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
            The Engineering Toolbox for MEP Professionals
          </h1>
          <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            MEPKit provides instant access to hundreds of engineering reference tables, interactive charts, and precise calculators for Mechanical, Electrical, and Plumbing design.
          </p>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href} className="group block">
              <div className={`flex flex-col text-left h-full border-2 rounded-2xl p-8 bg-white dark:bg-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl ${cat.color}`}>
                {cat.icon}
                <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                  {cat.title}
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
