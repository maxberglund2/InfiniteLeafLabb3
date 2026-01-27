"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItemDto } from "@/types/api.types";

interface MenuItemCardProps {
  item: MenuItemDto;
  index: number;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, index }) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    imageError || !item.imageUrl ? "/fallback.jpg" : item.imageUrl;

  return (
    <div
      className="relative bg-moss/40 border border-jade/30 rounded-xl overflow-hidden backdrop-blur-md hover:border-jade/60 transition-colors duration-300"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-dark-forest overflow-hidden">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />

        {/* Popular Badge */}
        {item.isPopular && (
          <div className="absolute top-3 right-3 bg-emerald/90 backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-semibold">
            Popular
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name & Price Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-white text-lg font-semibold leading-tight flex-1">
            {item.name}
          </h3>
          <span className="text-emerald text-xl font-bold whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-400 text-sm leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};
