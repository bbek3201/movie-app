"use client";

import { useEffect, useState } from "react";
import { Movies, CastMember, MovieResult } from "@/app/types";
import Link from "next/link";
import axios from "axios";
import React from "react";
import { Play, X } from "lucide-react";

const API_KEY = "d67d8bebd0f4ff345f6505c99e9d0289";

export default function MovieDetails({ params }: { params: any }) {
  const [movie, setMovie] = useState<Movies | any>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [similarMovies, setSimilarMovies] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [playerOpen, setPlayerOpen] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const playerUrl = movie?.id
    ? `https://www.vidking.net/embed/movie/${movie.id}?color=4f46e5`
    : "";

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPage, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 1200, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const [movieRes, creditsRes, similarRes, videoRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&page=${page}`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
          ),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast);
        setCrew(creditsRes.data.crew);
        setSimilarMovies(similarRes.data.results);
        setTotalPage(Math.min(similarRes.data.total_pages, 500));

        const trailer = videoRes.data.results.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube",
        );
        setTrailerKey(trailer?.key || videoRes.data.results[0]?.key || null);
      } catch (error) {
        console.error("Алдаа гарлаа:", error);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );

  if (!movie)
    return <div className="p-10 text-center">Мэдээлэл олдсонгүй.</div>;

  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
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

        <div
          onClick={() => setPlayerOpen(true)}
          className="flex items-center gap-2 cursor-pointer hover:text-indigo-500 transition-colors w-fit font-bold uppercase tracking-wider"
        >
          Trailer <Play size={20} fill="currentColor" />
        </div>
        {playerOpen && trailerKey && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <div className="relative w-full max-w-5xl aspect-video">
              <button
                onClick={() => setPlayerOpen(false)}
                className="absolute -top-12 right-0 text-white flex items-center gap-2 hover:text-indigo-400 font-bold uppercase text-sm"
              >
                <X size={24} /> Close
              </button>
              <iframe
                className="w-full h-full rounded-2xl"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

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

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Watch Movie <Play size={20} />
          </h2>
          <div className="lg:w-2/3 aspect-video relative rounded-3xl shadow-2xl bg-zinc-900 overflow-hidden border border-zinc-800">
            <iframe
              src={playerUrl}
              width="100%"
              height="100%"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        <div className="space-y-8 pt-10 border-t border-zinc-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl uppercase font-black">More Like This</h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-indigo-500 hover:text-indigo-400 transition-colors uppercase text-sm tracking-widest font-bold"
            >
              {showAll ? "❮ Back" : "See More ❯"}
            </button>
          </div>

          {!showAll ? (
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {similarMovies.map((m) => (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className="min-w-50 md:min-w-55 group snap-start"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-2/3 mb-4 shadow-lg bg-zinc-900">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                      alt={m.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-bold text-sm line-clamp-1 group-hover:text-indigo-500 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-yellow-500 font-bold text-sm">
                    ★ {m.vote_average.toFixed(1)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 animate-in fade-in duration-500">
              {similarMovies.map((m) => (
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
          )}

          {showAll && (
            <div className="mt-10 flex items-center justify-center gap-2 md:gap-4 pb-10">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 font-bold disabled:opacity-20"
              >
                ‹ Prev
              </button>
              <div className="flex gap-2">
                {getPageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`h-10 w-10 rounded-xl font-bold transition-all ${page === p ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-zinc-800"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPage}
                className="px-3 py-1 font-bold disabled:opacity-20"
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
