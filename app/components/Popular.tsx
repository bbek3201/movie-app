"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Movies } from "../types";
import axios from "axios";
type Props = {
  skip: number;
  setTotal: Dispatch<SetStateAction<number>>;
};
const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";
export const Popular = ({ skip, setTotal }: Props) => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const page = Math.floor(skip / 20) + 1;
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`,
      )
      .then((res) => {
        setMovies(res.data.results);
        setTotal(res.data.total_results);
      });
  }, [skip]);
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
          Popular
        </button>
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="text-white text-2xl font-bold p-10"
          >
            Back
          </button>
        )}
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
