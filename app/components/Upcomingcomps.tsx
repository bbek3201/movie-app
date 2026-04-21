"use client";
import { useEffect, useState } from "react";
import React from "react";
import { Movies } from "../types";
import axios from "axios";
import Image from "next/image";
const API_KEY = "826f50ac875ac781d67fa627ccd5498a";
export const Upcomingcomps = () => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
      )
      .then((res) => {
        setMovies(res.data.results);
      });
  }, []);
  const visibleMovies = showAll ? movies : movies.slice(0, 10);
  return (
    <div className="flex flex-col ">
      <div
        className="flex
      justify-between"
      >
        <button
          onClick={() => setShowAll(false)}
          className="text-white text-2xl font-bold p-10"
        >
          Upcoming
        </button>
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-white text-2xl font-bold p-10"
          >
            See more
          </button>
        )}
      </div>
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 w-full h-full p-10 
    "
      >
        {visibleMovies.map((movie) => (
          <div key={movie.id} className="list-none">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full
               h-auto rounded-lg"
              />
            )}
            {movie.title}
          </div>
        ))}
      </div>
    </div>
  );
};
