"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import React from "react";
import { Movies } from "../types";
import axios from "axios";
import Link from "next/link";
import { useTheme } from "next-themes";

type Props = {
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  setTotal: Dispatch<SetStateAction<number>>;
  total: number;
};

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";
const MOVIES_PER_PAGE = 20;

export const Popular = ({ skip, setSkip, setTotal, total }: Props) => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const page = Math.floor(skip / MOVIES_PER_PAGE) + 1;
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`,
      )
      .then((res) => {
        setMovies(res.data.results);
        setTotal(Math.min(res.data.total_pages, 500));
      })
      .catch((err) => console.error("Popular API error:", err));
  }, [skip, setTotal]);

  if (!mounted) return null;

  const currentPage = Math.floor(skip / MOVIES_PER_PAGE) + 1;

  const handleBack = () => {
    setSkip(0);
    setShowAll(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const goToPage = (p: number) => {
    setSkip((p - 1) * MOVIES_PER_PAGE);
    window.scrollTo({ top: 1000, behavior: "smooth" });
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 md:px-10 transition-colors duration-300"
      onClick={() => showAll && handleBack()}
    >
      <div className="flex justify-between items-center py-8">
        <h2 className="text-zinc-900 dark:text-zinc-50 text-2xl font-black uppercase tracking-widest">
          Popular
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (showAll) handleBack();
            else setShowAll(true);
          }}
          className="z-10 text-indigo-600 dark:text-indigo-400 hover:opacity-80 font-bold transition-all uppercase text-sm tracking-widest"
        >
          {showAll ? "❮ Back" : "See more ❯"}
        </button>
      </div>

      {!showAll ? (
        <div className="grid grid-rows-2 grid-flow-col gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="w-40 sm:w-45 md:w-50 group snap-start flex flex-col space-y-2"
            >
              <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 transition-colors">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-zinc-900 dark:text-zinc-50 font-bold text-xs line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-yellow-500 font-bold text-[10px]">
                  ★ {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 animate-in fade-in duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              onClick={(e) => e.stopPropagation()}
              className="group flex flex-col space-y-3"
            >
              <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 transition-colors">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-zinc-900 dark:text-zinc-50 font-bold text-base line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-black text-sm">
                    ★ {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold text-xs">
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showAll && (
        <div
          className="mt-14 flex items-center justify-center gap-2 md:gap-4 pb-20 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:text-indigo-600 disabled:opacity-20 transition-all"
          >
            ‹ Prev
          </button>

          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="h-10 w-10 font-bold"
                >
                  1
                </button>
                <span className="text-zinc-400">...</span>
              </>
            )}
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                  currentPage === p
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "border border-zinc-200 dark:border-zinc-700 hover:text-indigo-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === total}
            className="px-3 py-2 text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:text-indigo-600 disabled:opacity-20 transition-all"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};
