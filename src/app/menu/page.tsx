"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { MenuItemDto } from "@/types/api.types";
import { menuService } from "@/services/menu.service";
import { MenuItemCard } from "@/components/shared/MenuItemCard";
import { Loading } from "@/components/shared/Loading";

type FilterOption = "all" | "popular" | "classic" | "specialty";

interface FilterStats {
  all: number;
  popular: number;
  classic: number;
  specialty: number;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);


  const fetchMenuItems = async () => {
    try {
      const response = await menuService.getAll();
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...menuItems];

    if (activeFilter === "popular") {
      filtered = filtered.filter((item) => item.isPopular);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterItems();
  }, [activeFilter, searchQuery, menuItems]);

  const getFilterStats = (): FilterStats => {
    return {
      all: menuItems.length,
      popular: menuItems.filter((item) => item.isPopular).length,
      classic: 0,
      specialty: 0,
    };
  };

  const stats = getFilterStats();

  const filters: { value: FilterOption; label: string; count: number }[] = [
    { value: "all", label: "All Teas", count: stats.all },
    { value: "popular", label: "Popular", count: stats.popular },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fadeIn">
            Our Tea
            <span className="block text-emerald mt-2">Collection</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeIn"
            style={{ animationDelay: "100ms" }}
          >
            Discover our carefully curated selection of premium teas from across
            Asia. Each blend is crafted with passion and tradition.
          </p>

          <div
            className="max-w-2xl mx-auto mb-8 animate-fadeIn"
            style={{ animationDelay: "200ms" }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search teas by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-moss/50 border border-jade/50 rounded-full 
                           text-white placeholder-gray-400 outline-none
                           focus:ring-2 focus:ring-emerald focus:border-transparent
                           transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
            </div>
          </div>

          <div
            className="flex flex-wrap justify-center gap-3 mb-4 animate-fadeIn"
            style={{ animationDelay: "300ms" }}
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === filter.value
                    ? "bg-emerald text-white shadow-lg shadow-emerald/50 scale-105"
                    : "bg-moss/50 border border-jade/30 text-gray-300 hover:border-jade hover:scale-105"
                }`}
              >
                {filter.label}
                <span className="ml-2 text-sm opacity-75">
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-linear-to-r from-transparent via-jade to-transparent"></div>
      </div>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <Loading message="Loading our tea collection..." />
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍃</div>
              <p className="text-xl text-gray-400">
                {searchQuery
                  ? `No teas found matching "${searchQuery}"`
                  : "No teas available in this category"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-emerald hover:text-jade transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <p className="text-gray-400 text-lg">
                  Showing {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "tea" : "teas"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredItems.map((item, index) => (
                  <div key={item.id}>
                    <MenuItemCard item={item} index={index} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {!isLoading && filteredItems.length > 0 && (
        <section className="py-20 px-4 bg-moss/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience Our Teas?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Reserve a table and let our tea masters guide you through an
              unforgettable journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/table"
                className="bg-linear-to-r from-jade to-emerald hover:from-emerald hover:to-jade 
                           text-white px-8 py-4 rounded-full text-lg font-semibold 
                           transition-all duration-300 transform hover:scale-105 shadow-lg inline-block text-center"
              >
                Reserve a Table
              </Link>
              <Link
                href="/"
                className="border-2 border-emerald text-white hover:bg-emerald 
                           px-8 py-4 rounded-full text-lg font-semibold 
                           transition-all duration-300 transform hover:scale-105 inline-block text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
