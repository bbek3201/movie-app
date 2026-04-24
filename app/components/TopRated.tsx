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
        setTotal(res.data.total_results);
      });
  }, [skip, setTotal]);

  const visibleMovies = showAll ? movies : movies.slice(0, 10);

  const handleNext = () => setSkip((prev) => prev + MOVIES_PER_PAGE);
  const handlePrev = () =>
    setSkip((prev) => Math.max(prev - MOVIES_PER_PAGE, 0));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10">
      <div className="flex justify-between items-center py-8">
        <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic">
          Top Rated
        </h2>
        <button
          onClick={() => {
            setShowAll(!showAll);
            if (showAll) setSkip(0);
          }}
          className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
        >
          {showAll ? "Back" : "See more ❯"}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 place-items-center">
        {visibleMovies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group w-full max-w-[230px] flex flex-col items-center text-center space-y-3"
          >
            <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl shadow-xl bg-zinc-900 border border-zinc-800/50">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 italic">
                  No Poster
                </div>
              )}
            </div>

            <div className="w-full px-2">
              <p className="text-yellow-400 font-bold text-lg">
                ★ {movie.vote_average?.toFixed(1)}
              </p>
              <h3 className="text-white font-bold text-sm md:text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                {movie.release_date?.split("-")[0] || "N/A"}
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
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 transition-all shadow-md"
          >
            &larr; Prev
          </button>

          <span className="text-sm text-zinc-400 font-bold bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
            {Math.floor(skip / MOVIES_PER_PAGE) + 1} /{" "}
            {Math.ceil(total / MOVIES_PER_PAGE)}
          </span>

          <button
            onClick={handleNext}
            disabled={skip + MOVIES_PER_PAGE >= total}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 transition-all shadow-md"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
