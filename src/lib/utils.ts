import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomFallbackImage = (index: number): string => {
  const randomFallbacks = [
    "/fallback1.svg",
    "/fallback2.svg",
    "/fallback3.svg",
  ]
  return randomFallbacks[index % randomFallbacks.length]
}