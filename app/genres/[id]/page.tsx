"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Star, X } from "lucide-react";
import { Genre, Movie } from "@/app/types";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export default function GenreSearchPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]); // ✅ array болгосон
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingGenres, setLoadingGenres] = useState<boolean>(true);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(true);

  useEffect(() => {
    setLoadingGenres(true);
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => setGenres(res.data.genres))
      .catch((err) => console.error("Genres fetch error:", err))
      .finally(() => setLoadingGenres(false));
  }, []);

  useEffect(() => {
    setLoadingMovies(true);
    const genreParam = selectedGenres.join(","); // ✅ олон genre-г comma-р холбоно
    const url =
      selectedGenres.length > 0
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreParam}&page=${currentPage}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`;

    axios
      .get(url)
      .then((res) => {
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      })
      .catch((err) => console.error("Movies fetch error:", err))
      .finally(() => setLoadingMovies(false));
  }, [selectedGenres, currentPage]);

  // ✅ Genre toggle — сонгох/цуцлах
  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen w-full font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      <main className="container mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">
            Search Filter
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            See lists of movies by genre
          </p>
          <div className="h-1 w-20 bg-indigo-600 mt-4 rounded-full" />
        </header>

        <div className="flex gap-10">
          <aside className="w-64 shrink-0">
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Genres</h2>

                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="text-xs text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {loadingGenres ? (
                <div className="animate-pulse text-zinc-500 text-sm">
                  Loading...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genres.map((gen) => {
                    const isSelected = selectedGenres.includes(gen.id);
                    return (
                      <button
                        key={gen.id}
                        onClick={() => toggleGenre(gen.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400 dark:hover:border-indigo-500"
                        }`}
                      >
                        {gen.name}

                        {isSelected && <X className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <section className="flex-1 space-y-8">
            {selectedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Genres:
                </span>
                {selectedGenres.map((id) => {
                  const genre = genres.find((g) => g.id === id);
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {genre?.name}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-white"
                        onClick={() => toggleGenre(id)}
                      />
                    </span>
                  );
                })}
              </div>
            )}

            {loadingMovies ? (
              <div className="flex justify-center py-20 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl items-center">
                <div className="animate-pulse text-zinc-400 font-medium text-lg">
                  Loading movies...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 text-sm">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-white font-bold text-xs">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2 group-hover:text-indigo-500 transition-colors">
                        {movie.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-600 dark:text-zinc-400 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                      currentPage === index + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                {totalPages > 5 && (
                  <span className="text-zinc-400 self-center px-1">...</span>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-600 dark:text-zinc-400 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
