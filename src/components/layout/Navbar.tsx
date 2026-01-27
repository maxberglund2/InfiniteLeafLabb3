"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import Link from "next/link";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Menu", ariaLabel: "View our menu", link: "#menu" },
  { label: "Table", ariaLabel: "Make a reservation", link: "#table" },
  { label: "Admin", ariaLabel: "Admin portal", link: "/auth" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "Facebook", link: "https://facebook.com" },
  { label: "Twitter", link: "https://twitter.com" },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayHandlerRef = useRef<(() => void) | null>(null);

  // Function to toggle the blur overlay
  const toggleBlurOverlay = (open: boolean) => {
    const overlay = document.getElementById("blurOverlay");
    if (overlay) {
      // Remove old listener if exists
      if (overlayHandlerRef.current) {
        overlay.removeEventListener("click", overlayHandlerRef.current);
        overlayHandlerRef.current = null;
      }

      if (open) {
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";

        // Create and attach new click handler
        overlayHandlerRef.current = () => {
          handleMenuClose();
        };
        overlay.addEventListener("click", overlayHandlerRef.current);
      } else {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
      }
    }
  };

  useEffect(() => {
    return () => {
      const overlay = document.getElementById("blurOverlay");
      if (overlay && overlayHandlerRef.current) {
        overlay.removeEventListener("click", overlayHandlerRef.current);
      }
    };
  }, []);

  // Callbacks for side effects
  const handleMenuOpen = useCallback(() => {
    setMenuOpen(true);
    toggleBlurOverlay(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
    toggleBlurOverlay(false);
  }, []);

  // Main toggle function
  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      handleMenuClose();
    } else {
      handleMenuOpen();
    }
  }, [menuOpen, handleMenuClose, handleMenuOpen]);

  // Configuration for the Menu Button styles
  const menuButtonColor = "#D4D4D4"; // Light gray for closed state
  const openMenuButtonColor = "#ffffff"; // White when open

  return (
    <>
      {/* The Unified Fixed Header */}
      <header className="fixed top-0 left-0 w-full p-6 z-[60] flex items-center justify-between pointer-events-none">
        {/* 1. Logo/Branding on the left */}
        <Link
          className="flex items-center select-none pointer-events-auto hover:scale-105 transition-transform"
          href="/"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">🍃</div>
            <div className="text-white font-bold text-xl tracking-wide">
              Infinite Leaf
            </div>
          </div>
        </Link>

        {/* 2. Menu Toggle Button on the right */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            className="sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible transition-colors duration-300"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            type="button"
            style={{ color: menuOpen ? openMenuButtonColor : menuButtonColor }}
          >
            {/* Text label that changes */}
            <span className="font-bold tracking-wider text-base">
              {menuOpen ? "CLOSE" : "MENU"}
            </span>

            {/* Animated Cross Icon */}
            <span className="relative w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center">
              {/* Horizontal Line */}
              <span
                className={`absolute left-1/2 top-1/2 w-full h-0.5 bg-current rounded-xs -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out ${menuOpen ? "rotate-45" : "rotate-0"}`}
              />
              {/* Vertical Line */}
              <span
                className={`absolute left-1/2 top-1/2 w-full h-0.5 bg-current rounded-xs -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out ${menuOpen ? "-rotate-45" : "rotate-90"}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* The Controlled Menu Panel */}
      <StaggeredMenu
        isFixed={true}
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        position="right"
        accentColor="#1F7D53"
        colors={["#18230F", "#27391C", "#255F38"]}
        className="top-0 z-50 w-full h-screen"
        // CONTROL PROPS
        open={menuOpen}
        onToggle={toggleMenu}
        onMenuOpen={toggleBlurOverlay.bind(null, true)}
        onMenuClose={toggleBlurOverlay.bind(null, false)}
      />
    </>
  );
};
