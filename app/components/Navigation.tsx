"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import axios from "axios";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export const Navigation = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => {
        setGenres(res.data.genres);
      })
      .catch((err) => console.error("Genres fetch error:", err));
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      axios
        .get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchValue}`,
        )
        .then((res) => {
          setSearchResults(res.data.results);
        })
        .catch((err) => console.error("Search error:", err));
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  return (
    <div className="flex w-full h-16 justify-between px-20 items-center relative bg-white dark:bg-black border-b border-gray-100 dark:border-zinc-800 z-50">
      <Link href={"/"}>
        <div className="flex gap-2 items-center cursor-pointer">
          <img className="w-6 h-6" src="/film.svg" alt="Logo" />
          <p className="text-indigo-700 text-[18px] font-bold">Movie Z</p>
        </div>
      </Link>

      <div className="flex gap-4 items-center relative">
        <div className="relative">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex gap-2 border border-gray-300 dark:border-zinc-700 rounded-md px-4 py-2 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <img
              className={`w-4 h-4 transition-transform ${isActive ? "rotate-180" : ""}`}
              src="/chevron-down.svg"
              alt=""
            />
            <p className="font-bold text-sm text-black dark:text-white">
              Genre
            </p>
          </button>

          {isActive && (
            <div className="absolute top-12 left-0 w-125 bg-black border border-zinc-800 shadow-2xl rounded-lg p-6 z-50">
              <h1 className="text-xl font-bold text-white mb-1">Genres</h1>
              <p className="text-gray-300 text-sm mb-4">
                See lists of movies by genre
              </p>
              <hr className="border-zinc-800 mb-4" />
              <div className="grid grid-cols-3 gap-3">
                {genres.map((gen) => (
                  <Link
                    key={gen.id}
                    href={`/genres/${gen.id}?name=${gen.name}`}
                    onClick={() => setIsActive(false)}
                    className="group flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2 rounded-full hover:border-indigo-500 hover:bg-zinc-800 transition-all duration-300"
                  >
                    <span className="text-zinc-200 group-hover:text-white font-semibold text-xs truncate">
                      {gen.name}
                    </span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-800 group-hover:bg-indigo-600 transition-colors">
                      <ChevronRight className="w-3 h-3 text-white opacity-70 group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search movies..."
            value={searchValue}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 w-100 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xl rounded-md z-50 max-h-96 overflow-y-auto">
              {searchResults.slice(0, 5).map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={() => setSearchValue("")}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer flex gap-4 border-b last:border-none border-gray-100 dark:border-zinc-800"
                >
                  <img
                    className="w-12 h-16 rounded object-cover"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "/no-image.png"
                    }
                    alt={movie.title}
                  />
                  <div className="flex flex-col justify-center flex-1">
                    <span className="font-bold text-sm text-black dark:text-white line-clamp-1">
                      {movie.original_title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold text-sm">
                        ★ {movie.vote_average?.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {movie.release_date?.split("-")[0]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="border border-gray-300 dark:border-zinc-700 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
        <img src="/moon.svg" alt="Theme Toggle" className="h-5 w-5" />
      </button>
    </div>
  );
};
