"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import axios from "axios";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export const Navigation = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);

  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => setGenres(res.data.genres))
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
        .then((res) => setSearchResults(res.data.results))
        .catch((err) => console.error("Search error:", err));
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="sticky top-0 z-100 flex w-full h-16 justify-between px-10 md:px-20 items-center bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="shrink-0">
        <Link href={"/"}>
          <div className="flex gap-2 items-center cursor-pointer">
            <img className="w-6 h-6 dark:invert" src="/film.svg" alt="Logo" />
            <p className="text-indigo-700 dark:text-indigo-500 text-[18px] font-bold hidden sm:block">
              Movie Z
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-center max-w-2xl px-4">
        <div className="relative">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex gap-2 border border-gray-300 dark:border-zinc-700 rounded-md px-4 py-2 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors bg-white dark:bg-zinc-900 whitespace-nowrap"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-180" : ""} text-black dark:text-white`}
            />
            <p className="font-bold text-sm text-black dark:text-white">
              Genre
            </p>
          </button>

          {isActive && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-125 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-2xl rounded-lg p-6 z-50">
              <h1 className="text-xl font-bold text-black dark:text-white mb-1">
                Genres
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                See lists of movies by genre
              </p>
              <hr className="border-gray-100 dark:border-zinc-800 mb-4" />
              <div className="grid grid-cols-3 gap-3">
                {genres.map((gen) => (
                  <Link
                    key={gen.id}
                    href={`/genres/${gen.id}?name=${gen.name}`}
                    onClick={() => setIsActive(false)}
                    className="group flex items-center justify-between bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 pl-4 rounded-full hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300"
                  >
                    <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-white font-semibold text-xs truncate">
                      {gen.name}
                    </span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-800 group-hover:bg-indigo-600 transition-colors">
                      <ChevronRight className="w-3 h-3 text-gray-600 dark:text-white opacity-70 group-hover:opacity-100 group-hover:text-white" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search movies..."
            value={searchValue}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xl rounded-md z-50 max-h-96 overflow-y-auto">
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

      <div className="shrink-0">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="rounded-lg p-2 md:px-4 md:py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-100 transition-colors duration-200"
          aria-label="Өнгөт горим солих"
        >
          {isDark ? "☀" : "🌙"}{" "}
          <span className="hidden md:inline ml-1">
            {isDark ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </nav>
  );
};
