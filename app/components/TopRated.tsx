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

export const TopRated = ({ skip, setSkip, setTotal, total }: Props) => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const page = Math.floor(skip / MOVIES_PER_PAGE) + 1;
    axios
      .get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`,
      )
      .then((res) => {
        setMovies(res.data.results);

        setTotal(Math.min(res.data.total_pages, 500));
      })
      .catch((err) => console.error("Top Rated API error:", err));
  }, [skip, setTotal]);

  const visibleMovies = showAll ? movies : movies.slice(0, 10);
  const currentPage = Math.floor(skip / MOVIES_PER_PAGE) + 1;

  const goToPage = (p: number) => {
    setSkip((p - 1) * MOVIES_PER_PAGE);

    window.scrollTo({ top: 2000, behavior: "smooth" });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 md:px-10">
      <div className="flex justify-between items-center py-8">
        <h2 className="text-white text-2xl font-black uppercase tracking-widest">
          Top Rated
        </h2>
        <button
          onClick={() => {
            if (showAll) {
              setSkip(0);
              setShowAll(false);
            } else {
              setShowAll(true);
            }
          }}
          className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors uppercase text-sm tracking-widest"
        >
          {showAll ? "❮ Back" : "See more ❯"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
        {visibleMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group flex flex-col space-y-3"
          >
            <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-xl bg-zinc-900 border border-zinc-800/50">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase text-xs">
                  No Image
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-indigo-500 transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-black text-sm">
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-zinc-500 font-bold text-xs">
                  {movie.release_date?.split("-")[0] || "N/A"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showAll && (
        <div className="mt-14 flex items-center justify-center gap-6 pb-20 select-none">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 text-sm font-bold text-white transition-all hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <span className="text-xl">‹</span> Previous
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  currentPage === p
                    ? "border border-zinc-700 bg-zinc-900 text-white shadow-lg font-black"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-2 text-zinc-600 font-bold">...</span>
            <button
              onClick={() => goToPage(total)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                currentPage === total
                  ? "border border-zinc-700 bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-800"
              }`}
            >
              {total}
            </button>
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === total}
            className="flex items-center gap-2 text-sm font-bold text-white transition-all hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next <span className="text-xl">›</span>
          </button>
        </div>
      )}
    </div>
  );
};
