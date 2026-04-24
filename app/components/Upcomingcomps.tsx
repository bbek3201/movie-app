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

export const Upcomingcomps = ({ skip, setSkip, setTotal, total }: Props) => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [showAll, setShowAll] = useState(false);

  // 1. Дата татах хэсэг
  useEffect(() => {
    const page = Math.floor(skip / MOVIES_PER_PAGE) + 1;

    axios
      .get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`,
      )
      .then((res) => {
        setMovies(res.data.results);
        // Энд total_pages-ийг авч байгаа бол доор нь дахин 20-д хуваах шаардлагагүй болно
        setTotal(res.data.total_pages);
      })
      .catch((err) => console.error("API Error:", err));
  }, [skip, setTotal]);

  // 2. Функцууд
  const handleNext = () => {
    setSkip((prev) => prev + MOVIES_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setSkip((prev) => Math.max(0, prev - MOVIES_PER_PAGE));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleMovies = showAll ? movies : movies.slice(0, 10);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center py-6">
        <h2 className="text-white text-2xl font-bold">Upcoming</h2>
        <button
          onClick={() => {
            if (showAll) {
              setSkip(0);
              setShowAll(false);
            } else {
              setShowAll(true);
            }
          }}
          className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          {showAll ? "Back" : "See more"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 place-items-center">
        {visibleMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`movie/${movie.id}`}
            className="group w-full max-w-[230px] flex flex-col items-center text-center"
          >
            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl shadow-lg bg-zinc-900">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="mt-3 w-full">
              <p className="text-yellow-400 font-bold text-lg">
                ★ {movie.vote_average?.toFixed(1)}
              </p>
              <p className="text-white font-bold text-lg line-clamp-1 group-hover:text-indigo-400 transition-colors">
                {movie.title}
              </p>
              <p className="text-sm text-gray-400">
                {movie.release_date?.split("-")[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {showAll && (
        <div className="mt-12 flex items-center justify-center gap-6 pb-10">
          <button
            onClick={handlePrev}
            disabled={skip === 0}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 transition-all"
          >
            &larr; Өмнөх
          </button>

          <span className="text-sm text-zinc-400 font-bold">
            {/* Одоогийн хуудас / Нийт хуудас */}
            {Math.floor(skip / MOVIES_PER_PAGE) + 1} / {total}
          </span>

          <button
            onClick={handleNext}
            disabled={Math.floor(skip / MOVIES_PER_PAGE) + 1 >= total}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 transition-all"
          >
            Дараах &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
