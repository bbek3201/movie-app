"use client";

import React from "react";
import { Input } from "./Input";

export const Navigation = () => {
  return (
    <div className="flex w-full h-14.75 justify-between px-20 items-center">
      <div className="flex gap-2 items-center">
        <img className="w-5 h-5" src="film.svg" alt="" />
        <p className="text-indigo-700 text-[16px] flex"> Movie Z</p>
      </div>

      <div className="flex gap-2 items-center ">
        <button className="flex gap-2 border border-gray-300 rounded-sm px-2 py-1 items-center">
          <img className="w-5 h-5" src="chevron-down.svg" alt="" />
          <p className="font-bold">Genre</p>
        </button>

        <Input
          type="text"
          onChange={(e) => {
            e.target.value;
          }}
          placeholder="Search..."
        />
      </div>
      <button className="border border-gray-300 rounded-sm px-2 py-1    ">
        <img src="moon.svg" alt="" className=" h-4 w-4" />
      </button>
    </div>
  );
};
