"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import React from "react";
import { Movies } from "../types";
import axios from "axios";
import Link from "next/link";

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
      className="relative w-full max-w-7xl mx-auto px-4 md:px-10"
      // Хэрэв showAll идэвхтэй бол хоосон зай дээр дарахад хаагдана
      onClick={() => showAll && handleBack()}
    >
      <div className="flex justify-between items-center py-8">
        <h2 className="text-black dark:text-white text-2xl font-black uppercase tracking-widest">
          Popular
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Контейнерийн onClick-ийг ажиллуулахгүй байх
            if (showAll) handleBack();
            else setShowAll(true);
          }}
          className="z-10 text-indigo-500 hover:text-indigo-400 font-bold transition-colors uppercase text-sm tracking-widest"
        >
          {showAll ? "❮ Back" : "See more ❯"}
        </button>
      </div>

      {!showAll ? (
        <div className="grid grid-rows-2 grid-flow-col gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory overflow-y-hidden">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="w-[160px] sm:w-[180px] md:w-[200px] group snap-start flex flex-col space-y-2"
            >
              {/* Киноны карт дээр дарахад handleBack ажиллахгүй байх хэрэгтэй */}
              <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/50">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-black dark:text-white font-bold text-xs line-clamp-1 group-hover:text-indigo-500 transition-colors">
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
          onClick={(e) => e.stopPropagation()} // Карт хоорондын зай дээр дарахад хаагдахгүй байх (хэрэв хүсвэл энийг устгаж болно)
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              onClick={(e) => e.stopPropagation()} // Кино руу орох үед хаагдахгүй байх
              className="group flex flex-col space-y-3"
            >
              <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/50">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-black dark:text-white font-bold text-base line-clamp-1 group-hover:text-indigo-500 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-black text-sm">
                    ★ {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-gray-400 dark:text-zinc-500 font-bold text-xs">
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
          onClick={(e) => e.stopPropagation()} // Pagination хэсэг дээр дарахад хаагдахгүй байх
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-bold text-black dark:text-white hover:opacity-70 disabled:opacity-20"
          >
            ‹ Prev
          </button>

          <div className="flex items-center gap-2">
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="h-10 w-10 text-gray-400 font-bold hover:text-black dark:hover:text-white"
                >
                  1
                </button>
                <span className="text-gray-400 dark:text-zinc-600">...</span>
              </>
            )}

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                  currentPage === p
                    ? "bg-indigo-600 text-white shadow-lg scale-110"
                    : "border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-500"
                }`}
              >
                {p}
              </button>
            ))}

            {currentPage < total - 2 && (
              <>
                <span className="text-gray-400 dark:text-zinc-600">...</span>
                <button
                  onClick={() => goToPage(total)}
                  className="h-10 w-10 text-gray-400 font-bold hover:text-black dark:hover:text-white"
                >
                  {total}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === total}
            className="px-3 py-2 text-sm font-bold text-black dark:text-white hover:opacity-70 disabled:opacity-20"
          >
            Next ›
          </button>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
