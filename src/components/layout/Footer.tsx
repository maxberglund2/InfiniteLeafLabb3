// src/components/layout/Footer.tsx
"use client";

import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-moss/80 backdrop-blur-xl border-t border-jade/20">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="text-5xl group-hover:scale-110 transition-transform">
                🍃
              </div>
              <div>
                <h4 className="text-3xl font-bold text-white">Infinite Leaf</h4>
                <p className="text-gray-400 text-sm">Asian Tea</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-md">
              Experience the harmony of traditional Asian tea culture and modern
              tea artistry. Savor rare leaves, classic brews, and innovative
              infusions in a tranquil setting.
            </p>

            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 bg-linear-to-br from-jade to-emerald rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald/50"
                aria-label="Facebook"
              >
                <Facebook className="text-white w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 bg-linear-to-br from-jade to-emerald rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald/50"
                aria-label="Instagram"
              >
                <Instagram className="text-white w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 bg-linear-to-br from-jade to-emerald rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald/50"
                aria-label="Twitter"
              >
                <Twitter className="text-white w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald rounded-full"></span>
              Navigate
            </h5>
            <ul className="space-y-3">
              <li>
                <a
                  href="#menu"
                  className="text-gray-400 hover:text-emerald transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-emerald transition-all duration-300"></span>
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#reservations"
                  className="text-gray-400 hover:text-emerald transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-emerald transition-all duration-300"></span>
                  Reservations
                </a>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="text-gray-400 hover:text-emerald transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-emerald transition-all duration-300"></span>
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald rounded-full"></span>
              Contact
            </h5>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+81312345678"
                  className="text-gray-400 hover:text-emerald transition-colors text-sm flex items-start gap-3 group"
                >
                  <span className="text-emerald mt-0.5">📞</span>
                  <span>(03) 1234-5678</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@infiniteleaf.com"
                  className="text-gray-400 hover:text-emerald transition-colors text-sm flex items-start gap-3 group"
                >
                  <span className="text-emerald mt-0.5">✉️</span>
                  <span>hello@infiniteleaf.com</span>
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-start gap-3">
                <span className="text-emerald mt-0.5">📍</span>
                <span>
                  8 Sakura Lane
                  <br />
                  Hanamachi, Tokyo 100-0001
                </span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald rounded-full"></span>
              Newsletter
            </h5>
            <p className="text-gray-400 text-xs mb-4">
              Stay updated with our latest offers
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 bg-dark-forest/50 border border-jade/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald transition-colors"
              />
              <button className="w-full bg-linear-to-r from-jade to-emerald hover:from-emerald hover:to-jade text-white text-sm font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-jade/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {currentYear} Infinite Leaf. Crafted with 🍃 and passion.
            </p>

            <div className="flex gap-6 text-xs">
              <a
                href="#"
                className="text-gray-500 hover:text-emerald transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-emerald transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-emerald transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
