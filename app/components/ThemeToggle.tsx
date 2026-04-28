"use client";

import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Хуудас ачаалахад системийн горимыг унших
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      // System preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg px-4 py-2 text-sm font-medium
        bg-gray-100 hover:bg-gray-200 text-gray-800
        dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-100
        transition-colors duration-200"
      aria-label="Өнгөт горим солих"
    >
      {isDark ? "☀ Цайвар" : "🌙 Харанхуй"}
    </button>
  );
};
