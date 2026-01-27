"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MenuItemDto } from "@/types/api.types";
import { menuService } from "@/services/menu.service";
import { MenuItemCard } from "@/components/shared/MenuItemCard";
import AnimatedContent from "@/components/ui/AnimatedContent";

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

  const stats = [
    { label: "YEARS EXPERIENCE", value: "15+" },
    { label: "MENU ITEMS", value: "100+" },
    { label: "HAPPY CUSTOMERS", value: "5K+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fadeIn">
            Welcome to
            <span className="block text-emerald mt-2">Infinite Leaf</span>
          </h2>

          <p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeIn"
            style={{ animationDelay: "200ms" }}
          >
            Experience the harmony of traditional Asian tea culture and modern
            tea artistry. Savor rare leaves, classic brews, and innovative
            infusions in a tranquil setting.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn"
            style={{ animationDelay: "400ms" }}
          >
            <Link
              href="/table"
              className="bg-emerald hover:bg-jade text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Reserve a Table
            </Link>

            <Link href="/menu" className="border-2 box-border border-emerald text-white hover:bg-emerald px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              View Tea Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-linear-to-r from-transparent via-jade to-transparent"></div>
      </div>

      {/* Popular Items Section */}
      <section id="menu" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white mb-4">Popular Teas</h3>
            <p className="text-gray-400 text-lg">
              Discover our most beloved teas, curated from the finest Asian
              leaves and crafted with care and tradition.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-100">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-jade border-t-emerald rounded-full animate-spin"></div>
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
      <section id="about" className="py-20 px-6 bg-dark-forest/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-5xl font-bold text-white">Our Story</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Infinite Leaf brings together centuries of Asian tea tradition
                with a contemporary twist. Each cup is a journey through the tea
                cultures of China, Japan, and beyond, prepared with authentic
                techniques and the finest leaves.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From tranquil tea ceremonies to creative modern infusions, we
                invite you to experience a harmonious blend of past and
                present—one sip at a time.
              </p>
            </div>
            <AnimatedContent
              distance={50}
              direction="horizontal"
              reverse={true}
            >
              <div className="relative h-100 w-full border-2 border-emerald p-2 rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-moss flex items-center justify-center">
                  <span className="text-9xl filter grayscale contrast-150">
                    🍵
                  </span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald -z-10"></div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>
      {/* Community Stats Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              More Than Just Tea
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're a community of tea lovers, explorers, and friends who
              celebrate the art and culture of Asian tea. When you share a cup
              at Infinite Leaf, you're part of something special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <AnimatedContent key={idx} delay={idx * 0.1} distance={20}>
                <div className="p-8 border border-jade bg-moss hover:bg-jade transition-colors duration-300 flex flex-col items-center justify-center text-center h-full group">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-emerald transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-bold tracking-widest text-gray-500 uppercase">
                    {stat.label}
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
