"use client";
import React, { useEffect, useState } from "react";
import { Navigation } from "@/app/components/Navigation";
import axios from "axios";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

// Кино болон Төрлийн төрөл (type) тодорхойлох
interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export default function GenreSearchPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingGenres, setLoadingGenres] = useState<boolean>(true);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(true);

  useEffect(() => {
    setLoadingGenres(true);
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => {
        const fetchedGenres = res.data.genres;
        setGenres(fetchedGenres);

        if (fetchedGenres.length > 0) {
          setSelectedGenre(fetchedGenres[0].id);
        }
      })
      .catch((err) => console.error("Genres fetch error:", err))
      .finally(() => setLoadingGenres(false));
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      setLoadingMovies(true);

      axios
        .get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${currentPage}`,
        )
        .then((res) => {
          setMovies(res.data.results);
          setTotalPages(res.data.total_pages);
        })
        .catch((err) => console.error("Movies fetch error:", err))
        .finally(() => setLoadingMovies(false));
    }
  }, [selectedGenre, currentPage]);

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  return (
    <div className=" min-h-screen w-full font-sans text-white">
      <main className="container mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">
            Search Filter
          </h1>
          <p className="text-zinc-400 text-lg">See lists of movies by genre</p>
          <div className="h-1 w-20 bg-indigo-600 mt-4 rounded-full"></div>
        </header>

        <div className="flex gap-10">
          <aside className="w-200 space-y-12 flex-wrap">
            <section className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-8">Genres</h2>

              {loadingGenres ? (
                <div className="flex justify-center py-10">
                  <div className="animate-pulse text-zinc-600 font-medium">
                    Loading genres...
                  </div>
                </div>
              ) : (
                <div className="space-y-3 flex flex-wrap gap-3">
                  {genres.map((gen) => (
                    <button
                      key={gen.id}
                      onClick={() => handleGenreSelect(gen.id)}
                      className={` flex items-center flex-wrap justify-between p-1 rounded-full transition-all duration-300 shadow-sm border gap-5 ${
                        selectedGenre === gen.id
                          ? "bg-zinc-800 border-indigo-500"
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                      }`}
                    >
                      <span className="font-semibold text-base transition-colors group-hover:text-white">
                        {gen.name}
                      </span>

                      <div
                        className={`flex items-center justify-center w-4 h-4  rounded-lg transition-colors ${
                          selectedGenre === gen.id
                            ? "bg-indigo-600"
                            : "bg-zinc-800 group-hover:bg-zinc-700"
                        }`}
                      >
                        <ChevronRight
                          className={`w-2 h-2 transition-all ${
                            selectedGenre === gen.id
                              ? "opacity-100"
                              : "opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </aside>

          <section className="w-3/4 space-y-12">
            {loadingMovies ? (
              <div className="flex justify-center py-20 bg-zinc-950 border border-zinc-800 rounded-3xl h-full items-center">
                <div className="animate-pulse text-zinc-600 font-medium text-lg">
                  Loading movies...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-indigo-500 transition-colors"
                  >
                    <div className="aspect-2/3 relative overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                          No Image
                        </div>
                      )}

                      <div className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-2 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-zinc-100 line-clamp-2 group-hover:text-white transition-colors">
                        {movie.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <footer className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2  disabled:opacity-40 disabled:cursor-not-allowed "
              >
                Previous
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${currentPage === index + 1 ? "bg-indigo-600 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                {totalPages > 5 && (
                  <span className="text-zinc-600 self-end">...</span>
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
              >
                Next
              </button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
