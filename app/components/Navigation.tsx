"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import axios from "axios";
import Link from "next/link";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export const Navigation = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Эхлээд төрлүүдийг (Genres) татаж авах
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => {
        setGenres(res.data.genres);
      })
      .catch((err) => console.error("Genres fetch error:", err));
  }, []);

  // Хайлт хийх логик
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
    <div className="flex w-full h-16 justify-between px-20 items-center relative bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800">
      <button className="flex gap-2 items-center cursor-pointer">
        <img className="w-6 h-6" src="film.svg" alt="Logo" />
        <p className="text-indigo-700 text-[18px] font-bold">Movie Z</p>
      </button>

      <div className="flex gap-4 items-center relative">
        <div className="relative">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex gap-2 border border-gray-300 rounded-md px-4 py-2 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <img className="w-4 h-4" src="chevron-down.svg" alt="" />
            <p className="font-bold text-sm text-black dark:text-white">
              Genre
            </p>
          </button>

          {isActive && (
            <div className="absolute top-12 left-0 w-80 bg-black border border-gray-200 shadow-2xl rounded-lg p-6 z-50">
              <h1 className="text-xl font-bold text-white mb-1">Genres</h1>
              <p className="text-gray-300 text-sm mb-4">
                See lists of movies by genre
              </p>
              <hr className="mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {genres.map((gen) => (
                  <div
                    key={gen.id}
                    className="text-white hover:text-indigo-700 cursor-pointer text-sm font-medium transition-colors"
                  >
                    {gen.name}
                  </div>
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
            <div className="absolute top-12 left-0 w-full bg-black border border-gray-700 shadow-xl rounded-md z-50 max-h-60 overflow-y-auto">
              {searchResults.slice(0, 5).map((movie) => (
                <div
                  key={movie.id}
                  className="p-2  text-white text-sm cursor-pointer flex gap-10 "
                >
                  <img
                    className="rounded"
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className="flex flex-col gap-2">
                    <span
                      className="bolder
                    "
                    >
                      {movie.original_title}
                    </span>
                    <span className="">{movie.release_date}</span>
                    <span className="">{movie.original_language}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
        <img src="moon.svg" alt="Theme Toggle" className="h-5 w-5" />
      </button>
    </div>
  );
};
