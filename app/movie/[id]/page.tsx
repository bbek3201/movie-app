"use client";

import { use, useEffect, useState } from "react";
import { Navigation } from "@/app/components/Navigation";
import { Movies, CastMember, MovieResult } from "@/app/types";
import Link from "next/link";
import axios from "axios";
import React from "react";
import { Play } from "lucide-react";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export default function MovieDetails({ params }: { params: any }) {
  const [movie, setMovie] = useState<Movies | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [similarMovies, setSimilarMovies] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const playerUrl = movie?.id
    ? `https://www.vidking.net/embed/movie/${movie.id}?color=4f46e5`
    : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const [movieRes, creditsRes, similarRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&page=${page}`,
          ),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast);
        setCrew(creditsRes.data.crew);
        setSimilarMovies(similarRes.data.results);
        setTotalPage(similarRes.data.total_pages);
      } catch (error) {
        console.error("Дата татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, page]);

  useEffect(() => {
    setPage(1);
    setShowAll(false);
  }, [params]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );

  if (!movie)
    return <div className="p-10 text-center">Мэдээлэл олдсонгүй.</div>;

  const director = crew.find((m: any) => m.job === "Director");
  const writers = crew.filter(
    (m: any) => m.job === "Writer" || m.job === "Screenplay",
  );
  const stars = cast.slice(0, 3);
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  const visibleMovies = showAll ? similarMovies : similarMovies.slice(0, 5);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navigation />
      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-16">
        <div className="flex justify-between items-end border-b border-gray-100 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-3">
              {movie.title}
            </h1>
            <p className="text-gray-500 text-lg font-medium italic">
              {movie.release_date?.split("-")[0]} • {movie.genres?.[0]?.name} •{" "}
              {hours}h {minutes}m
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-900 px-6 py-3 rounded-2xl text-center shadow-sm">
            <p className="text-yellow-500 font-bold text-2xl">
              ★ {movie.vote_average?.toFixed(1)}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Rating
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 aspect-video">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              className="rounded-3xl w-full h-full object-cover shadow-2xl"
              alt="backdrop"
            />
          </div>

          <div className="lg:w-1/3 hidden lg:block aspect-2/3">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              className="rounded-3xl w-full h-full object-cover shadow-2xl"
              alt="poster"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g: any) => (
                <span
                  key={g.id}
                  className="px-5 py-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black">Overview</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {movie.overview}
              </p>
            </div>

            <div className="border-y border-gray-100 dark:border-zinc-800 py-8 space-y-6">
              {director && (
                <div className="flex gap-6 items-start">
                  <span className="font-black w-28 shrink-0 text-gray-400 uppercase text-sm mt-1">
                    Director
                  </span>
                  <span className="text-indigo-500 font-bold text-lg">
                    {director.name}
                  </span>
                </div>
              )}

              {writers.length > 0 && (
                <div className="flex gap-6 items-start">
                  <span className="font-black w-28 shrink-0 text-gray-400 uppercase text-sm mt-1">
                    Writers
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {writers.slice(0, 3).map((w: any, i: number) => (
                      <span
                        key={w.id}
                        className="text-indigo-500 font-bold text-lg"
                      >
                        {w.name}
                        {i < writers.slice(0, 3).length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {stars.length > 0 && (
                <div className="flex gap-6 items-start">
                  <span className="font-black w-28 shrink-0 text-gray-400 uppercase text-sm mt-1">
                    Stars
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {stars.map((s: any, i: number) => (
                      <span
                        key={s.id}
                        className="text-indigo-500 font-bold text-lg"
                      >
                        {s.name}
                        {i < stars.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            {" "}
            WATCH
            <Play />
          </div>
          <div className="lg:w-2/3 aspect-video relative overflow-hidden rounded-3xl shadow-2xl bg-zinc-900 border border-zinc-800">
            {movie ? (
              <iframe
                src={playerUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title={movie.title}
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-zinc-500">
                  Уншиж байна...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10 pt-10 border-t border-zinc-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl  uppercase ">More Like This</h2>
            <button
              onClick={() => {
                setShowAll(!showAll);
                if (showAll) {
                  setPage(1);
                  window.scrollTo({ top: 800, behavior: "smooth" });
                }
              }}
              className="text-indigo-500  hover:text-indigo-400 transition-colors uppercase text-sm tracking-widest"
            >
              {showAll ? "Prev" : "See More ❯"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {visibleMovies.map((m) => (
              <Link key={m.id} href={`/movie/${m.id}`} className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-2/3 mb-4 shadow-xl bg-zinc-900 border border-zinc-800/50">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-bold text-base line-clamp-1 group-hover:text-indigo-500 transition-colors">
                  {m.title}
                </h3>
                <p className="text-yellow-500 font-black text-lg">
                  ★ {m.vote_average.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500 font-bold">
                  {m.release_date?.split("-")[0]}
                </p>
              </Link>
            ))}
          </div>

          {showAll && (
            <div className="mt-14 flex items-center justify-center gap-6 pb-20 select-none">
              {/* Өмнөх товчлуур */}
              <button
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 1200, behavior: "smooth" });
                }}
                disabled={page === 1}
                className="flex items-center gap-2 text-sm font-bold text-white transition-all hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <span className="text-xl">‹</span> Previous
              </button>

              {/* Хуудасны тоонууд */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((pageNumber) => {
                  const isActive = page === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => {
                        setPage(pageNumber);
                        window.scrollTo({ top: 1200, behavior: "smooth" });
                      }}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "border border-zinc-700 bg-zinc-900 text-white shadow-lg font-black"
                          : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Цэгүүд */}
                <span className="px-2 text-zinc-600 font-bold">...</span>

                {/* Сүүлчийн хуудас */}
                <button
                  onClick={() => {
                    setPage(totalPage);
                    window.scrollTo({ top: 1200, behavior: "smooth" });
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    page === totalPage
                      ? "border border-zinc-700 bg-zinc-900 text-white"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {totalPage > 500 ? 500 : totalPage}
                </button>
              </div>

              {/* Дараах товчлуур */}
              <button
                onClick={() => {
                  setPage((prev) => Math.min(prev + 1, totalPage));
                  window.scrollTo({ top: 1200, behavior: "smooth" });
                }}
                disabled={page === totalPage}
                className="flex items-center gap-2 text-sm font-bold text-white transition-all hover:opacity-70 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Next <span className="text-xl">›</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
