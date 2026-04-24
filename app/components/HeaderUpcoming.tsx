"use client";
import { useEffect, useState } from "react";
import { Movies, TrailerResult } from "../types";
import axios from "axios";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export const HeaderUpcoming = () => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [player, setPlayer] = useState<boolean>(false); // Default-оор хаалттай байна

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`)
      .then((res) => {
        setMovies(res.data.results);
      })
      .catch((err) => console.error("Movies fetch error:", err));
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${movies[currentIndex].id}/videos?api_key=${API_KEY}`,
        )
        .then((res) => {
          setTrailerKey(res.data.results[1]?.key);
        });
    }
  }, [currentIndex, movies]);

  const nextSlide = () => {
    setPlayer(false); // Слайд солигдоход видеог хаана
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
    <div className="relative w-full h-200 overflow-hidden group">
      {/* Background Image */}
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col justify-center px-20 space-y-6">
          <p className="text-white text-sm font-semibold uppercase tracking-widest">
            Upcoming
          </p>
          <h1 className="text-6xl font-bold text-white max-w-2xl leading-tight">
            {currentMovie.title}
          </h1>
          <p className="text-gray-200 text-lg max-w-xl line-clamp-3">
            {currentMovie.overview}
          </p>

          <button
            onClick={() => setPlayer(true)}
            className="flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-bold transition-all w-fit uppercase text-sm tracking-widest active:scale-95"
          >
            Watch Trailer
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      {player && trailerKey && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-10">
          <div className="relative w-full max-w-5xl aspect-video shadow-2xl">
            <button
              onClick={() => setPlayer(false)}
              className="absolute -top-12 right-0 text-white flex items-center gap-2 hover:text-gray-300 transition-colors"
            >
              Close <span className="text-2xl font-bold">×</span>
            </button>
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube video player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-4 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
      >
        <img src="/left.svg" alt="prev" className="w-6 h-6 invert" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-4 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
      >
        <img src="/chevron-right.svg" alt="next" className="w-6 h-6 invert" />
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {movies.slice(0, 10).map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 cursor-pointer rounded-full transition-all duration-500 ${
              index === currentIndex ? "w-10 bg-indigo-600" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
