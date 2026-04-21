"use client";

import { useState } from "react";

const movies = [
  {
    title: "Now playing: Moana",
    rating: 7.6,
    descrition:
      "Moana is a 2016 American 3D computer-animated musical adventure film produced by Walt Disney Animation Studios and released by Walt Disney Pictures. The film was directed by Ron Clements and John Musker, co-directed by Don Hall, and produced by Osnat Shurer. It features the voices of Auliʻi Cravalho, Dwayne Johnson, Rachel House, Temuera Morrison, Jemaine Clement, and Nicole Scherzinger. The story follows Moana Waialiki, a Polynesian teenager who sets sail on a daring mission to save her people.",
    image: "moana-2-4dx-movie-7680x4320-19763.jpg",
  },
];
export const HeaderUpcoming = () => {
  const [current, setCurrent] = useState(0);
  const movie = movies[current];
  return (
    <div className="relative w-full h-full">
      <img
        className="w-full h-200 bg-cover"
        src={movies[0].image}
        alt={movies[0].title}
      />
      <div className="absolute top-50 left-50 h-full flex flex-col w-2xl space-y-4 font-sans ">
        <p className="text-4xl font-bold text-white">{movie.title}</p>
        <p className="font-bold text-white">{movie.descrition}</p>
        <span className="flex items-center  gap-1 text-2xl text-white font-bold">
          <img src="star.svg" alt="" />
          {movie.rating}
        </span>
        <button className="bg-blue-500 hover:bg-blue-700 w-50 text-white font-bold py-2 rounded">
          Watch trailer
        </button>
      </div>
      <button className="absolute top-90 right-20 bg-gray-300 hover:bg-gray-500 text-white font-bold py-4 px-4 rounded-full">
        <img src="chevron-right.svg" alt="" />
      </button>
    </div>
  );
};
