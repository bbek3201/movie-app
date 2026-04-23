"use client";
import { useEffect, useState } from "react";
import { Movies } from "../types";
import axios from "axios";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export const HeaderUpcoming = () => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`)
      .then((res) => {
        setMovies(res.data.results);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  if (movies.length === 0)
    return <div className="h-150 w-full bg-zinc-900 animate-pulse" />;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-200 overflow-hidden group">
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col justify-center px-20 space-y-4">
          <p className="text-white text-sm font-semibold uppercase tracking-widest">
            Upcoming
          </p>
          <h1 className="text-5xl font-bold text-white max-w-2xl">
            {currentMovie.title}
          </h1>
          <p className="text-gray-200 text-lg max-w-xl line-clamp-3">
            {currentMovie.overview}
          </p>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <img
          src="left.svg
        "
          alt=""
          className="w-6 h-6 invert"
        />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <img src="chevron-right.svg" alt="next" className="w-6 h-6 invert" />
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.slice(0, 10).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-indigo-600" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};
