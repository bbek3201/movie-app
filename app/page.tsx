"use client";

import Image from "next/image";
import { Navigation } from "./components/Navigation";
import { HeaderUpcoming } from "./components/HeaderUpcoming";
import { Upcomingcomps } from "./components/Upcomingcomps";
import { Popular } from "./components/Popular";
import { TopRated } from "./components/TopRated";
import { SetStateAction, useState } from "react";
const PRODUCTS_PER_PAGE = 12;
export default function Home() {
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const handlePrev = () => {
    setSkip((s) => Math.max(0, s - PRODUCTS_PER_PAGE));
  };
  const handleNext = () => {
    setSkip((s) => s + PRODUCTS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div
      className=" bg-black
   flex  h-auto
    w-full flex-col items-center justify-start gap-10"
    >
      <div className="bg-black w-full h-14.75">
        <Navigation />
      </div>
      <div className="w-full h-150">
        <HeaderUpcoming />
      </div>
      <div className="py-50 w-full h-100 flex flex-col  justify-start gap-4">
        <Upcomingcomps skip={skip} setTotal={setTotal} />
        <Popular skip={skip} setTotal={setTotal} />
        <TopRated skip={skip} setTotal={setTotal} />
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={skip === 0}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            &larr; Өмнөх
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {Math.floor(skip / PRODUCTS_PER_PAGE) + 1} /
            {Math.ceil(total / PRODUCTS_PER_PAGE)}
          </span>
          <button
            onClick={handleNext}
            disabled={skip + PRODUCTS_PER_PAGE >= total}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Дараах &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
