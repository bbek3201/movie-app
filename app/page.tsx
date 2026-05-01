"use client";

import { Navigation } from "./components/Navigation";
import { HeaderUpcoming } from "./components/HeaderUpcoming";
import { Upcomingcomps } from "./components/Upcomingcomps";
import { Popular } from "./components/Popular";
import { TopRated } from "./components/TopRated";
import { useState, useEffect } from "react";
import { Footer } from "./components/Footer";
import { useTheme } from "next-themes";

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  const [upcomingSkip, setUpcomingSkip] = useState(0);
  const [upcomingTotal, setUpcomingTotal] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPage = Math.floor(upcomingSkip / PRODUCTS_PER_PAGE) + 1;
  const totalPages =
    Math.min(Math.ceil(upcomingTotal / PRODUCTS_PER_PAGE), 500) || 1;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrev = () => {
    if (upcomingSkip > 0) {
      setUpcomingSkip((s) => Math.max(0, s - PRODUCTS_PER_PAGE));
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (upcomingSkip + PRODUCTS_PER_PAGE < upcomingTotal) {
      setUpcomingSkip((s) => s + PRODUCTS_PER_PAGE);
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };

  const goToPage = (p: number) => {
    setUpcomingSkip((p - 1) * PRODUCTS_PER_PAGE);
    window.scrollTo({ top: 800, behavior: "smooth" });
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="bg-(--app-bg) flex min-h-screen w-full flex-col items-center justify-start transition-colors duration-300">
      <div className="w-full h-150 relative z-0">
        <HeaderUpcoming />
      </div>

      <div className="z-10 w-full max-w-7xl px-6 -mt-20 flex flex-col gap-16 pt-80">
        <Upcomingcomps
          skip={upcomingSkip}
          setSkip={setUpcomingSkip}
          total={upcomingTotal}
          setTotal={setUpcomingTotal}
        />
        <Popular
          skip={upcomingSkip}
          setSkip={setUpcomingSkip}
          total={upcomingTotal}
          setTotal={setUpcomingTotal}
        />
        <TopRated
          skip={upcomingSkip}
          setSkip={setUpcomingSkip}
          total={upcomingTotal}
          setTotal={setUpcomingTotal}
        />

        <div className="mt-14 flex items-center justify-center gap-2 md:gap-4 pb-20 select-none">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            ‹ Prev
          </button>

          <div className="flex items-center gap-2">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="h-10 w-10 text-zinc-900 dark:text-zinc-100 font-bold hover:text-indigo-600 transition-colors"
                >
                  1
                </button>
                <span className="text-zinc-400 font-bold">...</span>
              </>
            )}

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all duration-200 border ${
                  currentPage === p
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-110"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-indigo-500 hover:text-indigo-500"
                }`}
              >
                {p}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                <span className="text-zinc-400 font-bold">...</span>
                <button
                  onClick={() => goToPage(totalPages)}
                  className="h-10 w-10 text-zinc-900 dark:text-zinc-100 font-bold hover:text-indigo-600 transition-colors"
                >
                  {totalPages > 500 ? 500 : totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Next ›
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
