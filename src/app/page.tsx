// src/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { MenuItemDto } from "@/types/api.types";
import { menuService } from "@/services/menu.service";
import { MenuItemCard } from "@/components/home/MenuItemCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const [popularItems, setPopularItems] = useState<MenuItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await menuService.getPopular();
        if (response.data) {
          setPopularItems(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch popular items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  return (
    <div className="min-h-screen ">
      {/* Navigation - Now always uses StaggeredMenu */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Decorative Elements */}


        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fadeIn">
            Welcome to
            <span className="block text-[#1F7D53] mt-2">Infinite Leaf</span>
          </h2>

          <p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeIn"
            style={{ animationDelay: "200ms" }}
          >
            Experience the harmony of traditional Asian flavors and modern
            culinary artistry
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn"
            style={{ animationDelay: "400ms" }}
          >
            <button className="bg-[#1F7D53] hover:bg-[#255F38] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Reserve a Table
            </button>
            <button className="border-2 border-[#1F7D53] text-white hover:bg-[#1F7D53] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#255F38] to-transparent"></div>
      </div>

      {/* Popular Items Section */}
      <section id="menu" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-4">
              Popular Selections
            </h3>
            <p className="text-gray-400 text-lg">
              Discover our most beloved dishes, crafted with care and tradition
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#255F38] border-t-[#1F7D53] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🍃</span>
                </div>
              </div>
            </div>
          ) : popularItems.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p className="text-xl">
                No popular items available at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularItems.map((item, index) => (
                <div key={item.id} className="animate-fadeIn">
                  <MenuItemCard item={item} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-[#27391C]/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-5xl font-bold text-white">Our Story</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Infinite Leaf brings together centuries of Asian culinary
                tradition with contemporary dining excellence. Each dish is a
                journey through the flavors of China and Japan, prepared with
                authentic techniques and the finest ingredients.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From our tranquil tea ceremonies to our modern fusion cuisine,
                we invite you to experience a harmonious blend of past and
                present.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1F7D53]">15+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[1F7D53]">100+</div>
                  <div className="text-gray-400 text-sm">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1F7D53]">5K+</div>
                  <div className="text-gray-400 text-sm">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-[#255F38] to-[#1F7D53] flex items-center justify-center">
                <span className="text-9xl opacity-50">🏮</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
