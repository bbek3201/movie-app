import React from "react";
import { Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#4338CA] text-white py-10 px-10 md:px-20">
      <div className="max-w-7xl mx-auto justify-between flex">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="p-1.5 bg-white rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4338CA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 3v18" />
                <path d="M3 7.5h4" />
                <path d="M3 12h18" />
                <path d="M3 16.5h4" />
                <path d="M17 3v18" />
                <path d="M17 7.5h4" />
                <path d="M17 16.5h4" />
              </svg>
            </div>
            <span className="text-4 font-bold">Movie Z</span>
          </div>
          <p className="text-sm opacity-80">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>
        <div className="flex gap-24">
          <div className="space-y-4">
            <h3 className=" text-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={8} />
                <div>
                  <p className="text-xs font-bold uppercase opacity-60">
                    Email:
                  </p>
                  <p className="text-sm">support@moviez.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={8} />
                <div>
                  <p className="text-xs font-bold uppercase opacity-60">
                    Phone:
                  </p>
                  <p className="text-sm">+976 11 123 4567</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className=" text-3">Follow us</h3>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <a
                href="#"
                className="text-sm hover:underline flex items-center gap-2"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-sm hover:underline flex items-center gap-2"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-sm hover:underline flex items-center gap-2"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm hover:underline flex items-center gap-2"
              >
                Youtube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
