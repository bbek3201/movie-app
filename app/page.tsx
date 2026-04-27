"use client";

import { Navigation } from "./components/Navigation";
import { HeaderUpcoming } from "./components/HeaderUpcoming";
import { Upcomingcomps } from "./components/Upcomingcomps";
import { Popular } from "./components/Popular";
import { TopRated } from "./components/TopRated";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  const [upcomingSkip, setUpcomingSkip] = useState(0);
  const [upcomingTotal, setUpcomingTotal] = useState(0);

  const currentPage = Math.floor(upcomingSkip / PRODUCTS_PER_PAGE) + 1;

  const totalPages =
    Math.min(Math.ceil(upcomingTotal / PRODUCTS_PER_PAGE), 500) || 1;

  const handlePrev = () => {
    if (upcomingSkip > 0) {
      setUpcomingSkip((s) => Math.max(0, s - PRODUCTS_PER_PAGE));
      window.scrollTo({ top: 1000, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (upcomingSkip + PRODUCTS_PER_PAGE < upcomingTotal) {
      setUpcomingSkip((s) => s + PRODUCTS_PER_PAGE);
      window.scrollTo({ top: 1000, behavior: "smooth" });
    }
  };

  const goToPage = (p: number) => {
    setUpcomingSkip((p - 1) * PRODUCTS_PER_PAGE);
    window.scrollTo({ top: 1000, behavior: "smooth" });
  };

  return (
    <div className="bg-black flex min-h-screen w-full flex-col items-center justify-start">
      <div className="bg-black w-full h-14.75 sticky top-0 z-50">
        <Navigation />
      </div>
      <div className="w-full h-[600px] relative z-0">
        <HeaderUpcoming />
      </div>

      <div className=" z-10 w-full max-w-7xl px-6 -mt-20 flex flex-col gap-10 pt-100 ">
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

        <div className="mt-14 flex items-center justify-center gap-6 pb-20 select-none">
          <button
            onClick={handlePrev}
            disabled={upcomingSkip === 0}
            className="flex items-center gap-2 text-sm font-bold text-white transition-all hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <span className="text-xl">‹</span> Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${currentPage === 1 ? "border border-zinc-700 bg-zinc-900 text-white" : "text-zinc-500 hover:text-white"}`}
            >
              1
            </button>

            {currentPage > 1 && currentPage < totalPages && (
              <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-sm font-black text-white shadow-lg">
                {currentPage}
              </div>
            )}

            <span className="px-2 text-zinc-600 font-bold">...</span>

            {totalPages > 1 && (
              <button
                onClick={() => goToPage(totalPages)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${currentPage === totalPages ? "border border-zinc-700 bg-zinc-900 text-white" : "text-zinc-500 hover:text-white"}`}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={upcomingSkip + PRODUCTS_PER_PAGE >= upcomingTotal}
            className="flex items-center gap-2 text-sm font-bold text-white transition-all hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next <span className="text-xl">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
