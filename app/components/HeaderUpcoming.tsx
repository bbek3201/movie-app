"use client";
import { useEffect, useState } from "react";
import { Movies } from "../types";
import axios from "axios";
import Link from "next/link";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";
const AUTO_SLIDE_INTERVAL = 2000;

export const HeaderUpcoming = () => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [player, setPlayer] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`)
      .then((res) => {
        setMovies(res.data.results.slice(0, 5));
      })
      .catch((err) => console.error("Movies fetch error:", err));
  }, []);

  useEffect(() => {
    if (player || movies.length === 0) return;
    const interval = setInterval(() => nextSlide(), AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [currentIndex, player, movies]);

  useEffect(() => {
    if (movies.length > 0) {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${movies[currentIndex].id}/videos?api_key=${API_KEY}`,
        )
        .then((res) => {
          const trailer = res.data.results.find(
            (v: any) => v.type === "Trailer",
          );
          setTrailerKey(trailer?.key || res.data.results[0]?.key);
        });
    }
  }, [currentIndex, movies]);

  const nextSlide = () => {
    setPlayer(false);
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setPlayer(false);
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  if (movies.length === 0)
    return <div className="h-150 w-full bg-zinc-900 animate-pulse" />;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-150 md:h-200 overflow-hidden group">
      <Link href={`/movie/${currentMovie.id}`} className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
        </div>
      </Link>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center px-10 md:px-20 space-y-6">
        <div className="pointer-events-auto space-y-6">
          <p className="text-indigo-500 text-sm font-black uppercase tracking-[0.3em]">
            Now playing
          </p>

          <Link href={`/movie/${currentMovie.id}`}>
            <h1 className="text-4xl md:text-7xl font-black text-white max-w-3xl leading-tight hover:text-indigo-400 transition-colors cursor-pointer">
              {currentMovie.title}
            </h1>
          </Link>

          <p className="text-gray-300 text-base md:text-lg max-w-xl line-clamp-3 font-medium">
            {currentMovie.overview}
          </p>

          <button
            onClick={(e) => {
              e.preventDefault();
              setPlayer(true);
            }}
            className="flex items-center gap-3 border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 rounded-full font-black transition-all w-fit uppercase text-xs tracking-widest active:scale-95"
          >
            Watch Trailer
          </button>
        </div>
      </div>

      {player && trailerKey && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl aspect-video shadow-2xl">
            <button
              onClick={() => setPlayer(false)}
              className="absolute -top-14 right-0 text-white flex items-center gap-2 hover:text-indigo-400 transition-colors font-bold uppercase text-sm tracking-widest"
            >
              Close <span className="text-3xl">&times;</span>
            </button>
            <iframe
              className="w-full h-full rounded-2xl"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-indigo-600 p-4 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
      >
        <span className="text-white text-2xl">‹</span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-indigo-600 p-4 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
      >
        <span className="text-white text-2xl">›</span>
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {movies.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 cursor-pointer rounded-full transition-all duration-700 ${
              index === currentIndex ? "w-12 bg-indigo-600" : "w-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
