// src/components/MenuItemCard.tsx
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
      className="group relative bg-[#27391C] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-[#18230F]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#255F38] to-[#1F7D53]">
            <span className="text-6xl opacity-50">🍵</span>
          </div>
        )}

        {/* Popular Badge */}
        {item.isPopular && (
          <div className="absolute top-4 right-4 bg-[#1F7D53] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            ⭐ Popular
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#27391C] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#1F7D53] transition-colors">
          {item.name}
        </h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-[#1F7D53]">
            ${item.price.toFixed(2)}
          </span>

          <button className="bg-[#255F38] hover:bg-[#1F7D53] text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
            Order Now
          </button>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border-2 border-[#255F38] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};
