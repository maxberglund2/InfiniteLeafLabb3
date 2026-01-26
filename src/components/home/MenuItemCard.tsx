"use client";

import React from "react";
import { MenuItemDto } from "@/types/api.types";

interface MenuItemCardProps {
  item: MenuItemDto;
  index: number;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, index }) => {
  return (
    <div
      className="group relative bg-moss rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-dark-forest">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-jade to-emerald">
            <span className="text-6xl opacity-50">🍵</span>
          </div>
        )}

        {/* Popular Badge */}
        {item.isPopular && (
          <div className="absolute top-4 right-4 bg-emerald text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            ⭐ Popular
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-moss via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald transition-colors">
          {item.name}
        </h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-emerald">
            ${item.price.toFixed(2)}
          </span>

          <button className="bg-jade hover:bg-emerald text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
            Order Now
          </button>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border-2 border-jade opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};
