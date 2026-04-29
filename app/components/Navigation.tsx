"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "./Input";
import axios from "axios";
import Link from "next/link";
import { ChevronRight, ChevronDown, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export const Navigation = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);

  const genreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <nav className="sticky top-0 z-50 flex w-full h-16 justify-between px-6 md:px-20 items-center bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="shrink-0">
        <Link href={"/"}>
          <div className="flex gap-2 items-center cursor-pointer">
            <img className="w-6 h-6 dark:invert" src="/film.svg" alt="Logo" />
            <p className="text-zinc-900 dark:text-zinc-50 text-[18px] font-bold hidden sm:block">
              Movie Z
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-1 justify-center max-w-2xl px-4">
        <div className="relative" ref={genreRef}>
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex gap-2 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 items-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all bg-white dark:bg-zinc-950"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isActive ? "rotate-180" : ""
              } text-zinc-900 dark:text-zinc-400`}
            />
            <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Genre
            </p>
          </button>

          {isActive && (
            <div className="absolute top-12 left-0 sm:left-1/2 sm:-translate-x-1/2 w-87.5 sm:w-125 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                Genres
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                See lists of movies by genre
              </p>
              <hr className="border-zinc-100 dark:border-zinc-800 mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {genres.map((gen) => (
                  <Link
                    key={gen.id}
                    href={`/genres/${gen.id}?name=${gen.name}`}
                    onClick={() => setIsActive(false)}
                    className="group flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-2 pl-3 rounded-full hover:border-indigo-500 dark:hover:border-indigo-500 transition-all"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold text-xs truncate">
                      {gen.name}
                    </span>
                    <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-indigo-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none z-10" />
          <Input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search movies..."
            value={searchValue}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2 transition-all outline-none"
          />

          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl z-50 max-h-96 overflow-y-auto overflow-x-hidden transition-all">
              {searchResults.slice(0, 5).map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={() => setSearchValue("")}
                  className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer flex gap-4 border-b last:border-none border-zinc-100 dark:border-zinc-800/50"
                >
                  <img
                    className="w-10 h-14 rounded-md object-cover bg-zinc-200 dark:bg-zinc-800"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "/no-image.png"
                    }
                    alt={movie.title}
                  />
                  <div className="flex flex-col justify-center flex-1">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50 line-clamp-1">
                      {movie.original_title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold text-xs">
                        ★ {movie.vote_average?.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
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
        <ThemeToggle />
      </div>
    </nav>
  );
};
